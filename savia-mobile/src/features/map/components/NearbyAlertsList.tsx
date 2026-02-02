import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { NearbyAlertItem } from './NearbyAlertItem';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { NearbyAlert } from '@/features/map/store/nearbyAlertsStore';

interface NearbyAlertsListProps {
  alerts: NearbyAlert[];
  isLoading: boolean;
  onAlertPress: (alertId: string) => void;
}

export function NearbyAlertsList({ alerts, isLoading, onAlertPress }: NearbyAlertsListProps) {
  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={alerts}
      keyExtractor={(item) => item.id ?? ''}
      ListHeaderComponent={
        <Text style={styles.header}>
          ALERTAS ACTIVAS ({alerts.length})
        </Text>
      }
      renderItem={({ item }) => (
        <NearbyAlertItem
          alert={item}
          onPress={() => item.id && onAlertPress(item.id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.centerState}>
          <MapPin size={48} color={colors.border} strokeWidth={1.5} />
          <Text style={styles.emptyText}>No hay alertas en este radio</Text>
        </View>
      }
      contentContainerStyle={[
        styles.listContent,
        alerts.length === 0 && styles.listContentEmpty,
      ]}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  header: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
});
