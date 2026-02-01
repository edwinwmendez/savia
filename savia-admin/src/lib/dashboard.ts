import { httpsCallable } from 'firebase/functions';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { functions, db } from './firebase';
import type { DashboardStats, AlertData } from '@/types';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const callable = httpsCallable(functions, 'getDashboardStats');
  const result = await callable();
  return result.data as DashboardStats;
}

export async function fetchActiveAlerts(limitCount = 10): Promise<AlertData[]> {
  const alertsRef = collection(db, 'alerts');
  const q = query(
    alertsRef,
    where('status', 'in', ['pending', 'assigned', 'in_progress']),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AlertData);
}

export async function fetchCriticalActiveCount(): Promise<number> {
  const alertsRef = collection(db, 'alerts');
  const q = query(
    alertsRef,
    where('urgency', '==', 'critical'),
    where('status', 'in', ['pending', 'assigned', 'in_progress']),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}
