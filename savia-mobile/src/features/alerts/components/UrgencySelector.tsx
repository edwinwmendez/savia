import { View, Text, StyleSheet } from 'react-native';
import { CircleAlert } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';
import { URGENCY_LEVELS } from '@/features/alerts/data/urgencyLevels';
import { UrgencyOption } from './UrgencyOption';
import type { UrgencyLevel } from '@/shared/types/alert';

interface UrgencySelectorProps {
  selectedLevel: UrgencyLevel | null;
  onSelect: (level: UrgencyLevel) => void;
}

export function UrgencySelector({ selectedLevel, onSelect }: UrgencySelectorProps) {
  const selectedConfig = URGENCY_LEVELS.find((u) => u.level === selectedLevel);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nivel de urgencia</Text>

      <View style={styles.optionsRow}>
        {URGENCY_LEVELS.map((config) => (
          <UrgencyOption
            key={config.level}
            config={config}
            selected={selectedLevel === config.level}
            onPress={() => onSelect(config.level)}
          />
        ))}
      </View>

      {selectedConfig && (
        <View style={[styles.helperBox, { backgroundColor: `${selectedConfig.color}1A` }]}>
          <CircleAlert size={iconSize.md} color={selectedConfig.color} />
          <Text style={styles.helperText}>
            <Text style={[styles.helperBold, { color: selectedConfig.color }]}>
              {selectedConfig.label}:
            </Text>
            {' '}{selectedConfig.description}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  helperBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  helperText: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
    lineHeight: fontSize.bodySmall * 1.5,
  },
  helperBold: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
});
