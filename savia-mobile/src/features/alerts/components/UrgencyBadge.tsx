import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { URGENCY_LEVELS } from '@/features/alerts/data/urgencyLevels';
import type { UrgencyLevel } from '@/shared/types/alert';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
}

export function UrgencyBadge({ level }: UrgencyBadgeProps) {
  const config = URGENCY_LEVELS.find((u) => u.level === level);
  if (!config) return null;

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}26` }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
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
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
});
