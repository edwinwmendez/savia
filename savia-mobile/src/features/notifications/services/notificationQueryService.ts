import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  writeBatch,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import type { NotificationData } from '@/shared/types/notification';

// ── Subscriptions ──────────────────────────────────────────────────────

export function subscribeToNotifications(
  userId: string,
  onData: (notifications: NotificationData[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  console.log('[NotifQuery] Subscribiendo a notificaciones de:', userId);

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as NotificationData,
      );
      console.log('[NotifQuery] Notificaciones recibidas:', notifications.length);
      onData(notifications);
    },
    (error) => {
      console.error('[NotifQuery] Error en notificaciones:', error);
      onError(error);
    },
  );
}

export function subscribeToUnreadCount(
  userId: string,
  onCount: (count: number) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onCount(snapshot.size);
    },
    (error) => {
      console.error('[NotifQuery] Error en conteo no leídas:', error);
      onError(error);
    },
  );
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function markAsRead(notificationId: string): Promise<void> {
  console.log('[NotifQuery] Marcando como leída:', notificationId);
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
    readAt: serverTimestamp(),
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  console.log('[NotifQuery] Marcando todas como leídas para:', userId);

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(d.ref, { read: true, readAt: serverTimestamp() });
  });
  await batch.commit();
  console.log('[NotifQuery] Marcadas', snapshot.size, 'notificaciones como leídas');
}

export async function clearAllNotifications(userId: string): Promise<void> {
  console.log('[NotifQuery] Eliminando todas las notificaciones de:', userId);

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  // Firestore batch limit: 500 ops per batch
  const batchSize = 500;
  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const chunk = snapshot.docs.slice(i, i + batchSize);
    const batch = writeBatch(db);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  console.log('[NotifQuery] Eliminadas', snapshot.size, 'notificaciones');
}
