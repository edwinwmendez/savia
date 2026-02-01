import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Siren } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';

interface EmergencyButtonProps {
  onPress: () => void;
}

export function EmergencyButton({ onPress }: EmergencyButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[colors.error, colors.urgencyCritical]}
        style={styles.gradient}
      >
        <Siren size={48} color={colors.surface} />
        <Text style={styles.text}>REPORTAR EMERGENCIA</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  pressed: {
    opacity: 0.9,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    height: 120,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  text: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
});
