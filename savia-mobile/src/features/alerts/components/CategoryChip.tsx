import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';
import type { AlertCategory } from '@/shared/types/alert';

interface CategoryChipProps {
  category: AlertCategory;
  onEdit?: () => void;
}

export function CategoryChip({ category, onEdit }: CategoryChipProps) {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: `${category.color}1A` }]}
      onPress={onEdit}
      disabled={!onEdit}
    >
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={styles.label}>{category.name}</Text>
      {onEdit && <Pencil size={iconSize.sm} color={colors.textSecondary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
