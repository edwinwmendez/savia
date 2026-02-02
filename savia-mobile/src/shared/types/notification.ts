import type { Timestamp } from 'firebase/firestore';

export type NotificationType = 'new_alert' | 'status_change' | 'alert_derived' | 'proximity_alert';

export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  alertId: string;
  read: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
}
