import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Crosshair } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';

interface GPSButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export function GPSButton({ onPress, loading = false }: GPSButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Crosshair size={iconSize.md} color={colors.primary} />
      )}
      <Text style={styles.label}>Usar mi ubicación actual</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: `${colors.primaryLight}4D`,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
  },
  label: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
