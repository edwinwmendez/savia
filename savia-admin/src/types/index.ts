export type UserRole = 'citizen' | 'agent' | 'admin';
export type AlertStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'cancelled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface UserData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  institutionId?: string;
  isActive: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface AlertLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface StatusHistoryEntry {
  status: AlertStatus;
  timestamp: unknown;
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
  imageUrls: string[];
  createdBy: string;
  assignedTo: string | null;
  assignedAgentName?: string;
  assignedInstitution: string | null;
  assignedInstitutionName?: string;
  alertCode?: string;
  statusHistory?: StatusHistoryEntry[];
  createdAt: unknown;
  updatedAt: unknown;
  resolvedAt?: unknown;
}

export interface DashboardStats {
  alerts: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    today: number;
    thisMonth: number;
  };
  users: {
    totalCitizens: number;
    activeAgents: number;
  };
}
