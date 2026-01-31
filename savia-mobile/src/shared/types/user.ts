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
  fcmToken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}
