import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';

export async function loginAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  return firebaseSignOut(auth);
}
