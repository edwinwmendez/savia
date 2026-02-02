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
 * Formatea una distancia en metros a texto legible.
 * Ej: 150 → "150 m", 1200 → "1.2 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Convierte un radio en metros a latitudeDelta/longitudeDelta
 * para ajustar el zoom del mapa.
 */
export function radiusToDelta(radiusMeters: number): {
  latitudeDelta: number;
  longitudeDelta: number;
} {
  // 1 grado de latitud ≈ 111,320 metros
  const latDelta = (radiusMeters * 2.5) / 111_320;
  const lonDelta = latDelta;
  return { latitudeDelta: latDelta, longitudeDelta: lonDelta };
}
