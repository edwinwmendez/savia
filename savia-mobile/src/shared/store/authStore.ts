import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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

          // Obtener datos de institución para agentes
          let institutionData: InstitutionData | null = null;
          if (userData?.role === 'agent' && userData.institutionId) {
            try {
              const instDoc = await getDoc(doc(db, 'institutions', userData.institutionId));
              institutionData = instDoc.exists() ? (instDoc.data() as InstitutionData) : null;
              console.log('[Auth] Datos de institución cargados:', institutionData?.name);
            } catch (instError) {
              console.error('[Auth] Error al obtener institución:', instError);
            }
          }

          set({
            user: firebaseUser,
            userData,
            institutionData,
            inactiveAccountError: null,
            isLoading: false,
            isAuthenticated: true,
          });

          // Registrar push notifications (no bloquea el flujo de auth)
          setupNotificationHandler();
          registerForPushNotifications(firebaseUser.uid).catch((err) => {
            console.warn('[Auth] Error registrando push notifications:', err);
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
    };
  },

  setUserData: (data) => set({ userData: data }),

  reset: () => {
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
