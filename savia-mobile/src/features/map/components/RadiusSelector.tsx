import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import type { RadiusOption } from '@/features/map/store/nearbyAlertsStore';
import { RADIUS_OPTIONS } from '@/features/map/store/nearbyAlertsStore';

interface RadiusSelectorProps {
  selected: RadiusOption;
  onSelect: (value: RadiusOption) => void;
}

const RADIUS_LABELS: Record<RadiusOption, string> = {
  200: '200m',
  500: '500m',
  1000: '1km',
  2000: '2km',
};

export function RadiusSelector({ selected, onSelect }: RadiusSelectorProps) {
  return (
    <View style={styles.container}>
      {RADIUS_OPTIONS.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.option, isActive && styles.optionActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {RADIUS_LABELS[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.surface,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
});
