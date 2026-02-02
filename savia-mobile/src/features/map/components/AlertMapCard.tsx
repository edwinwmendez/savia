import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X, Navigation } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { formatDistance } from '@/features/map/utils/geoUtils';
import { getDistanceInMeters } from '@/features/map/utils/geoUtils';
import { useNearbyAlertsStore } from '@/features/map/store/nearbyAlertsStore';
import { openNavigation } from '@/shared/utils/navigation';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';

interface AlertMapCardProps {
  alert: AlertData;
  onViewDetail: () => void;
  onClose: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  robbery: '\u{1F6A8}',
  accident: '\u{1F697}',
  medical: '\u{1F3E5}',
  fire: '\u{1F525}',
  electrical: '\u{26A1}',
  water: '\u{1F4A7}',
  lost: '\u{1F50D}',
  other: '\u{2753}',
};

const URGENCY_CONFIG: Record<UrgencyLevel, { bg: string; color: string; label: string }> = {
  critical: { bg: '#FFEBEE', color: colors.urgencyCritical, label: 'Crítica' },
  high: { bg: '#FFF3E0', color: colors.urgencyHigh, label: 'Alta' },
  medium: { bg: '#FFF8E1', color: colors.urgencyMedium, label: 'Media' },
  low: { bg: '#E8F5E9', color: colors.urgencyLow, label: 'Baja' },
};

export function AlertMapCard({ alert, onViewDetail, onClose }: AlertMapCardProps) {
  const emoji = CATEGORY_EMOJI[alert.type] ?? '\u{2753}';
  const urgency = URGENCY_CONFIG[alert.urgency];
  const userLat = useNearbyAlertsStore((s) => s.userLatitude);
  const userLon = useNearbyAlertsStore((s) => s.userLongitude);

  const distanceText =
    userLat != null && userLon != null
      ? `A ${formatDistance(getDistanceInMeters(userLat, userLon, alert.location.latitude, alert.location.longitude))} de tu ubicación`
      : alert.address;

  const handleNavigate = () => {
    openNavigation(alert.location.latitude, alert.location.longitude);
  };

  return (
    <View style={styles.container}>
      {/* Botón cerrar */}
      <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
        <X size={16} color={colors.textSecondary} />
      </Pressable>

      {/* Header: icono + info + badge */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${urgency.color}1A` }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {alert.categoryName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {distanceText}
          </Text>
        </View>

        <View style={[styles.urgencyPill, { backgroundColor: urgency.bg }]}>
          <View style={[styles.urgencyDot, { backgroundColor: urgency.color }]} />
          <Text style={[styles.urgencyLabel, { color: urgency.color }]}>
            {urgency.label}
          </Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btnOutline, pressed && styles.btnPressed]}
          onPress={onViewDetail}
        >
          <Text style={styles.btnOutlineText}>Ver Detalle</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
          onPress={handleNavigate}
        >
          <Navigation size={16} color={colors.surface} />
          <Text style={styles.btnPrimaryText}>Navegar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingRight: spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  urgencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    height: 28,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyLabel: {
    fontSize: 12,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  btnOutline: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  btnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  btnPrimaryText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
