import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Check, Camera, Plus } from 'lucide-react-native';
import {
  subscribeToAlertDetail,
  updateAlertStatus,
} from '@/features/alerts/services/alertQueryService';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { AgentStackParamList } from '@/navigation/types';
import type { AlertData, AlertStatus } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;
type RouteProps = RouteProp<AgentStackParamList, 'UpdateAlertStatus'>;

// ── Status option config ────────────────────────────────────────────────

interface StatusOption {
  status: AlertStatus;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}

/** Todas las opciones de estado en orden del flujo */
const ALL_STATUS_OPTIONS: StatusOption[] = [
  {
    status: 'assigned',
    emoji: '\u{1F697}',
    title: 'En camino',
    subtitle: 'Me dirijo al lugar',
    color: '#FF9800',
  },
  {
    status: 'in_progress',
    emoji: '\u{1F4CD}',
    title: 'En el lugar',
    subtitle: 'He llegado al sitio',
    color: '#1976D2',
  },
  {
    status: 'in_progress' as AlertStatus,
    emoji: '\u{1F527}',
    title: 'Atendiendo',
    subtitle: 'Resolviendo la situacion',
    color: '#9C27B0',
    // Nota: este estado intermedio se mapea visualmente pero
    // la transicion real es assigned -> in_progress -> resolved
  },
  {
    status: 'resolved',
    emoji: '\u{2705}',
    title: 'Resuelto',
    subtitle: 'Incidente controlado',
    color: '#4CAF50',
  },
];

/**
 * Indice canonico del status actual en el flujo visual.
 * assigned = ya paso "En camino" (indice 0)
 * in_progress = ya paso "En el lugar" y "Atendiendo" (indices 0-2)
 */
function getCompletedIndex(currentStatus: AlertStatus): number {
  switch (currentStatus) {
    case 'assigned':
      return 0; // "En camino" completado
    case 'in_progress':
      return 2; // "En camino", "En el lugar", "Atendiendo" completados
    default:
      return -1;
  }
}

/**
 * Determina la unica opcion seleccionable segun el estado actual.
 * assigned -> puede seleccionar indice 1 ("En el lugar" -> mapea a in_progress)
 * in_progress -> puede seleccionar indice 3 ("Resuelto" -> mapea a resolved)
 */
function getSelectableIndex(currentStatus: AlertStatus): number {
  switch (currentStatus) {
    case 'assigned':
      return 1;
    case 'in_progress':
      return 3;
    default:
      return -1;
  }
}

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

/** Color del dot de status en la referencia de alerta */
const STATUS_COLOR_MAP: Record<string, string> = {
  pending: '#FF9800',
  assigned: '#FF9800',
  in_progress: '#1976D2',
  resolved: '#4CAF50',
  cancelled: '#757575',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'En camino',
  in_progress: 'En el lugar',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

const NOTE_MAX_LENGTH = 500;

// ── Component ──────────────────────────────────────────────────────────

export function UpdateAlertStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alertId } = route.params;

  const [alert, setAlert] = useState<AlertData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isNoteFocused, setIsNoteFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Subscriptions ──────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = subscribeToAlertDetail(
      alertId,
      (data) => setAlert(data),
      (error) => console.error('[UpdateStatus] Error:', error),
    );
    return unsubscribe;
  }, [alertId]);

  // Auto-seleccionar la opcion valida cuando se carga la alerta
  useEffect(() => {
    if (alert && selectedIndex === null) {
      const selectable = getSelectableIndex(alert.status);
      if (selectable >= 0) {
        setSelectedIndex(selectable);
      }
    }
  }, [alert, selectedIndex]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (selectedIndex === null || !alert?.id) return;

    const option = ALL_STATUS_OPTIONS[selectedIndex];
    if (!option) return;

    setIsSubmitting(true);
    try {
      await updateAlertStatus(alert.id, option.status, note.trim() || undefined);
      console.log('[UpdateStatus] Estado actualizado:', option.status);
      navigation.goBack();
    } catch (error: any) {
      console.error('[UpdateStatus] Error:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────

  if (!alert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Actualizar Estado</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────

  const completedIndex = getCompletedIndex(alert.status);
  const selectableIndex = getSelectableIndex(alert.status);
  const statusColor = STATUS_COLOR_MAP[alert.status] ?? colors.textSecondary;
  const statusLabel = STATUS_LABEL_MAP[alert.status] ?? alert.status;

  const selectedOption =
    selectedIndex !== null ? ALL_STATUS_OPTIONS[selectedIndex] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Actualizar Estado</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Alert Reference Card */}
        <View style={styles.alertReference}>
          <Text style={styles.refEmoji}>{getCategoryEmoji(alert.type)}</Text>
          <View style={styles.refInfo}>
            <Text style={styles.refType}>{alert.categoryName}</Text>
            <Text style={styles.refCode}>#{alert.alertCode}</Text>
          </View>
          <View style={styles.refStatus}>
            <View style={[styles.refStatusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.refStatusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Status Selection Section */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Selecciona el nuevo estado</Text>
          <View style={styles.statusOptions}>
            {ALL_STATUS_OPTIONS.map((option, index) => {
              const isCompleted = index <= completedIndex;
              const isSelectable = index === selectableIndex;
              const isSelected = index === selectedIndex;
              const isDisabled = !isSelectable;

              return (
                <Pressable
                  key={`${option.title}-${index}`}
                  style={[
                    styles.statusOption,
                    isSelected && {
                      borderColor: option.color,
                      backgroundColor: `${option.color}1A`,
                    },
                    isCompleted && styles.statusOptionCompleted,
                  ]}
                  onPress={() => {
                    if (isSelectable) {
                      setSelectedIndex(index);
                    }
                  }}
                  disabled={isDisabled}
                >
                  {/* Radio */}
                  <View
                    style={[
                      styles.radio,
                      isCompleted && { borderColor: option.color, backgroundColor: `${option.color}1A` },
                      isSelected && { borderColor: option.color },
                    ]}
                  >
                    {isCompleted && (
                      <Check size={14} color={option.color} />
                    )}
                    {isSelected && !isCompleted && (
                      <View
                        style={[styles.radioInner, { backgroundColor: option.color }]}
                      />
                    )}
                  </View>

                  {/* Emoji */}
                  <Text
                    style={[
                      styles.optionEmoji,
                      isDisabled && !isCompleted && styles.optionDisabled,
                    ]}
                  >
                    {option.emoji}
                  </Text>

                  {/* Text */}
                  <View style={styles.optionTextSection}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isCompleted && { color: option.color },
                        isSelected && !isCompleted && { color: option.color },
                        isDisabled && !isCompleted && styles.optionTitleDisabled,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionSubtitle,
                        isDisabled && !isCompleted && styles.optionSubtitleDisabled,
                      ]}
                    >
                      {option.subtitle}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>
            Nota de actualizacion (opcional)
          </Text>
          <TextInput
            style={[
              styles.noteInput,
              isNoteFocused && styles.noteInputFocused,
            ]}
            value={note}
            onChangeText={setNote}
            placeholder="Agrega detalles sobre el estado actual..."
            placeholderTextColor={colors.textSecondary}
            maxLength={NOTE_MAX_LENGTH}
            multiline
            textAlignVertical="top"
            onFocus={() => setIsNoteFocused(true)}
            onBlur={() => setIsNoteFocused(false)}
          />
          <Text style={styles.noteCounter}>
            {note.length}/{NOTE_MAX_LENGTH}
          </Text>
        </View>

        {/* Evidence Section (placeholder) */}
        <View style={styles.evidenceSection}>
          <Text style={styles.evidenceLabel}>
            Agregar evidencia (opcional)
          </Text>
          <View style={styles.evidenceRow}>
            <Pressable
              style={({ pressed }) => [
                styles.evidenceCameraBtn,
                pressed && styles.evidenceBtnPressed,
              ]}
              onPress={() =>
                Alert.alert('Camara', 'La captura de evidencia se implementara proximamente.')
              }
            >
              <Camera size={24} color="#1976D2" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.evidencePlusBtn,
                pressed && styles.evidenceBtnPressed,
              ]}
              onPress={() =>
                Alert.alert('Galeria', 'La seleccion de galeria se implementara proximamente.')
              }
            >
              <Plus size={24} color="#757575" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ── Submit Bar ──────────────────────────────────────────────── */}
      <View style={styles.submitBar}>
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
            (!selectedOption || isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedOption || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <>
              <Check size={20} color={colors.surface} />
              <Text style={styles.submitBtnText}>ACTUALIZAR ESTADO</Text>
            </>
          )}
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
  headerTitle: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: 120,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  // Alert Reference
  alertReference: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  refEmoji: {
    fontSize: 28,
  },
  refInfo: {
    flex: 1,
    gap: 2,
  },
  refType: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  refCode: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  refStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  refStatusText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
  },

  // Status Selection
  statusSection: {
    gap: spacing.md,
  },
  statusLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  statusOptions: {
    gap: spacing.sm,
  },
  statusOption: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusOptionCompleted: {
    opacity: 0.6,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionTextSection: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  optionTitleDisabled: {
    color: colors.textSecondary,
  },
  optionSubtitle: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  optionSubtitleDisabled: {
    color: colors.border,
  },

  // Note Section
  noteSection: {
    gap: spacing.sm,
  },
  noteLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  noteInput: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: fontSize.body * 1.5,
  },
  noteInputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    padding: spacing.md - 1,
  },
  noteCounter: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'right',
  },

  // Evidence Section
  evidenceSection: {
    gap: spacing.md,
  },
  evidenceLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  evidenceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  evidenceCameraBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: '#1976D21A',
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidencePlusBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceBtnPressed: {
    opacity: 0.7,
  },

  // Submit Bar
  submitBar: {
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    paddingBottom: 34,
    paddingHorizontal: spacing.lg,
    ...shadows.lg,
  },
  submitBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
});
