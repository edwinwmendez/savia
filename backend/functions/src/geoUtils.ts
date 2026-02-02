/**
 * SAVIA - Utilidades Geográficas (Backend)
 */

import * as ngeohash from "ngeohash";

const EARTH_RADIUS_METERS = 6_371_000;

/**
 * Calcula la distancia en metros entre dos coordenadas usando la fórmula Haversine.
 */
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Retorna el geohash del centro + los 8 geohashes vecinos.
 * Precision 7 ≈ 153m x 153m por celda → cobertura ~459m x 459m con vecinos.
 */
export function getNeighborGeohashes(
  lat: number,
  lon: number,
  precision = 7,
): string[] {
  const center = ngeohash.encode(lat, lon, precision);
  const surrounding = ngeohash.neighbors(center);
  return [center, ...surrounding];
}
