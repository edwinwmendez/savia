import type { Timestamp } from 'firebase/firestore';

export interface AlertCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus =
  | 'reported'
  | 'in_progress'
  | 'on_the_way'
  | 'on_site'
  | 'resolved'
  | 'closed';

export interface AlertData {
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  description: string;
  urgencyLevel: UrgencyLevel;
  status: AlertStatus;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  geohash?: string;
  imageUrls: string[];
  citizenId: string;
  agentId: string | null;
  institutionId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}
