import type { Timestamp } from 'firebase/firestore';

export interface RatingData {
  id?: string;
  alertId: string;
  rating: number;
  comment?: string;
  ratedBy: string;
  agentId?: string;
  createdAt: Timestamp;
}
