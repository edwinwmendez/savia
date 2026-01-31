import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/config/firebase';
import type { UserData } from '@/shared/types/user';

interface AuthState {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => () => void;
  setUserData: (data: UserData | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? (userDoc.data() as UserData) : null;
          set({ user: firebaseUser, userData, isLoading: false, isAuthenticated: true });
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          set({ user: firebaseUser, userData: null, isLoading: false, isAuthenticated: true });
        }
      } else {
        set({ user: null, userData: null, isLoading: false, isAuthenticated: false });
      }
    });

    return unsubscribe;
  },

  setUserData: (data) => set({ userData: data }),

  reset: () => set({ user: null, userData: null, isLoading: false, isAuthenticated: false }),
}));
