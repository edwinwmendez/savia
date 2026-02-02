import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  CircleCheck,
  Share2,
  ArrowRightLeft,
} from 'lucide-react-native';
import { ImageGallery } from '@/features/alerts/components/ImageGallery';
import { MapPlaceholder } from '@/features/alerts/components/MapPlaceholder';
import {
  subscribeToAlertDetail,
  getUserById,
  takeAlert,
} from '@/features/alerts/services/alertQueryService';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { AgentStackParamList } from '@/navigation/types';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';
import type { UserData } from '@/shared/types/user';
import { formatRelativeTime } from '@/shared/utils/formatters';
import { openNavigation } from '@/shared/utils/navigation';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;
type RouteProps = RouteProp<AgentStackParamList, 'AgentAlertDetail'>;

// ── Helpers ────────────────────────────────────────────────────────────

const CATEGORY_COLOR_MAP = Object.fromEntries(
  ALERT_CATEGORIES.map((c) => [c.id, c.color]),
);

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

/** Colores de urgencia segun diseno O03 */
const URGENCY_COLOR_MAP: Record<string, string> = {
  critical: '#D32F2F',
  high: '#F57C00',
  medium: '#FF9800',
  low: '#4CAF50',
};

const URGENCY_LABEL_MAP: Record<string, string> = {
  critical: 'CRITICA',
  high: 'ALTA',
  medium: 'MEDIA',
  low: 'BAJA',
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: '#FF9800', label: 'Pendiente' },
  assigned: { color: '#2196F3', label: 'Asignada' },
  in_progress: { color: '#1976D2', label: 'En progreso' },
  resolved: { color: '#4CAF50', label: 'Resuelta' },
  cancelled: { color: '#757575', label: 'Cancelada' },
};

// ── Component ──────────────────────────────────────────────────────────

export function AgentAlertDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alertId } = route.params;

  const [alert, setAlert] = useState<AlertData | null>(null);
  const [citizenData, setCitizenData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingCase, setIsTakingCase] = useState(false);

  // ── Subscriptions ──────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = subscribeToAlertDetail(
      alertId,
      (data) => {
        setAlert(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('[AgentAlertDetail] Error:', error);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [alertId]);

  useEffect(() => {
    if (alert?.createdBy) {
      getUserById(alert.createdBy).then(setCitizenData).catch(console.error);
    }
  }, [alert?.createdBy]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleTakeCase = useCallback(async () => {
    if (!alert?.id) return;
    setIsTakingCase(true);
    try {
      await takeAlert(alert.id);
      console.log('[AgentAlertDetail] Caso tomado:', alert.id);
    } catch (error: any) {
      const message =
        error?.code === 'functions/failed-precondition'
          ? 'Esta alerta ya fue tomada por otro agente'
          : 'No se pudo tomar el caso. Intenta de nuevo.';
      Alert.alert('Error', message);
    } finally {
      setIsTakingCase(false);
    }
  }, [alert?.id]);

  const handleUpdateStatus = useCallback(() => {
    if (alert?.id) {
      navigation.navigate('UpdateAlertStatus', { alertId: alert.id });
    }
  }, [navigation, alert?.id]);

  const handleNavigate = useCallback(() => {
    if (!alert?.location) return;
    const { latitude, longitude } = alert.location;
    openNavigation(latitude, longitude);
  }, [alert?.location]);

  const handleDerive = useCallback(() => {
    if (alert?.id) {
      navigation.navigate('DeriveAlert', { alertId: alert.id });
    }
  }, [navigation, alert?.id]);

  const handleShare = useCallback(() => {
    // Placeholder: compartir alerta
    Alert.alert('Compartir', 'La funcion de compartir se implementara proximamente.');
  }, []);

  // ── Loading / Error states ─────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Alerta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!alert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Alerta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No se encontro la alerta</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────

  const urgencyColor = URGENCY_COLOR_MAP[alert.urgency] ?? colors.textSecondary;
  const urgencyLabel = URGENCY_LABEL_MAP[alert.urgency] ?? '';
  const statusConfig = STATUS_CONFIG[alert.status];
  const timeAgo = formatRelativeTime(alert.createdAt);
  const showActionBar = alert.status !== 'resolved' && alert.status !== 'cancelled';
  const isPending = alert.status === 'pending';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          Alerta #{alert.alertCode ?? ''}
        </Text>
        <View
          style={[
            styles.urgencyBadge,
            { backgroundColor: urgencyColor },
          ]}
        >
          <Text style={styles.urgencyBadgeText}>{urgencyLabel}</Text>
        </View>
      </View>

      {/* ── Scroll Content ──────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Alert Banner */}
        <View style={[styles.alertBanner, { backgroundColor: `${urgencyColor}1A` }]}>
          <View style={styles.bannerIconContainer}>
            <Text style={styles.bannerEmoji}>{getCategoryEmoji(alert.type)}</Text>
          </View>
          <View style={styles.bannerInfo}>
            <Text style={[styles.bannerType, { color: urgencyColor }]}>
              {alert.categoryName.toUpperCase()}
            </Text>
            <View style={styles.bannerRow}>
              <Text style={styles.bannerTime}>
                Reportado {timeAgo.toLowerCase()}
              </Text>
              {statusConfig && (
                <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}1A` }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                  <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.card}>
          <View style={styles.mapWrapper}>
            <MapPlaceholder
              hasLocation={!!alert.location}
              latitude={alert.location?.latitude}
              longitude={alert.location?.longitude}
              height={180}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.navigateBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={handleNavigate}
          >
            <Navigation size={18} color={colors.surface} />
            <Text style={styles.navigateBtnText}>NAVEGAR AL LUGAR</Text>
          </Pressable>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.locationRow}>
            <MapPin size={24} color="#F44336" />
            <Text style={styles.addressText}>{alert.address}</Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            {'\u{1F4DD}'} Descripcion
          </Text>
          <Text style={styles.descriptionText}>{alert.description}</Text>
        </View>

        {/* Evidence Card */}
        {alert.imageUrls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              {'\u{1F4F7}'} Evidencia adjunta ({alert.imageUrls.length})
            </Text>
            <ImageGallery imageUrls={alert.imageUrls} />
          </View>
        )}

        {/* Reporter Card */}
        {citizenData && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              {'\u{1F464}'} Reportado por
            </Text>
            <View style={styles.reporterRow}>
              <View style={styles.reporterAvatar}>
                <Text style={styles.reporterInitials}>
                  {(citizenData.firstName?.[0] ?? '') +
                    (citizenData.lastName?.[0] ?? '')}
                </Text>
              </View>
              <View style={styles.reporterInfo}>
                <Text style={styles.reporterName}>
                  {citizenData.firstName} {citizenData.lastName}
                </Text>
                <Text style={styles.reporterPhone}>{citizenData.phone}</Text>
              </View>
              <Text style={styles.reporterTime}>{timeAgo}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Action Bar ──────────────────────────────────────────────── */}
      {showActionBar && (
        <View style={styles.actionBar}>
          {/* TOMAR / ACTUALIZAR ESTADO */}
          {isPending ? (
            <Pressable
              style={({ pressed }) => [
                styles.actionBtnTake,
                pressed && styles.actionBtnPressed,
                isTakingCase && styles.actionBtnDisabled,
              ]}
              onPress={handleTakeCase}
              disabled={isTakingCase}
            >
              {isTakingCase ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <CircleCheck size={20} color={colors.surface} />
                  <Text style={styles.actionBtnText}>TOMAR CASO</Text>
                </>
              )}
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.actionBtnUpdate,
                pressed && styles.actionBtnPressed,
              ]}
              onPress={handleUpdateStatus}
            >
              <CircleCheck size={20} color={colors.surface} />
              <Text style={styles.actionBtnText}>ACTUALIZAR ESTADO</Text>
            </Pressable>
          )}

          {/* DERIVAR — solo cuando está asignada o en progreso */}
          {!isPending && (
            <Pressable
              style={({ pressed }) => [
                styles.actionBtnDerive,
                pressed && styles.actionBtnPressed,
              ]}
              onPress={handleDerive}
            >
              <ArrowRightLeft size={20} color="#F57C00" />
            </Pressable>
          )}

          {/* SHARE */}
          <Pressable
            style={({ pressed }) => [
              styles.actionBtnShare,
              pressed && styles.actionBtnSharePressed,
            ]}
            onPress={handleShare}
          >
            <Share2 size={20} color="#757575" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    height: 56,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  urgencyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  urgencyBadgeText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },

  // Loading / Error
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Alert Banner
  alertBanner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bannerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  bannerEmoji: {
    fontSize: 28,
  },
  bannerInfo: {
    flex: 1,
    gap: 4,
  },
  bannerType: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  bannerTime: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },

  // Cards (shared)
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  // Map section
  mapWrapper: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 180,
  },
  navigateBtn: {
    height: 44,
    marginTop: spacing.md,
    backgroundColor: '#1976D2',
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  navigateBtnText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  addressText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },

  // Description
  descriptionText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Reporter
  reporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  reporterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporterInitials: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  reporterInfo: {
    flex: 1,
    gap: 2,
  },
  reporterName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  reporterPhone: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  reporterTime: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },

  // Action Bar
  actionBar: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    paddingBottom: 34,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    ...shadows.lg,
  },
  actionBtnTake: {
    flex: 1,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionBtnUpdate: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionBtnDerive: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: '#F57C00',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnShare: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: '#BDBDBD',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnSharePressed: {
    backgroundColor: '#F5F5F5',
  },
});
