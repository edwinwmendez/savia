import { useEffect, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BellOff } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { TabSelector } from '@/shared/components/TabSelector';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { useNotificationsStore, type NotificationSection } from '@/features/notifications/store/notificationsStore';
import {
  subscribeToNotifications,
  subscribeToUnreadCount,
  markAsRead,
  clearAllNotifications,
} from '@/features/notifications/services/notificationQueryService';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { AgentStackParamList } from '@/navigation/types';
import type { NotificationData } from '@/shared/types/notification';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'unread', label: 'No leídas' },
];

export function AgentNotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);

  const selectedTab = useNotificationsStore((s) => s.selectedTab);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const isLoading = useNotificationsStore((s) => s.isLoading);
  const groupedByDate = useNotificationsStore((s) => s.groupedByDate);
  const setNotifications = useNotificationsStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount);
  const setSelectedTab = useNotificationsStore((s) => s.setSelectedTab);
  const setLoading = useNotificationsStore((s) => s.setLoading);
  const setError = useNotificationsStore((s) => s.setError);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const unsubNotifs = subscribeToNotifications(
      user.uid,
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      (error) => {
        console.error('[AgentNotifications] Error:', error);
        setError(error.message);
        setLoading(false);
      },
    );

    const unsubCount = subscribeToUnreadCount(
      user.uid,
      (count) => setUnreadCount(count),
      (error) => console.error('[AgentNotifications] Error conteo:', error),
    );

    return () => {
      unsubNotifs();
      unsubCount();
    };
  }, [user?.uid]);

  const handleNotificationPress = useCallback(
    (notification: NotificationData) => {
      // Navegar inmediatamente
      if (notification.alertId) {
        navigation.navigate('AgentAlertDetail', { alertId: notification.alertId });
      }
      // Marcar como leída en background (sin bloquear la navegación)
      if (!notification.read) {
        markAsRead(notification.id).catch((error) =>
          console.error('[AgentNotifications] Error marcando como leída:', error),
        );
      }
    },
    [navigation],
  );

  const handleClearAll = useCallback(() => {
    if (!user?.uid) return;

    Alert.alert(
      'Limpiar notificaciones',
      '¿Eliminar todas las notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllNotifications(user.uid);
            } catch (error) {
              console.error('[AgentNotifications] Error limpiando:', error);
            }
          },
        },
      ],
    );
  }, [user?.uid]);

  const tabsWithBadge = TABS.map((tab) => ({
    ...tab,
    badge: tab.key === 'unread' ? unreadCount : undefined,
    badgeColor: tab.key === 'unread' ? colors.error : undefined,
    badgeTextColor: tab.key === 'unread' ? colors.surface : undefined,
  }));

  const sections = groupedByDate();

  const renderItem = useCallback(
    ({ item }: { item: NotificationData }) => (
      <NotificationItem
        notification={item}
        onPress={() => handleNotificationPress(item)}
      />
    ),
    [handleNotificationPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: NotificationSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderMobile
        title="Notificaciones"
        onBack={() => navigation.goBack()}
        rightText="Limpiar"
        onRightTextPress={handleClearAll}
      />
      <TabSelector
        tabs={tabsWithBadge}
        activeTab={selectedTab}
        onTabChange={(key) => setSelectedTab(key as 'all' | 'unread')}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.centerState}>
          <BellOff size={48} color={colors.border} strokeWidth={1.5} />
          <Text style={styles.emptyText}>
            {selectedTab === 'unread'
              ? 'No tienes notificaciones sin leer'
              : 'No hay notificaciones'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
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
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
