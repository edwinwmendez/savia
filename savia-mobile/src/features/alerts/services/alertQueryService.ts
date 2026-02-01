import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/shared/config/firebase';
import type { AlertData, AlertStatus } from '@/shared/types/alert';
import type { UserData } from '@/shared/types/user';

// ── Subscriptions ──────────────────────────────────────────────────────

export function subscribeToCitizenAlerts(
  userId: string,
  onData: (alerts: AlertData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[AlertQuery] Subscribiendo a alertas del ciudadano:', userId);

  const q = query(
    collection(db, 'alerts'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AlertData,
      );
      console.log('[AlertQuery] Alertas ciudadano recibidas:', alerts.length);
      onData(alerts);
    },
    (error) => {
      console.error('[AlertQuery] Error en alertas ciudadano:', error);
      onError(error);
    },
  );
}

export function subscribeToPendingAlerts(
  onData: (alerts: AlertData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[AlertQuery] Subscribiendo a alertas pendientes');

  const q = query(
    collection(db, 'alerts'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AlertData,
      );
      console.log('[AlertQuery] Alertas pendientes recibidas:', alerts.length);
      onData(alerts);
    },
    (error) => {
      console.error('[AlertQuery] Error en alertas pendientes:', error);
      onError(error);
    },
  );
}

export function subscribeToMyCases(
  agentId: string,
  onData: (alerts: AlertData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[AlertQuery] Subscribiendo a mis casos, agente:', agentId);

  const q = query(
    collection(db, 'alerts'),
    where('assignedTo', '==', agentId),
    where('status', 'in', ['assigned', 'in_progress']),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AlertData,
      );
      console.log('[AlertQuery] Mis casos recibidos:', alerts.length);
      onData(alerts);
    },
    (error) => {
      console.error('[AlertQuery] Error en mis casos:', error);
      onError(error);
    },
  );
}

export function subscribeToAgentHistory(
  agentId: string,
  onData: (alerts: AlertData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[AlertQuery] Subscribiendo a historial, agente:', agentId);

  const q = query(
    collection(db, 'alerts'),
    where('assignedTo', '==', agentId),
    where('status', 'in', ['resolved', 'cancelled']),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const alerts = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AlertData,
      );
      console.log('[AlertQuery] Historial recibido:', alerts.length);
      onData(alerts);
    },
    (error) => {
      console.error('[AlertQuery] Error en historial:', error);
      onError(error);
    },
  );
}

export function subscribeToAlertDetail(
  alertId: string,
  onData: (alert: AlertData | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[AlertQuery] Subscribiendo a detalle de alerta:', alertId);

  const docRef = doc(db, 'alerts', alertId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const alert = { id: snapshot.id, ...snapshot.data() } as AlertData;
        console.log('[AlertQuery] Detalle de alerta recibido:', alertId);
        onData(alert);
      } else {
        console.log('[AlertQuery] Alerta no encontrada:', alertId);
        onData(null);
      }
    },
    (error) => {
      console.error('[AlertQuery] Error en detalle de alerta:', error);
      onError(error);
    },
  );
}

// ── One-time fetches ───────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<UserData | null> {
  console.log('[AlertQuery] Obteniendo usuario:', userId);
  try {
    const docRef = doc(db, 'users', userId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      console.log('[AlertQuery] Usuario encontrado:', userId);
      return snapshot.data() as UserData;
    }

    console.log('[AlertQuery] Usuario no encontrado:', userId);
    return null;
  } catch (error) {
    console.error('[AlertQuery] Error al obtener usuario:', error);
    throw error;
  }
}

// ── Callables ──────────────────────────────────────────────────────────

interface TakeAlertResponse {
  success: boolean;
}

export async function takeAlert(alertId: string): Promise<TakeAlertResponse> {
  console.log('[AlertQuery] Tomando alerta:', alertId);
  try {
    const callable = httpsCallable<{ alertId: string }, TakeAlertResponse>(
      functions,
      'takeAlert',
    );
    const result = await callable({ alertId });
    console.log('[AlertQuery] Alerta tomada:', alertId);
    return result.data;
  } catch (error) {
    console.error('[AlertQuery] Error al tomar alerta:', error);
    throw error;
  }
}

interface UpdateAlertStatusResponse {
  success: boolean;
}

export async function updateAlertStatus(
  alertId: string,
  newStatus: AlertStatus,
  note?: string,
): Promise<UpdateAlertStatusResponse> {
  console.log('[AlertQuery] Actualizando estado de alerta:', alertId, '->', newStatus);
  try {
    const callable = httpsCallable<
      { alertId: string; newStatus: AlertStatus; note?: string },
      UpdateAlertStatusResponse
    >(functions, 'updateAlertStatus');
    const result = await callable({ alertId, newStatus, note });
    console.log('[AlertQuery] Estado actualizado:', alertId, '->', newStatus);
    return result.data;
  } catch (error) {
    console.error('[AlertQuery] Error al actualizar estado:', error);
    throw error;
  }
}
