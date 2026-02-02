import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CategoryData } from '@/types';

export async function fetchCategories(): Promise<CategoryData[]> {
  const ref = collection(db, 'categories');
  const q = query(ref, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as CategoryData,
  );
}

export async function createCategory(
  data: Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const ref = collection(db, 'categories');
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('[Categories] Categoria creada:', docRef.id);
  return docRef.id;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<CategoryData, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const ref = doc(db, 'categories', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  console.log('[Categories] Categoria actualizada:', id);
}

export async function deleteCategory(id: string): Promise<void> {
  const ref = doc(db, 'categories', id);
  await deleteDoc(ref);
  console.log('[Categories] Categoria eliminada:', id);
}

export async function updateCategoryOrder(
  orderedIds: string[],
): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    const ref = doc(db, 'categories', id);
    batch.update(ref, { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
  console.log('[Categories] Orden actualizado');
}
