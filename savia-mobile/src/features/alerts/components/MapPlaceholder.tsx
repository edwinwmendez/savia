import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Plus, Minus } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import { spacing, radius, iconSize } from '@/shared/theme/spacing';

interface MapPlaceholderProps {
  hasLocation: boolean;
}

export function MapPlaceholder({ hasLocation }: MapPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pinContainer}>
        <MapPin size={40} color={colors.error} fill={colors.error} />
      </View>

      {!hasLocation && (
        <Text style={styles.placeholder}>Obteniendo ubicación...</Text>
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
    height: 220,
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
