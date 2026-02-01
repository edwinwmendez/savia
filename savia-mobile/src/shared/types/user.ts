import type { Timestamp } from 'firebase/firestore';

export interface UserData {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: 'citizen' | 'agent' | 'admin';
  institutionId?: string;
  isActive: boolean;
  expoPushToken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

export interface InstitutionData {
  name: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  categoryIds?: string[];
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
