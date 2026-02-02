import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { MapPin, Clock, Navigation } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius, iconSize } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import { StatusBadge } from '@/features/alerts/components/StatusBadge';
import { useCategoryStore } from '@/features/alerts/store/categoryStore';
import { formatRelativeTime, getShortAddress } from '@/shared/utils/formatters';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';
import * as LucideIcons from 'lucide-react-native';

interface AlertListItemProps {
  alert: AlertData;
  onPress?: () => void;
  onTakeCase?: () => void;
  showTakeCaseButton?: boolean;
  showStatusBadge?: boolean;
  isTakingCase?: boolean;
}

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  critical: '#D32F2F',
  high: '#F57C00',
  medium: '#FF9800',
  low: '#4CAF50',
};

function getCategoryIcon(iconName: string): LucideIcons.LucideIcon | null {
  const Icon = (LucideIcons as Record<string, LucideIcons.LucideIcon>)[iconName];
  return Icon ?? null;
}

export function AlertListItem({
  alert,
  onPress,
  onTakeCase,
  showTakeCaseButton = false,
  showStatusBadge = false,
  isTakingCase = false,
}: AlertListItemProps) {
  const categories = useCategoryStore((s) => s.categories);
  const category = categories.find((c) => c.id === alert.type);
  const categoryIconName = category?.icon ?? 'HelpCircle';
  const CategoryIcon = getCategoryIcon(categoryIconName) ?? LucideIcons.HelpCircle;

  const urgencyColor = URGENCY_COLORS[alert.urgency] ?? colors.textSecondary;
  const shortAddress = getShortAddress(alert.address);
  const timeText = formatRelativeTime(alert.createdAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderLeftColor: urgencyColor },
        pressed && styles.pressed,
      ]}
    >
      {/* Top row: icono + info */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${urgencyColor}1A` }]}>
          <CategoryIcon size={iconSize.lg} color={urgencyColor} />
        </View>

        <View style={styles.info}>
          {alert.alertCode && (
            <View style={[styles.alertCodeBadge, { backgroundColor: `${urgencyColor}1A` }]}>
              <Text style={[styles.alertCodeText, { color: urgencyColor }]}>
                #{alert.alertCode}
              </Text>
            </View>
          )}
          <Text style={styles.typeName} numberOfLines={1}>
            {alert.categoryName}
          </Text>
        </View>
      </View>

      {/* Location row */}
      <View style={styles.locationRow}>
        <MapPin size={iconSize.sm} color={colors.textSecondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {shortAddress}
        </Text>
      </View>

      {/* Bottom row: meta + status/botón */}
      <View style={styles.bottomRow}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{timeText}</Text>
          </View>
          <View style={styles.metaItem}>
            <Navigation size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>1.5 km</Text>
          </View>
        </View>

        {showStatusBadge && (
          <StatusBadge status={alert.status} size="sm" />
        )}

        {showTakeCaseButton && onTakeCase && (
          <Pressable
            onPress={onTakeCase}
            disabled={isTakingCase}
            style={[styles.takeCaseButton, { backgroundColor: urgencyColor }]}
          >
            {isTakingCase ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text style={styles.takeCaseText}>TOMAR CASO</Text>
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg - spacing.sm, // 12px
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  alertCodeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  alertCodeText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  typeName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  takeCaseButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeCaseText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
});
