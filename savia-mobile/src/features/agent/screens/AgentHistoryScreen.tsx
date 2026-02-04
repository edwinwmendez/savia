import { useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Star, Clock } from 'lucide-react-native';
import { subscribeToAgentHistory } from '@/features/alerts/services/alertQueryService';
import { useAgentAlertsStore } from '@/features/agent/store/agentAlertsStore';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { AgentStackParamList } from '@/navigation/types';
import type { AlertData } from '@/shared/types/alert';
import type { Timestamp } from 'firebase/firestore';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;

// ── Helpers ───────────────────────────────────────────────────────────────

function getCategoryEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    robbery: '\u{1F6A8}',
    accident: '\u{1F697}',
    medical: '\u{1F3E5}',
    fire: '\u{1F525}',
    electrical: '\u{26A1}',
    water: '\u{1F4A7}',
    lost: '\u{1F50D}',
    other: '\u{2753}',
  };
  return emojiMap[type] ?? '\u{2753}';
}

const MONTH_NAMES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

const SHORT_MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function formatHistoryDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const day = date.getDate();
  const month = SHORT_MONTH_NAMES[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month}, ${hours}:${minutes}`;
}

function getMonthYearKey(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthYearLabel(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

interface MonthGroup {
  key: string;
  label: string;
  alerts: AlertData[];
}

function groupAlertsByMonth(alerts: AlertData[]): MonthGroup[] {
  const groups: Map<string, MonthGroup> = new Map();

  for (const alert of alerts) {
    const key = getMonthYearKey(alert.createdAt);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: getMonthYearLabel(alert.createdAt),
        alerts: [],
      });
    }
    groups.get(key)!.alerts.push(alert);
  }

  return Array.from(groups.values());
}

// ── Star Rating ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        color={i <= rating ? '#FF9800' : colors.border}
        fill={i <= rating ? '#FF9800' : 'transparent'}
      />,
    );
  }
  return <View style={starStyles.container}>{stars}</View>;
}

const starStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
  },
});

// ── Main Component ────────────────────────────────────────────────────────

export function AgentHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const history = useAgentAlertsStore((s) => s.history);
  const setHistory = useAgentAlertsStore((s) => s.setHistory);
  const isLoading = useAgentAlertsStore((s) => s.isLoading);
  const setLoading = useAgentAlertsStore((s) => s.setLoading);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const unsubscribe = subscribeToAgentHistory(
      user.uid,
      (data) => {
        setHistory(data);
        setLoading(false);
      },
      (error) => {
        console.error('[AgentHistory] Error:', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  const monthGroups = useMemo(() => groupAlertsByMonth(history), [history]);

  const handleAlertPress = useCallback(
    (alert: AlertData) => {
      if (alert.id) {
        navigation.navigate('AgentAlertDetail', { alertId: alert.id });
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Banner */}
          <LinearGradient
            colors={['#1976D2', '#1565C0']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.statsBanner}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Atenciones</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Text style={styles.statNumber}>4.5</Text>
                <Star size={20} color="#FF9800" fill="#FF9800" />
              </View>
              <Text style={styles.statLabel}>Calificacion</Text>
            </View>
          </LinearGradient>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color={colors.border} strokeWidth={1.5} />
              <Text style={styles.emptyText}>
                No tienes atenciones en el historial
              </Text>
            </View>
          ) : (
            monthGroups.map((group) => (
              <View key={group.key} style={styles.monthSection}>
                <Text style={styles.monthHeader}>{group.label}</Text>

                {group.alerts.map((alertItem) => {
                  const isResolved = alertItem.status === 'resolved';
                  const borderColor = isResolved
                    ? colors.success
                    : colors.warning;

                  return (
                    <Pressable
                      key={alertItem.id}
                      style={[
                        styles.historyCard,
                        { borderLeftColor: borderColor },
                      ]}
                      onPress={() => handleAlertPress(alertItem)}
                    >
                      <View style={styles.cardTopRow}>
                        <Text style={styles.cardEmoji}>
                          {getCategoryEmoji(alertItem.type)}
                        </Text>
                        <View style={styles.codeBadge}>
                          <Text style={styles.codeBadgeText}>
                            #{alertItem.alertCode}
                          </Text>
                        </View>
                        <Text
                          style={styles.cardTypeName}
                          numberOfLines={1}
                        >
                          {alertItem.categoryName}
                        </Text>
                      </View>
                      <View style={styles.cardBottomRow}>
                        <Text style={styles.cardDate}>
                          {formatHistoryDate(alertItem.createdAt)}
                        </Text>
                        <StarRating rating={0} />
                      </View>
                    </Pressable>
                  );
                })}

                <Pressable style={styles.viewMoreContainer}>
                  <Text style={styles.viewMoreText}>Ver mas</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    height: 56,
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
  // ── Scroll ──────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // ── Stats Banner ────────────────────────────────────────────────────────
  statsBanner: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.h2,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  statLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary80,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.surfaceOnPrimary10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  // ── Month Section ───────────────────────────────────────────────────────
  monthSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  monthHeader: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  // ── History Card ────────────────────────────────────────────────────────
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    gap: spacing.sm,
    ...shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardEmoji: {
    fontSize: 20,
  },
  codeBadge: {
    backgroundColor: `${colors.primary}1A`,
    borderRadius: radius.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  codeBadgeText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  cardTypeName: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  // ── View More ───────────────────────────────────────────────────────────
  viewMoreContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  viewMoreText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  // ── States ──────────────────────────────────────────────────────────────
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
});
