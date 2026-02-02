import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useCategoryStore } from '@/features/alerts/store/categoryStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';

interface CategoryFilterChipsProps {
  selected: string[];
  onToggle: (categoryId: string) => void;
}

export function CategoryFilterChips({ selected, onToggle }: CategoryFilterChipsProps) {
  const categories = useCategoryStore((s) => s.categories);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((cat) => {
          const isActive = selected.length === 0 || selected.includes(cat.id);
          return (
            <Pressable
              key={cat.id}
              onPress={() => onToggle(cat.id)}
              style={[
                styles.chip,
                isActive
                  ? { backgroundColor: `${cat.color}26`, borderColor: cat.color }
                  : styles.chipInactive,
              ]}
            >
              {isActive && <View style={[styles.dot, { backgroundColor: cat.color }]} />}
              <Text
                style={[
                  styles.label,
                  isActive ? { color: cat.color } : styles.labelInactive,
                ]}
              >
                {cat.name}
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
