import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { URGENCY_LEVELS } from '@/features/alerts/data/urgencyLevels';
import type { UrgencyLevel } from '@/shared/types/alert';

interface UrgencyFilterChipsProps {
  selected: UrgencyLevel[];
  onToggle: (level: UrgencyLevel) => void;
}

export function UrgencyFilterChips({ selected, onToggle }: UrgencyFilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {URGENCY_LEVELS.map(({ level, label, color }) => {
          const isActive = selected.includes(level);
          return (
            <Pressable
              key={level}
              onPress={() => onToggle(level)}
              style={[
                styles.chip,
                isActive
                  ? { backgroundColor: `${color}26`, borderColor: color }
                  : styles.chipInactive,
              ]}
            >
              {isActive && <View style={[styles.dot, { backgroundColor: color }]} />}
              <Text
                style={[
                  styles.label,
                  isActive ? { color } : styles.labelInactive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
