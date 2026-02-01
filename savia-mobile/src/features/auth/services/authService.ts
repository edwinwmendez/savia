import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '@/shared/config/firebase';
import type { UserData } from '@/shared/types/user';

interface RegisterCitizenPayload {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

interface RegisterCitizenResponse {
  success: boolean;
  uid: string;
  message: string;
}

export async function loginWithEmail(email: string, password: string) {
  console.log('[Auth] Intentando login con:', email);
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.log('[Auth] Login exitoso, uid:', credential.user.uid);
    return credential.user;
  } catch (error) {
    console.error('[Auth] Error en login:', error);
    throw error;
  }
}

export async function registerCitizen(data: RegisterCitizenPayload) {
  console.log('[Auth] Intentando registro con DNI:', data.dni, 'email:', data.email);
  try {
    const callable = httpsCallable<RegisterCitizenPayload, RegisterCitizenResponse>(
      functions,
      'registerCitizen'
    );
    const result = await callable(data);
    console.log('[Auth] Registro exitoso:', result.data.message);
    return result.data;
  } catch (error) {
    console.error('[Auth] Error en registro:', error);
    throw error;
  }
}

export async function fetchUserData(uid: string): Promise<UserData | null> {
  console.log('[Auth] Obteniendo datos del usuario:', uid);
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const exists = userDoc.exists();
    console.log('[Auth] Documento de usuario encontrado:', exists);
    return exists ? (userDoc.data() as UserData) : null;
  } catch (error) {
    console.error('[Auth] Error al obtener datos del usuario:', error);
    throw error;
  }
}

export async function signOut(userId?: string) {
  console.log('[Auth] Cerrando sesión');
  // Limpiar token de push para no recibir notificaciones de esta cuenta
  if (userId) {
    try {
      const { unregisterPushToken } = await import(
        '@/features/notifications/services/notificationPushService'
      );
      await unregisterPushToken(userId);
    } catch (error) {
      console.error('[Auth] Error limpiando push token:', error);
    }
  }
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  console.log('[Auth] Enviando reset de contraseña a:', email);
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('[Auth] Email de reset enviado');
  } catch (error) {
    console.error('[Auth] Error al enviar reset:', error);
    throw error;
  }
}
