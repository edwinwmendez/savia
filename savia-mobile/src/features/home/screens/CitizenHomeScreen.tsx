import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardList, Map, ShieldOff } from 'lucide-react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { EmergencyButton } from '@/features/home/components/EmergencyButton';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const userData = useAuthStore((s) => s.userData);

  const firstName = userData?.firstName ?? '';
  const initials = `${userData?.firstName?.[0] ?? ''}${userData?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleEmergencyPress = () => {
    console.log('[Home] Navegando a SelectAlertType');
    navigation.navigate('SelectAlertType');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <HomeHeader
        initials={initials}
        notificationCount={0}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            badgeCount={0}
            badgeColor={colors.primary}
            badgeBgColor={colors.primaryLight}
          />
          <QuickActionCard
            title="Alertas Cercanas"
            icon={Map}
            iconColor={colors.success}
            badgeCount={0}
            badgeColor={colors.success}
            badgeBgColor="#E8F5E9"
          />
        </View>

        {/* Alertas recientes */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>ALERTAS RECIENTES EN TU ZONA</Text>
        </View>

        {/* Empty state */}
        <View style={styles.emptyState}>
          <ShieldOff size={48} color={colors.border} strokeWidth={1.5} />
          <Text style={styles.emptyText}>No hay alertas recientes en tu zona</Text>
        </View>
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
});
