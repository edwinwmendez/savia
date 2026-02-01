import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { DashboardStats, AlertData } from '@/types';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const alertsRef = collection(db, 'alerts');
  const usersRef = collection(db, 'users');

  // Inicio del dia actual
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, pending, inProgress, resolved, today, thisMonth, totalCitizens, activeAgents] =
    await Promise.all([
      getCountFromServer(alertsRef),
      getCountFromServer(query(alertsRef, where('status', '==', 'pending'))),
      getCountFromServer(query(alertsRef, where('status', '==', 'in_progress'))),
      getCountFromServer(query(alertsRef, where('status', '==', 'resolved'))),
      getCountFromServer(
        query(alertsRef, where('createdAt', '>=', Timestamp.fromDate(startOfDay))),
      ),
      getCountFromServer(
        query(alertsRef, where('createdAt', '>=', Timestamp.fromDate(startOfMonth))),
      ),
      getCountFromServer(query(usersRef, where('role', '==', 'citizen'))),
      getCountFromServer(
        query(usersRef, where('role', '==', 'agent'), where('isActive', '==', true)),
      ),
    ]);

  return {
    alerts: {
      total: total.data().count,
      pending: pending.data().count,
      inProgress: inProgress.data().count,
      resolved: resolved.data().count,
      today: today.data().count,
      thisMonth: thisMonth.data().count,
    },
    users: {
      totalCitizens: totalCitizens.data().count,
      activeAgents: activeAgents.data().count,
    },
  };
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
  try {
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('urgency', '==', 'critical'),
      where('status', 'in', ['pending', 'assigned', 'in_progress']),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (err) {
    console.warn('[Dashboard] Error contando criticas (puede faltar indice):', err);
    return 0;
  }
}
