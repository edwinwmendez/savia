import { View, Text, Platform, StyleSheet } from 'react-native';
import { MapPin, Plus, Minus } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import { spacing, radius, iconSize } from '@/shared/theme/spacing';

interface MapPlaceholderProps {
  hasLocation: boolean;
  latitude?: number;
  longitude?: number;
  /** Controla la altura del mapa (default 220) */
  height?: number;
  /** Cuando se provee, el mapa es interactivo y reporta la nueva ubicación al soltar */
  onLocationChange?: (latitude: number, longitude: number) => void;
  /** Callbacks para resolver conflicto con ScrollView padre */
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}

export function MapPlaceholder({
  hasLocation,
  latitude,
  longitude,
  height = 220,
  onLocationChange,
  onTouchStart,
  onTouchEnd,
}: MapPlaceholderProps) {
  const isInteractive = !!onLocationChange;

  // Si hay coordenadas, mostrar mapa real
  if (hasLocation && latitude && longitude) {
    const mapView = (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        scrollEnabled={isInteractive}
        zoomEnabled={isInteractive}
        pitchEnabled={false}
        rotateEnabled={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        {...(Platform.OS === 'android' && isInteractive && { zoomControlsEnabled: true })}
        onRegionChangeComplete={
          isInteractive
            ? (region) => onLocationChange(region.latitude, region.longitude)
            : undefined
        }
      >
        {!isInteractive && (
          <Marker coordinate={{ latitude, longitude }}>
            <MapPin size={32} color={colors.error} fill={colors.error} />
          </Marker>
        )}
      </MapView>
    );

    // Contenedor del mapa SIN borderRadius/overflow (causa tiles en blanco en Android)
    const mapContent = (
      <View style={[styles.mapContainer, { height }]}>
        {mapView}
        {isInteractive && (
          <View style={styles.centerPin} pointerEvents="none">
            <MapPin size={36} color={colors.error} fill={colors.error} />
          </View>
        )}
      </View>
    );

    // En modo interactivo: wrapper con responder system para bloquear ScrollView
    if (isInteractive) {
      return (
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={onTouchStart}
          onResponderRelease={onTouchEnd}
          onResponderTerminate={onTouchEnd}
        >
          {mapContent}
        </View>
      );
    }

    return mapContent;
  }

  // Fallback: placeholder visual
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.pinContainer}>
        <MapPin size={40} color={colors.error} fill={colors.error} />
      </View>

      {!hasLocation && (
        <Text style={styles.placeholder}>Obteniendo ubicación...</Text>
      )}

      {hasLocation && (
        <Text style={styles.mapLabel}>[ MAPA ]</Text>
      )}

      <View style={styles.zoomControls}>
        <View style={styles.zoomButton}>
          <Plus size={iconSize.md} color={colors.textPrimary} />
        </View>
        <View style={styles.zoomDivider} />
        <View style={styles.zoomButton}>
          <Minus size={iconSize.md} color={colors.textPrimary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Para el mapa real: SIN borderRadius ni overflow hidden
  mapContainer: {
    borderRadius: radius.lg,
  },
  container: {
    backgroundColor: '#E8E8E8',
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -36,
  },
  pinContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -40,
  },
  placeholder: {
    position: 'absolute',
    bottom: spacing.md,
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  mapLabel: {
    fontSize: 20,
    fontFamily: fontFamily.semibold,
    color: colors.primary,
  },
  zoomControls: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  zoomButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
