import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  fillColor?: string;
}

export function ProgressBar({ currentStep, totalSteps, fillColor }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.stepText}>Paso {currentStep} de {totalSteps}</Text>
        <Text style={styles.percentText}>{percentage}%</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: fillColor ?? colors.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  percentText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  barBg: {
    height: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  barFill: {
    height: 4,
    borderRadius: radius.sm,
  },
});
