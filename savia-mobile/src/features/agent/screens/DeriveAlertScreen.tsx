import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import {
  fetchActiveInstitutions,
  deriveAlert,
  type InstitutionItem,
} from '@/features/agent/services/deriveService';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import type { AgentStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<AgentStackParamList>;
type RouteProps = RouteProp<AgentStackParamList, 'DeriveAlert'>;

const INSTITUTION_EMOJIS: Record<string, string> = {
  pnp: '\u{1F46E}',
  serenazgo: '\u{1F9BA}',
  bomberos: '\u{1F692}',
  salud: '\u{1F3E5}',
  otro: '\u{1F3E2}',
};

export function DeriveAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alertId } = route.params;
  const userData = useAuthStore((s) => s.userData);

  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveInstitutions()
      .then(setInstitutions)
      .catch((err) => {
        console.error('[DeriveAlert] Error cargando instituciones:', err);
        Alert.alert('Error', 'No se pudieron cargar las instituciones.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectedInstitution = institutions.find((i) => i.id === selectedId);

  const handleConfirm = async () => {
    if (!selectedId) {
      Alert.alert('Selecciona una institucion', 'Debes seleccionar la institución destino.');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Motivo requerido', 'Debes indicar el motivo de la derivación.');
      return;
    }

    setIsSubmitting(true);
    try {
      await deriveAlert(alertId, selectedId, reason.trim());
      Alert.alert(
        'Alerta Derivada',
        `La alerta ha sido derivada a ${selectedInstitution?.name ?? 'la institucion seleccionada'}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      console.error('[DeriveAlert] Error:', error);
      const message = error?.message?.includes('propia institución')
        ? 'No puedes derivar a tu propia institución.'
        : 'No se pudo derivar la alerta. Intenta de nuevo.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const myInstitutionId = userData?.institutionId;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Derivar Alerta</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <AlertTriangle size={20} color="#F57C00" />
            <Text style={styles.warningText}>
              Al derivar esta alerta, dejaras de ser el responsable. La alerta
              volverá a estado pendiente y será atendida por la institución
              seleccionada.
            </Text>
          </View>

          {/* Institution List */}
          <Text style={styles.sectionLabel}>Selecciona la institución destino</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.institutionList}>
              {institutions.map((inst) => {
                const isOwn = inst.id === myInstitutionId;
                const isSelected = inst.id === selectedId;
                const emoji = INSTITUTION_EMOJIS[inst.type] ?? INSTITUTION_EMOJIS.otro;

                return (
                  <Pressable
                    key={inst.id}
                    style={[
                      styles.institutionItem,
                      isSelected && styles.institutionItemSelected,
                      isOwn && styles.institutionItemDisabled,
                    ]}
                    onPress={() => !isOwn && setSelectedId(inst.id)}
                    disabled={isOwn}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.institutionEmoji}>{emoji}</Text>
                    <View style={styles.institutionInfo}>
                      <Text
                        style={[
                          styles.institutionName,
                          isOwn && styles.institutionNameDisabled,
                        ]}
                      >
                        {inst.name}
                      </Text>
                      {isOwn && (
                        <Text style={styles.ownLabel}>(Tu institución)</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Reason */}
          <Text style={styles.sectionLabel}>Motivo de derivación *</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Explica por que derivas esta alerta..."
            placeholderTextColor={colors.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Summary Card */}
          {selectedInstitution && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Se derivará a:</Text>
              <Text style={styles.summaryValue}>
                {INSTITUTION_EMOJIS[selectedInstitution.type] ?? ''}{' '}
                {selectedInstitution.name}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                (!selectedId || !reason.trim()) && styles.confirmBtnDisabled,
                pressed && selectedId && reason.trim() && styles.btnPressed,
              ]}
              onPress={handleConfirm}
              disabled={isSubmitting || !selectedId || !reason.trim()}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
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
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // Content
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 40,
  },

  // Warning
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: '#E65100',
    lineHeight: 20,
  },

  // Sections
  sectionLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  // Institution list
  institutionList: {
    gap: spacing.sm,
  },
  institutionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  institutionItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
  },
  institutionItemDisabled: {
    opacity: 0.5,
    backgroundColor: colors.background,
  },

  // Radio button
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  // Institution info
  institutionEmoji: {
    fontSize: 24,
  },
  institutionInfo: {
    flex: 1,
  },
  institutionName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  institutionNameDisabled: {
    color: colors.textSecondary,
  },
  ownLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },

  // Reason
  reasonInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },

  // Summary
  summaryCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F57C00',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
