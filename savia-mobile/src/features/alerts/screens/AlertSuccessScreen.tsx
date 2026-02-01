import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Check, Bell, House, Eye } from 'lucide-react-native';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, radius } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;
type RouteProps = RouteProp<CitizenStackParamList, 'AlertSuccess'>;

const STEPS = [
  'Un agente tomará tu caso',
  'Te notificaremos cuando esté en camino',
  'Podrás ver el progreso en tiempo real',
];

export function AlertSuccessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const reset = useCreateAlertStore((s) => s.reset);
  const { alertCode } = route.params;

  const handleGoHome = () => {
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'CitizenTabs' }] });
  };

  const handleViewAlert = () => {
    const alertId = route.params.alertId;
    if (alertId) {
      reset();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'CitizenTabs' },
          { name: 'AlertDetail', params: { alertId } },
        ],
      });
    } else {
      handleGoHome();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />

        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Check size={56} color={colors.success} />
          </View>

          <Text style={styles.title}>¡Alerta enviada!</Text>

          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>Tu alerta #{alertCode}</Text>
          </View>

          <Text style={styles.subtitle}>ha sido registrada exitosamente.</Text>
        </View>

        <View style={styles.infoCard}>
          <Bell size={iconSize.xl} color={colors.primary} />
          <Text style={styles.infoTitle}>
            Las autoridades de tu zona han sido notificadas
          </Text>
          <Text style={styles.infoSubtitle}>
            Recibirás actualizaciones sobre el estado de tu alerta
          </Text>
        </View>

        <View style={styles.stepsSection}>
          <Text style={styles.stepsHeader}>¿Qué sigue?</Text>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Pressable style={styles.homeLink} onPress={handleGoHome}>
          <House size={iconSize.sm} color={colors.textSecondary} />
          <Text style={styles.homeLinkText}>Volver al inicio</Text>
        </Pressable>

        <ButtonPrimary
          title="VER ESTADO DE ALERTA"
          icon={Eye}
          onPress={handleViewAlert}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  spacer: {
    flex: 0.3,
  },
  successSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.success}26`,
    borderWidth: 4,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.h1,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  codeBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  codeText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: `${colors.primaryLight}4D`,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  infoTitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  infoSubtitle: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.primary,
    textAlign: 'center',
  },
  stepsSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  stepsHeader: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  homeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  homeLinkText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
});
