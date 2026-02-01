import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import type { AlertStatus } from '@/shared/types/alert';

interface StatusBadgeProps {
  status: AlertStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<AlertStatus, { color: string; label: string }> = {
  pending: { color: colors.warning, label: 'Pendiente' },
  assigned: { color: colors.info, label: 'En camino' },
  in_progress: { color: colors.primary, label: 'En el lugar' },
  resolved: { color: colors.success, label: 'Resuelta' },
  cancelled: { color: colors.textSecondary, label: 'Cancelada' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const isSmall = size === 'sm';

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}26` }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.label,
          { color: config.color },
          isSmall ? styles.labelSm : styles.labelMd,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
  labelSm: {
    fontSize: fontSize.caption,
  },
  labelMd: {
    fontSize: fontSize.bodySmall,
  },
});
