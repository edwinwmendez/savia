import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { UrgencyBadge } from './UrgencyBadge';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';
import type { AlertCategory, UrgencyLevel } from '@/shared/types/alert';

interface AlertSummaryCardProps {
  category: AlertCategory;
  urgency: UrgencyLevel;
  address: string;
  description: string;
}

export function AlertSummaryCard({ category, urgency, address, description }: AlertSummaryCardProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>RESUMEN DE TU ALERTA</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Tipo:</Text>
          <Text style={styles.rowValue}>{category.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Urgencia:</Text>
          <UrgencyBadge level={urgency} />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Ubicación:</Text>
          <View style={styles.locationRow}>
            <MapPin size={iconSize.sm} color={colors.textSecondary} />
            <Text style={styles.rowValue} numberOfLines={1}>{address}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Descripción:</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  header: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  rowValue: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  description: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
    lineHeight: fontSize.body * 1.4,
  },
});
