import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '@/shared/config/firebase';
import type { UserData, InstitutionData } from '@/shared/types/user';
import { signOut } from '@/features/auth/services/authService';
import {
  setupNotificationHandler,
  registerForPushNotifications,
} from '@/features/notifications/services/notificationPushService';
import {
  startLocationTracking,
  stopLocationTracking,
} from '@/shared/services/locationTrackingService';

// Suscripción a cambios de institución (para agentes)
let institutionUnsubscribe: Unsubscribe | null = null;

interface AuthState {
  user: User | null;
  userData: UserData | null;
  institutionData: InstitutionData | null;
  inactiveAccountError: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => () => void;
  setUserData: (data: UserData | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  institutionData: null,
  inactiveAccountError: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: () => {
    // Safety timeout: si onAuthStateChanged no dispara en 10s (ej. hot reload),
    // forzar isLoading=false para evitar spinner infinito
    const safetyTimeout = setTimeout(() => {
      if (get().isLoading) {
        console.warn('[Auth] Safety timeout: auth no resolvió en 10s, forzando isLoading=false');
        set({ isLoading: false });
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimeout);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? (userDoc.data() as UserData) : null;

          // Validar cuenta de agente inactiva
          if (userData?.role === 'agent' && !userData.isActive) {
            console.log('[Auth] Agente inactivo detectado, cerrando sesión');
            set({
              inactiveAccountError: 'Tu cuenta de agente ha sido desactivada. Contacta al administrador.',
              isLoading: false,
            });
            await signOut();
            return;
          }

          // Suscribirse a cambios de institución para agentes (tiempo real)
          if (userData?.role === 'agent' && userData.institutionId) {
            // Limpiar suscripción anterior si existe
            if (institutionUnsubscribe) {
              institutionUnsubscribe();
            }

            // Obtener datos iniciales
            try {
              const instDoc = await getDoc(doc(db, 'institutions', userData.institutionId));
              const initialInstitutionData = instDoc.exists() ? (instDoc.data() as InstitutionData) : null;
              console.log('[Auth] Datos de institución cargados:', initialInstitutionData?.name);

              set({
                user: firebaseUser,
                userData,
                institutionData: initialInstitutionData,
                inactiveAccountError: null,
                isLoading: false,
                isAuthenticated: true,
              });
            } catch (instError) {
              console.error('[Auth] Error al obtener institución:', instError);
              set({
                user: firebaseUser,
                userData,
                institutionData: null,
                inactiveAccountError: null,
                isLoading: false,
                isAuthenticated: true,
              });
            }

            // Suscribirse a cambios futuros de la institución
            institutionUnsubscribe = onSnapshot(
              doc(db, 'institutions', userData.institutionId),
              (snapshot) => {
                if (snapshot.exists()) {
                  const updatedInstitution = snapshot.data() as InstitutionData;
                  console.log('[Auth] Institución actualizada en tiempo real:', updatedInstitution.name);
                  set({ institutionData: updatedInstitution });
                } else {
                  console.warn('[Auth] Institución eliminada');
                  set({ institutionData: null });
                }
              },
              (error) => {
                console.error('[Auth] Error en suscripción de institución:', error);
              },
            );
          } else {
            set({
              user: firebaseUser,
              userData,
              institutionData: null,
              inactiveAccountError: null,
              isLoading: false,
              isAuthenticated: true,
            });
          }

          // Registrar push notifications (no bloquea el flujo de auth)
          setupNotificationHandler();
          registerForPushNotifications(firebaseUser.uid)
            .then((token) => {
              if (token) {
                console.log('[Auth] ✅ Push notifications registradas exitosamente');
              } else {
                console.warn('[Auth] ⚠️ Push notifications no registradas (ver logs [Push] para detalles)');
              }
            })
            .catch((err) => {
              console.error('[Auth] ❌ Error registrando push notifications:', err);
            });

          // Iniciar tracking de ubicación para ciudadanos (notificaciones de proximidad)
          if (userData?.role === 'citizen') {
            startLocationTracking(firebaseUser.uid);
          }
        } catch (error) {
          console.error('[Auth] Error al obtener datos del usuario:', error);
          // No dejar isAuthenticated=true sin userData — causa navegación a pantalla de ciudadano sin datos
          set({ user: null, userData: null, isLoading: false, isAuthenticated: false });
          await signOut();
        }
      } else {
        // Limpiar suscripción de institución al logout
        if (institutionUnsubscribe) {
          institutionUnsubscribe();
          institutionUnsubscribe = null;
        }
        stopLocationTracking();
        set({
          user: null,
          userData: null,
          institutionData: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
      // Limpiar suscripción de institución al desmontar
      if (institutionUnsubscribe) {
        institutionUnsubscribe();
        institutionUnsubscribe = null;
      }
    };
  },

  setUserData: (data) => set({ userData: data }),

  reset: () => {
    // Limpiar suscripción de institución
    if (institutionUnsubscribe) {
      institutionUnsubscribe();
      institutionUnsubscribe = null;
    }
    stopLocationTracking();
    set({
      user: null,
      userData: null,
      institutionData: null,
      inactiveAccountError: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },
}));
