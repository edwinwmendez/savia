import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/shared/config/firebase';

export interface InstitutionItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

/**
 * Obtiene la lista de instituciones activas.
 */
export async function fetchActiveInstitutions(): Promise<InstitutionItem[]> {
  const ref = collection(db, 'institutions');
  const q = query(
    ref,
    where('isActive', '==', true),
    orderBy('name', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as InstitutionItem[];
}

/**
 * Deriva una alerta a otra institución via Cloud Function.
 */
export async function deriveAlert(
  alertId: string,
  institutionId: string,
  reason: string,
): Promise<void> {
  const deriveAlertFn = httpsCallable<
    { alertId: string; institutionId: string; reason: string },
    { success: boolean }
  >(functions, 'deriveAlert');

  await deriveAlertFn({ alertId, institutionId, reason });
  console.log('[DeriveService] Alerta derivada:', alertId);
}
