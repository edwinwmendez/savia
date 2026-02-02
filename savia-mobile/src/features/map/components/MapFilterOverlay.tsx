import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { RadiusSelector } from './RadiusSelector';
import { UrgencyFilterChips } from './UrgencyFilterChips';
import { CategoryFilterChips } from './CategoryFilterChips';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { RadiusOption } from '@/features/map/store/nearbyAlertsStore';
import type { UrgencyLevel } from '@/shared/types/alert';

interface MapFilterOverlayProps {
  selectedRadius: RadiusOption;
  onSelectRadius: (value: RadiusOption) => void;
  selectedUrgencies: UrgencyLevel[];
  onToggleUrgency: (level: UrgencyLevel) => void;
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  showMapPOIs: boolean;
  onToggleMapPOIs: () => void;
  onClose: () => void;
}

export function MapFilterOverlay({
  selectedRadius,
  onSelectRadius,
  selectedUrgencies,
  onToggleUrgency,
  selectedCategories,
  onToggleCategory,
  showMapPOIs,
  onToggleMapPOIs,
  onClose,
}: MapFilterOverlayProps) {
  return (
    <>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Panel */}
      <View style={styles.panel}>
        <Text style={styles.sectionLabel}>Radio</Text>
        <RadiusSelector selected={selectedRadius} onSelect={onSelectRadius} />
        <Text style={styles.sectionLabel}>Urgencia</Text>
        <UrgencyFilterChips selected={selectedUrgencies} onToggle={onToggleUrgency} />
        <Text style={styles.sectionLabel}>Tipo de alerta</Text>
        <CategoryFilterChips selected={selectedCategories} onToggle={onToggleCategory} />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Mostrar lugares de Google</Text>
          <Switch
            value={showMapPOIs}
            onValueChange={onToggleMapPOIs}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={showMapPOIs ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: spacing.md,
    right: spacing.md,
    zIndex: 11,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.lg,
  },
  sectionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  switchLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
