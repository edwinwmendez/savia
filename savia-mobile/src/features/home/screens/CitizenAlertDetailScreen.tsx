import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert as RNAlert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Share2, MapPin, Clock, Phone, Navigation } from 'lucide-react-native';
import { AlertTimeline } from '@/features/alerts/components/AlertTimeline';
import { MapPlaceholder } from '@/features/alerts/components/MapPlaceholder';
import { ImageGallery } from '@/features/alerts/components/ImageGallery';
import { subscribeToAlertDetail, getUserById } from '@/features/alerts/services/alertQueryService';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { formatTimestamp } from '@/shared/utils/formatters';
import type { CitizenStackParamList } from '@/navigation/types';
import type { AlertData, AlertStatus } from '@/shared/types/alert';
import type { UserData } from '@/shared/types/user';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;
type RouteProps = RouteProp<CitizenStackParamList, 'AlertDetail'>;

// ── Badge configs (matching C14 design) ────────────────────────────────

const URGENCY_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: '#FFEBEE', color: '#D32F2F', label: 'Critica' },
  high: { bg: '#FFF3E0', color: '#F57C00', label: 'Alta' },
  medium: { bg: '#FFF8E1', color: '#FF9800', label: 'Media' },
  low: { bg: '#E8F5E9', color: '#388E3C', label: 'Baja' },
};

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#FFF3E0', color: '#FF9800', label: 'Pendiente' },
  assigned: { bg: '#FFF3E0', color: '#F57C00', label: 'En Atencion' },
  in_progress: { bg: '#E3F2FD', color: '#1976D2', label: 'En Atencion' },
  resolved: { bg: '#E8F5E9', color: '#4CAF50', label: 'Resuelta' },
  cancelled: { bg: '#F5F5F5', color: '#757575', label: 'Cancelada' },
};

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

function getInitials(name?: string): string {
  if (!name) return '??';
  const parts = name.split(' ');
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

// ── Component ──────────────────────────────────────────────────────────

export function CitizenAlertDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alertId } = route.params;

  const [alert, setAlert] = useState<AlertData | null>(null);
  const [agentData, setAgentData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAlertDetail(
      alertId,
      (data) => {
        setAlert(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('[AlertDetail] Error:', error);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [alertId]);

  // Fallback: cargar datos del agente si no están embebidos en la alerta
  useEffect(() => {
    if (alert?.assignedTo && !alert.assignedAgentName) {
      getUserById(alert.assignedTo)
        .then(setAgentData)
        .catch((err) => console.error('[AlertDetail] Error obteniendo agente:', err));
    }
  }, [alert?.assignedTo, alert?.assignedAgentName]);

  // ── Loading / Error ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Detalle de Alerta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
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
          <Text style={styles.headerTitle}>Detalle de Alerta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No se encontro la alerta</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────

  const categoryColor = CATEGORY_COLOR_MAP[alert.type] ?? colors.textSecondary;
  const urgency = URGENCY_BADGE[alert.urgency] ?? URGENCY_BADGE.low;
  const status = STATUS_BADGE[alert.status] ?? STATUS_BADGE.pending;

  const timelineEntries =
    alert.statusHistory && alert.statusHistory.length > 0
      ? alert.statusHistory
      : [{ status: 'pending' as AlertStatus, timestamp: alert.createdAt }];

  // Nombre del agente: embebido en alerta o fallback desde getUserById
  const agentName = alert.assignedAgentName
    ?? (agentData ? `${agentData.firstName} ${agentData.lastName}` : null);
  const agentInstitution = alert.assignedInstitutionName
    ?? alert.assignedInstitution
    ?? (agentData?.institutionId ?? null);

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleShare = () => {
    RNAlert.alert('Compartir', 'La funcion de compartir se implementara proximamente.');
  };

  const handleNavigate = () => {
    if (!alert.location) return;
    const { latitude, longitude } = alert.location;
    const label = encodeURIComponent(alert.address || 'Ubicacion de alerta');

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback a Google Maps web
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
        );
      });
    }
  };

  const handleRate = () => {
    if (alert.status !== 'resolved') {
      RNAlert.alert('No disponible', 'Podras calificar cuando tu alerta sea resuelta.');
      return;
    }
    RNAlert.alert('Calificar', 'La calificacion se implementara proximamente.');
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Detalle de Alerta</Text>
        </View>
        <Pressable onPress={handleShare} hitSlop={8}>
          <Share2 size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Alert Card ────────────────────────────────────────────── */}
        <View style={styles.alertCard}>
          {/* Card header: icon + type + urgency badge */}
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}26` }]}>
              <Text style={styles.iconEmoji}>{getCategoryEmoji(alert.type)}</Text>
            </View>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.alertType}>{alert.categoryName}</Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: urgency.bg }]}>
              <View style={[styles.pillDot, { backgroundColor: urgency.color }]} />
              <Text style={[styles.pillText, { color: urgency.color }]}>
                {urgency.label}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>{alert.description}</Text>

          {/* Location */}
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{alert.address}</Text>
          </View>

          {/* Time */}
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{formatTimestamp(alert.createdAt)}</Text>
          </View>

          {/* Mini Map */}
          <View style={styles.miniMapWrapper}>
            <MapPlaceholder
              hasLocation={!!alert.location}
              latitude={alert.location?.latitude}
              longitude={alert.location?.longitude}
              height={120}
            />
          </View>

          {/* Status */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <View style={[styles.pillBadge, { backgroundColor: status.bg }]}>
              <View style={[styles.pillDot, { backgroundColor: status.color }]} />
              <Text style={[styles.pillText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Navigate button */}
          <Pressable
            style={({ pressed }) => [
              styles.btnSolid,
              pressed && styles.btnOpacity,
            ]}
            onPress={handleNavigate}
          >
            <Navigation size={20} color={colors.surface} />
            <Text style={styles.btnSolidText}>Navegar</Text>
          </Pressable>
        </View>

        {/* ── Timeline Card ─────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>HISTORIAL DE LA ALERTA</Text>
          <AlertTimeline
            statusHistory={timelineEntries}
            currentStatus={alert.status}
          />
        </View>

        {/* ── Agent Card ────────────────────────────────────────────── */}
        {alert.assignedTo && agentName && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>AGENTE ASIGNADO</Text>
            <View style={styles.agentRow}>
              <View style={styles.agentAvatar}>
                <Text style={styles.agentInitials}>
                  {getInitials(agentName)}
                </Text>
              </View>
              <View style={styles.agentContent}>
                <Text style={styles.agentName}>{agentName}</Text>
                <Text style={styles.agentRole}>
                  {agentInstitution ?? 'Sin institucion'}
                </Text>
              </View>
              <Pressable style={styles.phoneBtn} onPress={() => {}}>
                <Phone size={20} color={colors.surface} />
              </Pressable>
            </View>
          </View>
        )}

        {/* ── Evidence Card ─────────────────────────────────────────── */}
        {alert.imageUrls.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              EVIDENCIA ({alert.imageUrls.length})
            </Text>
            <ImageGallery imageUrls={alert.imageUrls} />
          </View>
        )}
      </ScrollView>

      {/* ── Bottom: Rate button ─────────────────────────────────────── */}
      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [
            styles.rateBtn,
            pressed && styles.btnOpacity,
          ]}
          onPress={handleRate}
        >
          <Text style={styles.rateBtnText}>Calificar Atencion</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // Center
  centerContainer: {
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
    padding: spacing.lg,
    gap: spacing.lg,
  },

  // ── Alert Card ──
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  cardHeaderContent: {
    flex: 1,
  },
  alertType: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  // ── Pill Badges (urgency + status) ──
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    height: 28,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },

  // ── Description ──
  descriptionText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // ── Info rows (location + time) ──
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },

  // ── Mini map ──
  miniMapWrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },

  // ── Status row ──
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },

  // ── Navigate button ──
  btnSolid: {
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  btnSolidText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  btnOpacity: {
    opacity: 0.85,
  },

  // ── Section Cards (timeline, agent, evidence) ──
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },

  // ── Agent Card ──
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentInitials: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  agentContent: {
    flex: 1,
    gap: 4,
  },
  agentName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  agentRole: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom Section ──
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
    paddingBottom: 32,
  },
  rateBtn: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  rateBtnText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
});
