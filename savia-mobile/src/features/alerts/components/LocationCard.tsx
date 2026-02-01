import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';

interface LocationCardProps {
  address: string;
  latitude: number;
  longitude: number;
}

export function LocationCard({ address, latitude, longitude }: LocationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MapPin size={iconSize.md} color={colors.success} />
        <Text style={styles.address}>{address}</Text>
      </View>
      <Text style={styles.coordinates}>
        Coordenadas: {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  address: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  coordinates: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
    marginLeft: iconSize.md + spacing.sm,
  },
});
