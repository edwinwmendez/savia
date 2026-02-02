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
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'cancelled';

export interface AlertLocation {
  latitude: number;
  longitude: number;
}

export interface StatusHistoryEntry {
  status: AlertStatus;
  timestamp: Timestamp;
  agentId?: string;
  agentName?: string;
  note?: string;
}

export interface AlertData {
  id?: string;
  type: string;
  categoryName: string;
  description: string;
  urgency: UrgencyLevel;
  status: AlertStatus;
  location: AlertLocation;
  address: string;
  geohash?: string;
  imageUrls: string[];
  createdBy: string;
  assignedTo: string | null;
  assignedAgentName?: string;
  assignedInstitution: string | null;
  assignedInstitutionName?: string;
  alertCode?: string;
  statusHistory?: StatusHistoryEntry[];
  agentNote?: string;
  rating?: number;
  ratingId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}

export interface CreateAlertPayload {
  type: string;
  categoryName: string;
  description: string;
  urgency: UrgencyLevel;
  location: AlertLocation;
  address: string;
  imageUrls: string[];
}
