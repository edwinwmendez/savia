import type { Timestamp } from 'firebase/firestore';

/**
 * Convierte un Timestamp de Firestore a un texto relativo legible.
 * Ej: "Ahora", "Hace 5 min", "Hace 2h", "Ayer", "Hace 3 días"
 */
export function formatRelativeTime(timestamp: Timestamp): string {
  const now = Date.now();
  const date = timestamp.toDate().getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}

/**
 * Extrae la parte corta de una dirección (primeras 3 palabras de la primera parte antes de la coma).
 */
export function getShortAddress(address: string): string {
  const parts = address.split(',');
  const street = parts[0]?.trim() ?? address;
  const words = street.split(' ');
  if (words.length > 3) {
    return words.slice(0, 3).join(' ');
  }
  return street;
}

/**
 * Formatea un Timestamp de Firestore a una cadena de fecha/hora legible.
 * Ej: "15 ene 2026, 14:30"
 */
export function formatTimestamp(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const day = date.getDate();
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
