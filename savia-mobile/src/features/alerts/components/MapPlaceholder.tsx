import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Plus, Minus } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import { spacing, radius, iconSize } from '@/shared/theme/spacing';

interface MapPlaceholderProps {
  hasLocation: boolean;
  latitude?: number;
  longitude?: number;
  /** Controla la altura del mapa (default 220) */
  height?: number;
}

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const hasGoogleMaps = !!GOOGLE_MAPS_KEY;

export function MapPlaceholder({
  hasLocation,
  latitude,
  longitude,
  height = 220,
}: MapPlaceholderProps) {
  // Si hay coordenadas y API key, mostrar mapa real
  if (hasLocation && latitude && longitude && hasGoogleMaps) {
    return (
      <View style={[styles.container, { height }]}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <MapPin size={32} color={colors.error} fill={colors.error} />
          </Marker>
        </MapView>
      </View>
    );
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
  container: {
    backgroundColor: '#E8E8E8',
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
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
