/**
 * SAVIA - Location Tracking Service
 * Actualiza la ubicación del ciudadano en Firestore con geohash
 * para notificaciones de proximidad.
 */

import * as Location from 'expo-location';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { encode } from 'ngeohash';
import { db } from '@/shared/config/firebase';

const GEOHASH_PRECISION = 7; // ~153m x 153m por celda
const UPDATE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos
const MIN_UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 10 min mínimo entre updates

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastUpdateTimestamp = 0;

/**
 * Actualiza la ubicación del usuario en Firestore con geohash.
 * Respeta un intervalo mínimo para evitar escrituras excesivas.
 */
export async function updateUserLocation(userId: string): Promise<void> {
  const now = Date.now();
  if (now - lastUpdateTimestamp < MIN_UPDATE_INTERVAL_MS) {
    console.log('[Location] Intervalo mínimo no cumplido, skip');
    return;
  }

  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('[Location] Permiso de ubicación no concedido, skip');
      return;
    }

    // Verificar que los servicios de ubicación estén habilitados (GPS activo)
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      console.log('[Location] Servicios de ubicación deshabilitados, skip');
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;
    const geohash = encode(latitude, longitude, GEOHASH_PRECISION);

    await updateDoc(doc(db, 'users', userId), {
      lastLocation: {
        latitude,
        longitude,
        geohash,
        updatedAt: serverTimestamp(),
      },
    });

    lastUpdateTimestamp = now;
    console.log(`[Location] Ubicación actualizada: ${geohash} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
  } catch (error) {
    // Proceso background — no alarmar con console.error
    const msg = error instanceof Error ? error.message : String(error);
    console.warn('[Location] No se pudo actualizar ubicación:', msg);
  }
}

/**
 * Inicia el tracking periódico de ubicación.
 * Actualiza inmediatamente y luego cada 15 minutos.
 */
export function startLocationTracking(userId: string): void {
  stopLocationTracking();

  console.log('[Location] Iniciando tracking de ubicación');
  updateUserLocation(userId);

  intervalId = setInterval(() => {
    updateUserLocation(userId);
  }, UPDATE_INTERVAL_MS);
}

/**
 * Detiene el tracking de ubicación.
 */
export function stopLocationTracking(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    lastUpdateTimestamp = 0;
    console.log('[Location] Tracking detenido');
  }
}
