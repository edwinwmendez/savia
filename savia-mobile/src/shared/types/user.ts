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
  lastLocation?: {
    latitude: number;
    longitude: number;
    geohash: string;
    updatedAt: Timestamp;
  };
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
  alertTypes?: string[];  // Tipos de alerta que atiende esta institución
  categoryIds?: string[]; // Alias legacy (usar alertTypes)
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
