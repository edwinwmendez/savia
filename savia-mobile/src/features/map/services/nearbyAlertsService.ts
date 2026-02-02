import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import type { AlertData } from '@/shared/types/alert';

/**
 * Suscripción en tiempo real a alertas activas (pending, assigned, in_progress).
 * Retorna unsubscribe para cleanup.
 */
export function subscribeToActiveAlerts(
  onData: (alerts: AlertData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[NearbyAlerts] Subscribiendo a alertas activas');

  const q = query(
    collection(db, 'alerts'),
    where('status', 'in', ['pending', 'assigned', 'in_progress']),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AlertData,
      );
      console.log('[NearbyAlerts] Alertas activas recibidas:', alerts.length);
      onData(alerts);
    },
    (error) => {
      console.error('[NearbyAlerts] Error en alertas activas:', error);
      onError(error);
    },
  );
}
