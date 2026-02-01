import { Timestamp } from 'firebase/firestore';
import type { AlertStatus, UrgencyLevel } from '@/types';

export function timestampToDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return new Date();
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;

  return formatDate(date);
}

export function formatDate(date: Date): string {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

export const statusLabels: Record<AlertStatus, string> = {
  pending: 'Pendiente',
  assigned: 'Asignado',
  in_progress: 'En Progreso',
  resolved: 'Resuelto',
  cancelled: 'Cancelado',
};

export const statusColors: Record<AlertStatus, string> = {
  pending: 'warning',
  assigned: 'info',
  in_progress: 'primary',
  resolved: 'success',
  cancelled: 'default',
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const urgencyColors: Record<UrgencyLevel, string> = {
  critical: 'error',
  high: 'warning',
  medium: 'warning',
  low: 'success',
};

// Institution helpers
import type { InstitutionType, UserRole } from '@/types';

export const institutionTypeLabels: Record<InstitutionType, string> = {
  pnp: 'PNP',
  serenazgo: 'Serenazgo',
  bomberos: 'Bomberos',
  salud: 'Salud',
  otro: 'Otro',
};

export const institutionTypeEmojis: Record<InstitutionType, string> = {
  pnp: '👮',
  serenazgo: '🛡️',
  bomberos: '🚒',
  salud: '🏥',
  otro: '🏢',
};

export const roleLabels: Record<UserRole, string> = {
  citizen: 'Ciudadano',
  agent: 'Agente',
  admin: 'Administrador',
};

export const roleColors: Record<UserRole, string> = {
  citizen: 'default',
  agent: 'primary',
  admin: 'warning',
};

export const alertTypeEmojis: Record<string, string> = {
  robbery: '🚨',
  accident: '🚗',
  medical: '🚑',
  fire: '🔥',
  electrical: '⚡',
  water: '💧',
  lost: '🔍',
  other: '📋',
};
