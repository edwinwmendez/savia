import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getCountFromServer,
  startAfter,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AlertData, AlertStatus, UrgencyLevel } from '@/types';

export interface AlertFilters {
  search?: string;
  type?: string;
  status?: AlertStatus | '';
  urgency?: UrgencyLevel | '';
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

export interface AlertWithId extends AlertData {
  id: string;
}

export async function fetchAlerts(
  filters?: AlertFilters,
  pageSize = 10,
  lastDoc?: unknown,
): Promise<{ alerts: AlertWithId[]; total: number }> {
  const ref = collection(db, 'alerts');
  const constraints: QueryConstraint[] = [];

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  if (filters?.urgency) {
    constraints.push(where('urgency', '==', filters.urgency));
  }

  if (filters?.type) {
    constraints.push(where('type', '==', filters.type));
  }

  if (filters?.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let startDate: Date;
    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    constraints.push(where('createdAt', '>=', Timestamp.fromDate(startDate)));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  constraints.push(limit(pageSize));

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);

  let alerts = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as AlertWithId,
  );

  // Client-side search
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    alerts = alerts.filter(
      (a) =>
        (a.alertCode?.toLowerCase() ?? '').includes(term) ||
        a.categoryName.toLowerCase().includes(term) ||
        a.address.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term),
    );
  }

  // Get total count (without pagination)
  const countConstraints: QueryConstraint[] = [];
  if (filters?.status) countConstraints.push(where('status', '==', filters.status));
  if (filters?.urgency) countConstraints.push(where('urgency', '==', filters.urgency));
  if (filters?.type) countConstraints.push(where('type', '==', filters.type));

  const countQuery = countConstraints.length > 0
    ? query(ref, ...countConstraints)
    : ref;
  const countSnap = await getCountFromServer(countQuery);
  const total = countSnap.data().count;

  return { alerts, total };
}

export async function fetchAlertById(id: string): Promise<AlertWithId | null> {
  const ref = doc(db, 'alerts', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AlertWithId;
}

export async function updateAlertAdmin(
  id: string,
  data: Partial<AlertData>,
): Promise<void> {
  const ref = doc(db, 'alerts', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  console.log('[Alerts] Alerta actualizada por admin:', id);
}

export async function fetchAlertUser(userId: string): Promise<{ id: string; firstName: string; lastName: string; phone: string; dni: string; email: string } | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    dni: data.dni,
    email: data.email,
  };
}
