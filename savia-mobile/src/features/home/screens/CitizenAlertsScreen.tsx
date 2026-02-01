import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardList } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { TabSelector } from '@/shared/components/TabSelector';
import { RecentAlertItem } from '@/features/home/components/RecentAlertItem';
import { useAlertsStore } from '@/features/alerts/store/alertsStore';
import { subscribeToCitizenAlerts } from '@/features/alerts/services/alertQueryService';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';
import type { AlertData } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Activas' },
  { key: 'closed', label: 'Cerradas' },
];

export function CitizenAlertsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);

  const alerts = useAlertsStore((s) => s.alerts);
  const selectedTab = useAlertsStore((s) => s.selectedTab);
  const isLoading = useAlertsStore((s) => s.isLoading);
  const filteredAlerts = useAlertsStore((s) => s.filteredAlerts);
  const activeCount = useAlertsStore((s) => s.activeCount);
  const setAlerts = useAlertsStore((s) => s.setAlerts);
  const setSelectedTab = useAlertsStore((s) => s.setSelectedTab);
  const setLoading = useAlertsStore((s) => s.setLoading);
  const setError = useAlertsStore((s) => s.setError);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const unsubscribe = subscribeToCitizenAlerts(
      user.uid,
      (data) => {
        setAlerts(data);
        setLoading(false);
      },
      (error) => {
        console.error('[CitizenAlerts] Error:', error);
        setError(error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  const handleAlertPress = useCallback(
    (alert: AlertData) => {
      if (alert.id) {
        navigation.navigate('AlertDetail', { alertId: alert.id });
      }
    },
    [navigation],
  );

  const tabsWithBadge = TABS.map((tab) => ({
    ...tab,
    badge: tab.key === 'active' ? activeCount() : undefined,
  }));

  const filtered = filteredAlerts();

  const renderItem = useCallback(
    ({ item }: { item: AlertData }) => (
      <RecentAlertItem alert={item} onPress={() => handleAlertPress(item)} />
    ),
    [handleAlertPress],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderMobile title="Mis Alertas" leftSlot="none" />
      <TabSelector
        tabs={tabsWithBadge}
        activeTab={selectedTab}
        onTabChange={(key) => setSelectedTab(key as 'all' | 'active' | 'closed')}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerState}>
          <ClipboardList size={48} color={colors.border} strokeWidth={1.5} />
          <Text style={styles.emptyText}>
            {selectedTab === 'active'
              ? 'No tienes alertas activas'
              : selectedTab === 'closed'
                ? 'No tienes alertas cerradas'
                : 'No has creado alertas aún'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id ?? ''}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
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
  separator: {
    height: spacing.sm,
  },
});
