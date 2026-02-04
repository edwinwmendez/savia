import { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardList } from 'lucide-react-native';
import { TabSelector } from '@/shared/components/TabSelector';
import { AlertListItem } from '@/features/alerts/components/AlertListItem';
import { useAgentAlertsStore } from '@/features/agent/store/agentAlertsStore';
import {
  subscribeToPendingAlerts,
  subscribeToMyCases,
  takeAlert,
} from '@/features/alerts/services/alertQueryService';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, componentHeight } from '@/shared/theme/spacing';
import type { AgentStackParamList } from '@/navigation/types';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;

// ── Constantes de urgencia ──────────────────────────────────────────────

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  critical: '#D32F2F',
  high: '#F57C00',
  medium: '#FF9800',
  low: '#4CAF50',
};

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  critical: 'CRITICAS',
  high: 'ALTA',
  medium: 'MEDIA',
  low: 'BAJA',
};

// Orden de prioridad para la agrupación (critical primero)
const URGENCY_ORDER: UrgencyLevel[] = ['critical', 'high', 'medium', 'low'];

// ── Tipos para SectionList ──────────────────────────────────────────────

interface UrgencySection {
  urgency: UrgencyLevel;
  label: string;
  color: string;
  data: AlertData[];
}

// ── Función de agrupación ───────────────────────────────────────────────

function groupAlertsByUrgency(alerts: AlertData[]): UrgencySection[] {
  const grouped = alerts.reduce<Record<UrgencyLevel, AlertData[]>>(
    (acc, alert) => {
      const level = alert.urgency ?? 'low';
      if (!acc[level]) acc[level] = [];
      acc[level].push(alert);
      return acc;
    },
    {} as Record<UrgencyLevel, AlertData[]>,
  );

  return URGENCY_ORDER
    .filter((level) => grouped[level] && grouped[level].length > 0)
    .map((level) => ({
      urgency: level,
      label: URGENCY_LABELS[level],
      color: URGENCY_COLORS[level],
      data: grouped[level],
    }));
}

// ── Componente principal ────────────────────────────────────────────────

export function AgentAlertsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const institutionData = useAuthStore((s) => s.institutionData);

  const allPendingAlerts = useAgentAlertsStore((s) => s.pendingAlerts);
  const myCases = useAgentAlertsStore((s) => s.myCases);
  const selectedTab = useAgentAlertsStore((s) => s.selectedTab);
  const isLoading = useAgentAlertsStore((s) => s.isLoading);
  const takingCaseId = useAgentAlertsStore((s) => s.takingCaseId);
  const myCasesCount = useAgentAlertsStore((s) => s.myCasesCount);
  const setPendingAlerts = useAgentAlertsStore((s) => s.setPendingAlerts);
  const setMyCases = useAgentAlertsStore((s) => s.setMyCases);
  const setSelectedTab = useAgentAlertsStore((s) => s.setSelectedTab);
  const setLoading = useAgentAlertsStore((s) => s.setLoading);
  const setTakingCaseId = useAgentAlertsStore((s) => s.setTakingCaseId);
  const setError = useAgentAlertsStore((s) => s.setError);

  // Filtrar alertas pendientes según los tipos que atiende la institución del agente
  const pendingAlerts = useMemo(() => {
    const alertTypes = institutionData?.alertTypes ?? institutionData?.categoryIds;
    if (!alertTypes || alertTypes.length === 0) {
      // Si no hay tipos configurados, mostrar todas (fallback)
      return allPendingAlerts;
    }
    return allPendingAlerts.filter((alert) => alertTypes.includes(alert.type));
  }, [allPendingAlerts, institutionData?.alertTypes, institutionData?.categoryIds]);

  const pendingCount = useCallback(() => pendingAlerts.length, [pendingAlerts]);

  // ── Subscripciones ──────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    const unsubPending = subscribeToPendingAlerts(
      (data) => {
        setPendingAlerts(data);
        setLoading(false);
      },
      (error) => {
        console.error('[AgentAlerts] Error pendientes:', error);
        setError(error.message);
        setLoading(false);
      },
    );

    return unsubPending;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubMyCases = subscribeToMyCases(
      user.uid,
      (data) => setMyCases(data),
      (error) => console.error('[AgentAlerts] Error mis casos:', error),
    );

    return unsubMyCases;
  }, [user?.uid]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleTakeCase = useCallback(
    async (alertId: string) => {
      setTakingCaseId(alertId);
      try {
        await takeAlert(alertId);
        console.log('[AgentAlerts] Caso tomado:', alertId);
      } catch (error: any) {
        console.error('[AgentAlerts] Error al tomar caso:', error);
        const message =
          error?.code === 'functions/failed-precondition'
            ? 'Esta alerta ya fue tomada por otro agente'
            : 'No se pudo tomar el caso. Intenta de nuevo.';
        Alert.alert('Error', message);
      } finally {
        setTakingCaseId(null);
      }
    },
    [],
  );

  const handleAlertPress = useCallback(
    (alert: AlertData) => {
      if (alert.id) {
        navigation.navigate('AgentAlertDetail', { alertId: alert.id });
      }
    },
    [navigation],
  );

  // ── Tabs ────────────────────────────────────────────────────────────

  const tabs = [
    {
      key: 'pending',
      label: 'Pendientes',
      badge: pendingCount(),
      badgeColor: colors.error,
      badgeTextColor: colors.surface,
    },
    {
      key: 'myCases',
      label: 'Mis Casos',
      badge: myCasesCount(),
      badgeColor: colors.warning,
      badgeTextColor: colors.textPrimary,
    },
    { key: 'history', label: 'Todas' },
  ];

  // ── Datos agrupados para tab Pendientes ─────────────────────────────

  const sections = useMemo(
    () => groupAlertsByUrgency(pendingAlerts),
    [pendingAlerts],
  );

  // ── Datos planos para tabs Mis Casos y Todas ────────────────────────

  const flatData = useMemo((): AlertData[] => {
    if (selectedTab === 'myCases') return myCases;
    if (selectedTab === 'history') return [...pendingAlerts, ...myCases];
    return [];
  }, [selectedTab, myCases, pendingAlerts]);

  // ── Render helpers ──────────────────────────────────────────────────

  const renderSectionHeader = useCallback(
    ({ section }: { section: UrgencySection }) => (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
        <Text style={[styles.sectionLabel, { color: section.color }]}>
          {section.label}
        </Text>
        <Text style={styles.sectionCount}>({section.data.length})</Text>
      </View>
    ),
    [],
  );

  const renderPendingItem = useCallback(
    ({ item }: { item: AlertData }) => (
      <AlertListItem
        alert={item}
        onPress={() => handleAlertPress(item)}
        onTakeCase={() => item.id && handleTakeCase(item.id)}
        showTakeCaseButton
        isTakingCase={takingCaseId === item.id}
      />
    ),
    [handleAlertPress, handleTakeCase, takingCaseId],
  );

  const renderFlatItem = useCallback(
    ({ item }: { item: AlertData }) => (
      <AlertListItem
        alert={item}
        onPress={() => handleAlertPress(item)}
        showStatusBadge={selectedTab === 'myCases'}
      />
    ),
    [handleAlertPress, selectedTab],
  );

  const renderEmpty = () => (
    <View style={styles.centerState}>
      <ClipboardList size={48} color={colors.border} strokeWidth={1.5} />
      <Text style={styles.emptyText}>
        {selectedTab === 'pending'
          ? 'No hay alertas pendientes'
          : selectedTab === 'myCases'
            ? 'No tienes casos activos'
            : 'No hay alertas'}
      </Text>
    </View>
  );

  // ── Render principal ────────────────────────────────────────────────

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    // Tab Pendientes: SectionList agrupado por urgencia
    if (selectedTab === 'pending') {
      if (sections.length === 0) return renderEmpty();

      return (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id ?? ''}
          renderItem={renderPendingItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      );
    }

    // Tabs Mis Casos y Todas: FlatList plano
    if (flatData.length === 0) return renderEmpty();

    return (
      <FlatList
        data={flatData}
        keyExtractor={(item) => item.id ?? ''}
        renderItem={renderFlatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas</Text>
      </View>

      <TabSelector
        tabs={tabs}
        activeTab={selectedTab}
        onTabChange={(key) => setSelectedTab(key as 'pending' | 'myCases' | 'history')}
      />

      {renderContent()}
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    height: componentHeight.header,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // Estados vacío y carga
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

  // Lista
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  itemSeparator: {
    height: spacing.lg - spacing.sm, // 12px entre cards dentro de una sección
  },
  sectionSeparator: {
    height: spacing.lg, // 24px entre secciones
  },

  // Section header (urgencia)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  sectionCount: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
});
