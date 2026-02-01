import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import { UrgencyBadge } from '@/features/alerts/components/UrgencyBadge';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import type { AlertData, AlertStatus } from '@/shared/types/alert';
import type { Timestamp } from 'firebase/firestore';

// Mapa rápido de categoryId → color para evitar .find() en cada render
const CATEGORY_COLOR_MAP = Object.fromEntries(
  ALERT_CATEGORIES.map((c) => [c.id, c.color]),
);

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

function formatRelativeTime(timestamp: Timestamp): string {
  const now = Date.now();
  const date = timestamp.toDate().getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}

function getShortAddress(address: string): string {
  const parts = address.split(',');
  const street = parts[0]?.trim() ?? address;
  const words = street.split(' ');
  if (words.length > 3) {
    return words.slice(0, 3).join(' ');
  }
  return street;
}

export function RecentAlertItem({ alert, onPress }: RecentAlertItemProps) {
  const categoryColor = CATEGORY_COLOR_MAP[alert.type] ?? colors.textSecondary;
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
