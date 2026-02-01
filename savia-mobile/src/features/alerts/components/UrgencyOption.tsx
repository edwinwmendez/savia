import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';
import type { UrgencyLevelConfig } from '@/features/alerts/data/urgencyLevels';

interface UrgencyOptionProps {
  config: UrgencyLevelConfig;
  selected: boolean;
  onPress: () => void;
}

export function UrgencyOption({ config, selected, onPress }: UrgencyOptionProps) {
  const Icon = config.icon;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        selected
          ? { borderColor: config.color, backgroundColor: `${config.color}1A` }
          : { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <Icon size={iconSize.lg} color={config.color} />
      <Text style={[styles.label, selected && { color: config.color }]}>
        {config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 72,
    borderWidth: 2,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
