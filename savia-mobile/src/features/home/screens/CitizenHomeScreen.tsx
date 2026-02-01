import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardList, Map, ShieldOff } from 'lucide-react-native';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationsStore } from '@/features/notifications/store/notificationsStore';
import { db } from '@/shared/config/firebase';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { EmergencyButton } from '@/features/home/components/EmergencyButton';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import { RecentAlertItem } from '@/features/home/components/RecentAlertItem';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';
import type { AlertData } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

const RECENT_ALERTS_LIMIT = 10;

export function CitizenHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const userData = useAuthStore((s) => s.userData);

  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  const firstName = userData?.firstName ?? '';
  const initials = `${userData?.firstName?.[0] ?? ''}${userData?.lastName?.[0] ?? ''}`.toUpperCase();

  // Listener en tiempo real para alertas del ciudadano
  // onSnapshot mantiene una conexión persistente via WebSocket.
  // Solo cobra 1 read por documento en la carga inicial,
  // y luego 1 read por cada documento que cambie (no re-lee todo).
  useEffect(() => {
    if (!user?.uid) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }

    console.log('[Home] Iniciando listener de alertas para', user.uid);

    const alertsQuery = query(
      collection(db, 'alerts'),
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(RECENT_ALERTS_LIMIT),
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AlertData[];
        console.log('[Home] Alertas recibidas:', data.length);
        setAlerts(data);
        setIsLoading(false);
        setIsRefreshing(false);
      },
      (error) => {
        console.error('[Home] Error en listener de alertas:', error);
        setIsLoading(false);
        setIsRefreshing(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  // Pull-to-refresh: solo muestra feedback visual.
  // El onSnapshot ya mantiene los datos actualizados en tiempo real,
  // así que no necesitamos hacer una query adicional (getDocs) que
  // consumiría reads extra en Firestore.
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    console.log('[Home] Pull-to-refresh (datos ya en tiempo real via onSnapshot)');
    // El listener onSnapshot actualizará isRefreshing a false
    // cuando reciba el siguiente snapshot. Si no hay cambios,
    // cerramos el spinner después de 1 segundo.
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleEmergencyPress = () => {
    console.log('[Home] Navegando a SelectAlertType');
    navigation.navigate('SelectAlertType');
  };

  // Contar alertas activas (no resueltas ni canceladas)
  const activeAlertCount = alerts.filter(
    (a) => a.status !== 'resolved' && a.status !== 'cancelled',
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <HomeHeader
        initials={initials}
        notificationCount={unreadCount}
        onPressBell={() => navigation.navigate('CitizenTabs', { screen: 'Notifications' } as any)}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Saludo */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hola, {firstName} 👋</Text>
          <Text style={styles.greetingSubtitle}>¿Cómo podemos ayudarte?</Text>
        </View>

        {/* Botón de emergencia */}
        <View style={styles.emergencyWrapper}>
          <EmergencyButton onPress={handleEmergencyPress} />
        </View>

        {/* Acciones rápidas */}
        <View style={styles.quickActions}>
          <QuickActionCard
            title="Mis Alertas"
            icon={ClipboardList}
            iconColor={colors.primary}
            badgeCount={activeAlertCount}
            badgeColor={colors.primary}
            badgeBgColor={colors.primaryLight}
            onPress={() => navigation.navigate('CitizenTabs', { screen: 'Alerts' } as any)}
          />
          <QuickActionCard
            title="Alertas Cercanas"
            icon={Map}
            iconColor={colors.success}
            badgeCount={0}
            badgeColor={colors.success}
            badgeBgColor="#E8F5E9"
            onPress={() => navigation.navigate('CitizenTabs', { screen: 'Map' } as any)}
          />
        </View>

        {/* Alertas recientes */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>ALERTAS RECIENTES EN TU ZONA</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <ShieldOff size={48} color={colors.border} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No hay alertas recientes en tu zona</Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <RecentAlertItem
                key={alert.id}
                alert={alert}
                onPress={() => alert.id && navigation.navigate('AlertDetail', { alertId: alert.id })}
              />
            ))}
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
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  greetingSection: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  greetingTitle: {
    fontSize: fontSize.h2,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  emergencyWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  recentHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  recentTitle: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  loadingState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  alertsList: {
    gap: spacing.sm + 4,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
