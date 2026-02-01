import * as Location from 'expo-location';

export async function requestLocationPermission(): Promise<boolean> {
  console.log('[Location] Solicitando permisos...');
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log('[Location] Permiso:', status);
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  console.log('[Location] Obteniendo ubicación actual...');
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  console.log('[Location] Coords:', location.coords.latitude, location.coords.longitude);
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  console.log('[Location] Reverse geocoding:', latitude, longitude);
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results.length > 0) {
      const r = results[0];
      const parts = [r.street, r.city, r.region].filter(Boolean);
      const address = parts.join(', ');
      console.log('[Location] Dirección:', address);
      return address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  } catch (error) {
    console.error('[Location] Error en geocoding:', error);
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export async function geocodeAddress(
  address: string,
): Promise<{ latitude: number; longitude: number } | null> {
  console.log('[Location] Geocoding dirección:', address);
  try {
    const results = await Location.geocodeAsync(address);
    if (results.length > 0) {
      console.log('[Location] Resultado:', results[0].latitude, results[0].longitude);
      return { latitude: results[0].latitude, longitude: results[0].longitude };
    }
  } catch (error) {
    console.error('[Location] Error en geocoding de dirección:', error);
  }
  return null;
}
