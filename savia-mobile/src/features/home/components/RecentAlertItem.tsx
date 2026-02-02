import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import { UrgencyBadge } from '@/features/alerts/components/UrgencyBadge';
import { useCategoryStore } from '@/features/alerts/store/categoryStore';
import { formatRelativeTime, getShortAddress } from '@/shared/utils/formatters';
import type { AlertData, AlertStatus } from '@/shared/types/alert';

interface RecentAlertItemProps {
  alert: AlertData;
  onPress?: () => void;
}

const STATUS_DOT_COLORS: Record<AlertStatus, string> = {
  pending: colors.warning,
  assigned: colors.info,
  in_progress: colors.primary,
  resolved: colors.success,
  cancelled: colors.textSecondary,
};

const STATUS_LABELS: Record<AlertStatus, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

export function RecentAlertItem({ alert, onPress }: RecentAlertItemProps) {
  const categories = useCategoryStore((s) => s.categories);
  const categoryColor = categories.find((c) => c.id === alert.type)?.color ?? colors.textSecondary;
  const statusColor = STATUS_DOT_COLORS[alert.status] ?? colors.textSecondary;
  const statusLabel = STATUS_LABELS[alert.status] ?? '';
  const shortAddress = getShortAddress(alert.address);
  const title = `${alert.categoryName} - ${shortAddress}`;
  const timeText = formatRelativeTime(alert.createdAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Dot de categoría */}
      <View style={[styles.dot, { backgroundColor: categoryColor }]} />

      {/* Contenido: título + subtítulo */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {timeText} · <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </Text>
      </View>

      {/* Badge de urgencia */}
      <View style={styles.badgeWrapper}>
        <UrgencyBadge level={alert.urgency} />
      </View>

      {/* Chevron */}
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
  statusText: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
