import { View, Text, StyleSheet } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';

interface WarningBannerProps {
  message: string;
}

export function WarningBanner({ message }: WarningBannerProps) {
  return (
    <View style={styles.container}>
      <TriangleAlert size={iconSize.md} color={colors.warning} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.warning}1A`,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  text: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
    lineHeight: fontSize.bodySmall * 1.5,
  },
});
