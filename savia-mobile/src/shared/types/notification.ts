import type { Timestamp } from 'firebase/firestore';

export type NotificationType = 'new_alert' | 'status_change';

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
