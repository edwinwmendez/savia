'use client';

import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { logoutAdmin } from '@/lib/auth';
import type { UserData } from '@/types';

interface AuthState {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialize: () => () => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

function setSessionCookie(active: boolean) {
  if (typeof document === 'undefined') return;
  if (active) {
    document.cookie = '__savia_admin_session=1; path=/; max-age=604800; SameSite=Lax';
  } else {
    document.cookie = '__savia_admin_session=; path=/; max-age=0; SameSite=Lax';
  }
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: () => {
    const safetyTimeout = setTimeout(() => {
      if (get().isLoading) {
        console.warn('[Auth] Safety timeout: forcing isLoading=false');
        set({ isLoading: false });
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimeout);

      if (!firebaseUser) {
        setSessionCookie(false);
        set({
          user: null,
          userData: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error('[Auth] Usuario no encontrado en Firestore');
          await logoutAdmin();
          setSessionCookie(false);
          set({
            user: null,
            userData: null,
            isLoading: false,
            isAuthenticated: false,
            error: 'Usuario no encontrado en el sistema',
          });
          return;
        }

        const userData = userDoc.data() as UserData;

        if (userData.role !== 'admin') {
          console.error('[Auth] Usuario sin rol admin:', userData.role);
          await logoutAdmin();
          setSessionCookie(false);
          set({
            user: null,
            userData: null,
            isLoading: false,
            isAuthenticated: false,
            error: 'Solo administradores pueden acceder a este panel',
          });
          return;
        }

        setSessionCookie(true);
        set({
          user: firebaseUser,
          userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } catch (err) {
        console.error('[Auth] Error cargando datos de usuario:', err);
        setSessionCookie(false);
        set({
          user: null,
          userData: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Error al verificar credenciales',
        });
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  },

  logout: async () => {
    try {
      await logoutAdmin();
      setSessionCookie(false);
      set({
        user: null,
        userData: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      console.error('[Auth] Error en logout:', err);
    }
  },

  clearError: () => set({ error: null }),
}));
