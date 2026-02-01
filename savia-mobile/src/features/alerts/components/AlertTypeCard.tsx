import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import type { AlertCategory } from '@/shared/types/alert';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius, iconSize } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';

interface AlertTypeCardProps {
  category: AlertCategory;
  selected: boolean;
  onPress: () => void;
}

export function AlertTypeCard({ category, selected, onPress }: AlertTypeCardProps) {
  // Obtener el componente de icono dinámicamente por nombre
  const IconComponent = (LucideIcons as Record<string, LucideIcons.LucideIcon>)[category.icon];

  const cardStyle: ViewStyle[] = [styles.card];
  if (selected) {
    cardStyle.push({
      backgroundColor: `${category.color}1A`,
      borderColor: colors.primary,
      shadowOpacity: 0,
      elevation: 0,
    });
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={category.name}
      accessibilityState={{ selected }}
    >
      {IconComponent && (
        <IconComponent size={iconSize.lg} color={category.color} />
      )}
      <Text style={styles.label}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
