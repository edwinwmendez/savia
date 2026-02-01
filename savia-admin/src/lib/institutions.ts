import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getCountFromServer,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { InstitutionData, InstitutionType } from '@/types';

export interface InstitutionFilters {
  search?: string;
  type?: InstitutionType | '';
  isActive?: boolean | null;
}

export async function fetchInstitutions(
  filters?: InstitutionFilters,
): Promise<InstitutionData[]> {
  const ref = collection(db, 'institutions');
  const constraints: QueryConstraint[] = [];

  if (filters?.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters?.isActive !== null && filters?.isActive !== undefined) {
    constraints.push(where('isActive', '==', filters.isActive));
  }

  constraints.push(orderBy('name', 'asc'));

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as InstitutionData,
  );

  // Client-side search filter
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (inst) =>
        inst.name.toLowerCase().includes(term) ||
        inst.address.toLowerCase().includes(term) ||
        inst.phone.includes(term),
    );
  }

  return results;
}

export async function createInstitution(
  data: Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt' | 'agentCount'>,
): Promise<string> {
  const ref = collection(db, 'institutions');
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('[Institutions] Institución creada:', docRef.id);
  return docRef.id;
}

export async function updateInstitution(
  id: string,
  data: Partial<Omit<InstitutionData, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const ref = doc(db, 'institutions', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  console.log('[Institutions] Institución actualizada:', id);
}

export async function toggleInstitutionStatus(
  id: string,
  isActive: boolean,
): Promise<void> {
  const ref = doc(db, 'institutions', id);
  await updateDoc(ref, {
    isActive,
    updatedAt: serverTimestamp(),
  });
  console.log('[Institutions] Estado cambiado:', id, isActive);
}

export async function fetchInstitutionById(
  id: string,
): Promise<InstitutionData | null> {
  const ref = doc(db, 'institutions', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as InstitutionData;
}

export async function countAgentsByInstitution(
  institutionId: string,
): Promise<number> {
  const ref = collection(db, 'users');
  const q = query(
    ref,
    where('role', '==', 'agent'),
    where('institutionId', '==', institutionId),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}
