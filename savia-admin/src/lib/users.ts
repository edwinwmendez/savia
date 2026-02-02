import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  updateDoc,
  deleteField,
  doc,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from './firebase';
import type { UserData, UserRole } from '@/types';

export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  isActive?: boolean | null;
}

export interface UserWithId extends UserData {
  id: string;
  institutionName?: string;
}

export async function fetchUsers(filters?: UserFilters): Promise<UserWithId[]> {
  const ref = collection(db, 'users');
  const constraints: QueryConstraint[] = [];

  if (filters?.role) {
    constraints.push(where('role', '==', filters.role));
  }
  if (filters?.isActive !== null && filters?.isActive !== undefined) {
    constraints.push(where('isActive', '==', filters.isActive));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as UserWithId,
  );

  // Client-side search filter
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.dni.includes(term) ||
        user.phone.includes(term),
    );
  }

  return results;
}

export async function fetchUserById(id: string): Promise<UserWithId | null> {
  const ref = doc(db, 'users', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserWithId;
}

export async function updateUser(
  id: string,
  data: Partial<Omit<UserData, 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const ref = doc(db, 'users', id);

  // Firestore no acepta undefined — filtrar campos undefined
  // y usar deleteField() para campos que se deben eliminar (ej. institutionId al cambiar de agente a ciudadano)
  const cleanData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      cleanData[key] = deleteField();
    } else {
      cleanData[key] = value;
    }
  }

  await updateDoc(ref, {
    ...cleanData,
    updatedAt: serverTimestamp(),
  });
  console.log('[Users] Usuario actualizado:', id);
}

export async function toggleUserStatus(
  id: string,
  isActive: boolean,
): Promise<void> {
  const ref = doc(db, 'users', id);
  await updateDoc(ref, {
    isActive,
    updatedAt: serverTimestamp(),
  });
  console.log('[Users] Estado cambiado:', id, isActive);
}

export interface CreateUserInput {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  sendCredentials?: boolean;
}

export async function createUserViaFunction(
  data: CreateUserInput,
): Promise<{ uid: string }> {
  const functions = getFunctions();
  const createUserFn = httpsCallable<CreateUserInput, { success: boolean; uid: string }>(
    functions,
    'createUser',
  );
  const result = await createUserFn(data);
  console.log('[Users] Usuario creado via Cloud Function:', result.data.uid);
  return { uid: result.data.uid };
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
  console.log('[Users] Reset de contraseña enviado a:', email);
}
