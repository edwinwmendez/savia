import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import { formatRelativeTime, getShortAddress } from '@/shared/utils/formatters';
import { formatDistance } from '@/features/map/utils/geoUtils';
import type { NearbyAlert } from '@/features/map/store/nearbyAlertsStore';
import type { UrgencyLevel } from '@/shared/types/alert';

interface NearbyAlertItemProps {
  alert: NearbyAlert;
  onPress: () => void;
}

const URGENCY_DOT_COLORS: Record<UrgencyLevel, string> = {
  critical: colors.urgencyCritical,
  high: colors.urgencyHigh,
  medium: colors.urgencyMedium,
  low: colors.urgencyLow,
};

export function NearbyAlertItem({ alert, onPress }: NearbyAlertItemProps) {
  const dotColor = URGENCY_DOT_COLORS[alert.urgency];
  const shortAddress = getShortAddress(alert.address);
  const title = `${alert.categoryName} - ${shortAddress}`;
  const distanceText = formatDistance(alert.distance);
  const timeText = formatRelativeTime(alert.createdAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {distanceText} · {timeText}
        </Text>
      </View>

      <ChevronRight size={20} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    gap: 2,
    paddingHorizontal: spacing.sm + 4,
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
});
