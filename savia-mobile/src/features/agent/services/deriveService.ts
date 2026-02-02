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
 * Si se pasa alertType, filtra solo las que atienden ese tipo.
 */
export async function fetchActiveInstitutions(alertType?: string): Promise<InstitutionItem[]> {
  const ref = collection(db, 'institutions');
  const constraints = [where('isActive', '==', true)];
  if (alertType) {
    constraints.push(where('alertTypes', 'array-contains', alertType));
  }
  constraints.push(orderBy('name', 'asc'));
  const q = query(ref, ...constraints);
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
