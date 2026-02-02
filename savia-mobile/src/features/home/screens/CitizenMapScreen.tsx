import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Crosshair, Plus, Minus, SlidersHorizontal } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { AlertMarker } from '@/features/map/components/AlertMarker';
import { AlertMapCard } from '@/features/map/components/AlertMapCard';
import { MapFilterOverlay } from '@/features/map/components/MapFilterOverlay';
import { useNearbyAlertsStore } from '@/features/map/store/nearbyAlertsStore';
import { subscribeToActiveAlerts } from '@/features/map/services/nearbyAlertsService';
import { radiusToDelta } from '@/features/map/utils/geoUtils';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { CitizenStackParamList } from '@/navigation/types';
import type { AlertData } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

const DEFAULT_LOCATION = { latitude: -10.7291, longitude: -73.7538 };

const MAP_STYLE_HIDE_POIS = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export function CitizenMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const mapRef = useRef<MapView>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const mapFilteredAlerts = useNearbyAlertsStore((s) => s.mapFilteredAlerts);
  const allAlerts = useNearbyAlertsStore((s) => s.allAlerts);
  const userLatitude = useNearbyAlertsStore((s) => s.userLatitude);
  const userLongitude = useNearbyAlertsStore((s) => s.userLongitude);
  const selectedRadius = useNearbyAlertsStore((s) => s.selectedRadius);
  const selectedUrgencies = useNearbyAlertsStore((s) => s.selectedUrgencies);
  const selectedCategories = useNearbyAlertsStore((s) => s.selectedCategories);
  const showMapPOIs = useNearbyAlertsStore((s) => s.showMapPOIs);
  const setAllAlerts = useNearbyAlertsStore((s) => s.setAllAlerts);
  const setUserLocation = useNearbyAlertsStore((s) => s.setUserLocation);
  const setSelectedRadius = useNearbyAlertsStore((s) => s.setSelectedRadius);
  const toggleUrgency = useNearbyAlertsStore((s) => s.toggleUrgency);
  const toggleCategory = useNearbyAlertsStore((s) => s.toggleCategory);
  const toggleMapPOIs = useNearbyAlertsStore((s) => s.toggleMapPOIs);
  const setLoading = useNearbyAlertsStore((s) => s.setLoading);
  const setError = useNearbyAlertsStore((s) => s.setError);
  const setLocationError = useNearbyAlertsStore((s) => s.setLocationError);

  // Obtener ubicación del usuario
  useEffect(() => {
    let isMounted = true;

    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('[Map] Permiso de ubicación denegado, usando fallback');
          if (isMounted) {
            setLocationError('Permiso de ubicación denegado');
            setUserLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
            Alert.alert(
              'Ubicación no disponible',
              'Se muestra el mapa centrado en Atalaya. Habilita la ubicación para ver alertas cercanas a ti.',
            );
          }
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (isMounted) {
          console.log('[Map] Ubicación obtenida:', location.coords.latitude, location.coords.longitude);
          setUserLocation(location.coords.latitude, location.coords.longitude);
        }
      } catch (error) {
        console.error('[Map] Error obteniendo ubicación:', error);
        if (isMounted) {
          setLocationError('Error al obtener ubicación');
          setUserLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
        }
      }
    }

    getLocation();
    return () => { isMounted = false; };
  }, []);

  // Suscripción a alertas activas
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToActiveAlerts(
      (alerts) => {
        setAllAlerts(alerts);
        setLoading(false);
      },
      (error) => {
        console.error('[Map] Error en suscripción:', error);
        setError(error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  // Animar mapa cuando cambia radio o ubicación
  useEffect(() => {
    if (!mapRef.current || userLatitude === null || userLongitude === null) return;

    const delta = radiusToDelta(selectedRadius);
    mapRef.current.animateToRegion(
      {
        latitude: userLatitude,
        longitude: userLongitude,
        ...delta,
      },
      300,
    );
  }, [selectedRadius, userLatitude, userLongitude]);

  const handleCenterOnUser = useCallback(() => {
    if (!mapRef.current || userLatitude === null || userLongitude === null) return;

    const delta = radiusToDelta(selectedRadius);
    mapRef.current.animateToRegion(
      {
        latitude: userLatitude,
        longitude: userLongitude,
        ...delta,
      },
      300,
    );
  }, [selectedRadius, userLatitude, userLongitude]);

  const handleZoom = useCallback(async (direction: 'in' | 'out') => {
    if (!mapRef.current) return;
    const camera = await mapRef.current.getCamera();
    if (camera.zoom != null) {
      mapRef.current.animateCamera(
        { zoom: camera.zoom + (direction === 'in' ? 1 : -1) },
        { duration: 200 },
      );
    }
  }, []);

  const handleMarkerPress = useCallback(
    (alertId: string) => {
      const alert = allAlerts.find((a) => a.id === alertId) ?? null;
      setSelectedAlert(alert);
      setShowFilters(false);
    },
    [allAlerts],
  );

  const handleViewDetail = useCallback(() => {
    if (selectedAlert?.id) {
      navigation.navigate('AlertDetail', { alertId: selectedAlert.id });
      setSelectedAlert(null);
    }
  }, [selectedAlert, navigation]);

  const handleMapPress = useCallback(() => {
    setSelectedAlert(null);
    setShowFilters(false);
  }, []);

  const initialLat = userLatitude ?? DEFAULT_LOCATION.latitude;
  const initialLon = userLongitude ?? DEFAULT_LOCATION.longitude;
  const initialDelta = radiusToDelta(selectedRadius);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderMobile
        title="Alertas Cercanas"
        leftSlot="none"
        rightIcon={SlidersHorizontal}
        onRightPress={() => setShowFilters((v) => !v)}
      />

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={handleMapPress}
          customMapStyle={showMapPOIs ? [] : MAP_STYLE_HIDE_POIS}
          initialRegion={{
            latitude: initialLat,
            longitude: initialLon,
            ...initialDelta,
          }}
        >
          {mapFilteredAlerts().map((alert) =>
            alert.id ? (
              <AlertMarker
                key={alert.id}
                alertId={alert.id}
                coordinate={alert.location}
                categoryType={alert.type}
                onPress={handleMarkerPress}
              />
            ) : null,
          )}
        </MapView>

        {/* Overlay de filtros */}
        {showFilters && (
          <MapFilterOverlay
            selectedRadius={selectedRadius}
            onSelectRadius={setSelectedRadius}
            selectedUrgencies={selectedUrgencies}
            onToggleUrgency={toggleUrgency}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            showMapPOIs={showMapPOIs}
            onToggleMapPOIs={toggleMapPOIs}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Card flotante de alerta seleccionada */}
        {selectedAlert && !showFilters && (
          <View style={styles.cardOverlay}>
            <AlertMapCard
              alert={selectedAlert}
              onViewDetail={handleViewDetail}
              onClose={() => setSelectedAlert(null)}
            />
          </View>
        )}

        {/* Controles del mapa */}
        <View style={styles.mapControls}>
          <Pressable style={styles.mapControlButton} onPress={() => handleZoom('in')}>
            <Plus size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.mapControlButton} onPress={() => handleZoom('out')}>
            <Minus size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.centerButton} onPress={handleCenterOnUser}>
            <Crosshair size={20} color={colors.surface} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  mapControls: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  centerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
});
