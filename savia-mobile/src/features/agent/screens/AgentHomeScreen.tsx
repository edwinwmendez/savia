import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck, Bell, Navigation } from 'lucide-react-native';
import {
  subscribeToPendingAlerts,
  subscribeToMyCases,
  subscribeToAgentHistory,
} from '@/features/alerts/services/alertQueryService';
import { subscribeToUnreadCount } from '@/features/notifications/services/notificationQueryService';
import { useAgentAlertsStore } from '@/features/agent/store/agentAlertsStore';
import { useNotificationsStore } from '@/features/notifications/store/notificationsStore';
import { useAuthStore } from '@/shared/store/authStore';
import { APP_NAME } from '@/shared/config/constants';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { AgentStackParamList } from '@/navigation/types';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;

const URGENCY_BORDER_COLORS: Record<UrgencyLevel, string> = {
  critical: colors.urgencyCritical,
  high: colors.urgencyHigh,
  medium: colors.urgencyMedium,
  low: colors.urgencyLow,
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: colors.warning, label: 'Pendiente' },
  assigned: { color: colors.info, label: 'En camino' },
  in_progress: { color: colors.primary, label: 'En el lugar' },
  resolved: { color: colors.success, label: 'Resuelta' },
  cancelled: { color: colors.textSecondary, label: 'Cancelada' },
};

export function AgentHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const userData = useAuthStore((s) => s.userData);
  const institutionData = useAuthStore((s) => s.institutionData);
  const user = useAuthStore((s) => s.user);

  const allPendingAlerts = useAgentAlertsStore((s) => s.pendingAlerts);
  const myCases = useAgentAlertsStore((s) => s.myCases);
  const history = useAgentAlertsStore((s) => s.history);
  const setPendingAlerts = useAgentAlertsStore((s) => s.setPendingAlerts);
  const setMyCases = useAgentAlertsStore((s) => s.setMyCases);
  const setHistory = useAgentAlertsStore((s) => s.setHistory);

  // Filtrar alertas pendientes según los tipos que atiende la institución del agente
  const pendingAlerts = useMemo(() => {
    const alertTypes = institutionData?.alertTypes ?? institutionData?.categoryIds;
    if (!alertTypes || alertTypes.length === 0) {
      // Si no hay tipos configurados, mostrar todas (fallback)
      return allPendingAlerts;
    }
    return allPendingAlerts.filter((alert) => alertTypes.includes(alert.type));
  }, [allPendingAlerts, institutionData?.alertTypes, institutionData?.categoryIds]);

  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount);

  const firstName = userData?.firstName ?? 'Agente';
  const initials = `${userData?.firstName?.[0] ?? ''}${userData?.lastName?.[0] ?? ''}`.toUpperCase();
  const institutionName = institutionData?.name ?? '';

  useEffect(() => {
    const unsubPending = subscribeToPendingAlerts(
      (data) => setPendingAlerts(data),
      (error) => console.error('[AgentHome] Error pendientes:', error),
    );
    return unsubPending;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubCases = subscribeToMyCases(
      user.uid,
      (data) => setMyCases(data),
      (error) => console.error('[AgentHome] Error mis casos:', error),
    );
    return unsubCases;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubCount = subscribeToUnreadCount(
      user.uid,
      (count) => setUnreadCount(count),
      (error) => console.error('[AgentHome] Error conteo notificaciones:', error),
    );
    return unsubCount;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubHistory = subscribeToAgentHistory(
      user.uid,
      (data) => setHistory(data),
      (error) => console.error('[AgentHome] Error historial:', error),
    );
    return unsubHistory;
  }, [user?.uid]);

  // Calcular stats reales desde historial
  const { todayCount, monthCount } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let today = 0;
    let month = 0;

    for (const alert of history) {
      const ts = alert.updatedAt?.toDate?.()?.getTime?.() ?? 0;
      if (ts >= monthStart) {
        month++;
        if (ts >= todayStart) {
          today++;
        }
      }
    }

    return { todayCount: today, monthCount: month };
  }, [history]);

  const handleViewAlerts = () => {
    navigation.navigate('AgentTabs', { screen: 'Alerts' } as any);
  };

  const handleCasePress = useCallback(
    (alert: AlertData) => {
      if (alert.id) {
        navigation.navigate('AgentAlertDetail', { alertId: alert.id });
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={24} color={colors.primary} />
          <Text style={styles.appName}>{APP_NAME}</Text>
          <View style={styles.agentBadge}>
            <Text style={styles.agentBadgeText}>Agente</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable hitSlop={8} style={styles.bellContainer} onPress={() => navigation.navigate('AgentNotifications')}>
            <Bell size={24} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('AgentTabs', { screen: 'Profile' } as any)}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saludo */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Bienvenido, {firstName} {'\u{1F46E}'}</Text>
          {institutionName !== '' && (
            <Text style={styles.institutionText}>{institutionName}</Text>
          )}
        </View>

        {/* Card alertas pendientes con gradient */}
        <Pressable onPress={handleViewAlerts} style={styles.pendingCardWrapper}>
          <LinearGradient
            colors={['#FF9800', '#E65100']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.pendingCard}
          >
            <View style={styles.pendingLeft}>
              <Text style={styles.pendingNumber}>{pendingAlerts.length}</Text>
              <Text style={styles.pendingLabel}>Alertas pendientes</Text>
            </View>
            <View style={styles.pendingButton}>
              <Text style={styles.pendingButtonText}>VER ALERTAS</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && styles.statCardPressed]}
            onPress={() => navigation.navigate('AgentTabs', { screen: 'History' } as any)}
          >
            <Text style={styles.statNumber}>{todayCount}</Text>
            <Text style={styles.statLabel}>Atendidas hoy</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && styles.statCardPressed]}
            onPress={() => navigation.navigate('AgentTabs', { screen: 'History' } as any)}
          >
            <Text style={styles.statNumber}>{monthCount}</Text>
            <Text style={styles.statLabel}>Este mes</Text>
          </Pressable>
        </View>

        {/* Mis casos activos */}
        {myCases.length > 0 && (
          <View style={styles.casesSection}>
            <View style={styles.casesSectionHeader}>
              <Text style={styles.casesSectionTitle}>Mis casos activos</Text>
              <Pressable onPress={handleViewAlerts}>
                <Text style={styles.viewAllLink}>Ver todos</Text>
              </Pressable>
            </View>

            {myCases.slice(0, 3).map((alertItem) => {
              const urgencyColor =
                URGENCY_BORDER_COLORS[alertItem.urgency] ?? colors.textSecondary;
              const statusConfig = STATUS_CONFIG[alertItem.status];

              return (
                <Pressable
                  key={alertItem.id}
                  style={[styles.caseCard, { borderLeftColor: urgencyColor }]}
                  onPress={() => handleCasePress(alertItem)}
                >
                  <View style={styles.caseCardTop}>
                    <Text style={styles.caseCode}>#{alertItem.alertCode}</Text>
                    <Text style={styles.caseType} numberOfLines={1}>
                      {alertItem.categoryName}
                    </Text>
                  </View>
                  <Text style={styles.caseAddress} numberOfLines={1}>
                    {alertItem.address}
                  </Text>
                  <View style={styles.caseCardBottom}>
                    <View style={styles.statusRow}>
                      {statusConfig && (
                        <>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: statusConfig.color },
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: statusConfig.color },
                            ]}
                          >
                            {statusConfig.label}
                          </Text>
                        </>
                      )}
                    </View>
                    <View style={styles.caseActions}>
                      <Pressable
                        style={styles.actionButton}
                        onPress={() =>
                          alertItem.id &&
                          navigation.navigate('UpdateAlertStatus', {
                            alertId: alertItem.id,
                          })
                        }
                      >
                        <Text style={styles.actionButtonText}>Actualizar</Text>
                      </Pressable>
                      <Pressable style={styles.actionButton}>
                        <Navigation size={12} color={colors.primary} />
                        <Text style={styles.actionButtonText}>Navegar</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    height: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  agentBadge: {
    marginLeft: spacing.sm,
    backgroundColor: `${colors.success}42`,
    borderRadius: radius.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  agentBadgeText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.success,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bellContainer: {
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  // ── Scroll ──────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
    paddingHorizontal: spacing.lg,
  },
  // ── Greeting ────────────────────────────────────────────────────────────
  greetingSection: {
    gap: spacing.xs,
  },
  greetingTitle: {
    fontSize: fontSize.h2,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  institutionText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  // ── Pending Card ────────────────────────────────────────────────────────
  pendingCardWrapper: {
    borderRadius: radius.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pendingCard: {
    height: 120,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingLeft: {},
  pendingNumber: {
    fontSize: 48,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  pendingLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary90,
  },
  pendingButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pendingButtonText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.warning,
  },
  // ── Stats ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statCardPressed: {
    opacity: 0.7,
  },
  statNumber: {
    fontSize: fontSize.h2,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  // ── Cases Section ───────────────────────────────────────────────────────
  casesSection: {
    gap: spacing.md,
  },
  casesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  casesSectionTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  viewAllLink: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  // ── Case Card ───────────────────────────────────────────────────────────
  caseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    ...shadows.sm,
  },
  caseCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  caseCode: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  caseType: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  caseAddress: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  caseCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
  },
  caseActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionButtonText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
