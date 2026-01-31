import { View, Text, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, LogOut } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { ButtonSecondary } from '@/shared/components/ButtonSecondary';
import { useAuthStore } from '@/shared/store/authStore';
import { signOut } from '@/features/auth/services/authService';
import { APP_NAME } from '@/shared/config/constants';

export function AgentHomeScreen() {
  const userData = useAuthStore((s) => s.userData);
  const institutionData = useAuthStore((s) => s.institutionData);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('[Agent] Error al cerrar sesión:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ShieldCheck size={64} color={colors.primary} strokeWidth={1.5} />
        <Text style={styles.appName}>{APP_NAME}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Agente</Text>
        </View>

        <Text style={styles.greeting}>
          Hola, {userData?.firstName ?? 'Agente'}
        </Text>

        {institutionData && (
          <Text style={styles.institution}>{institutionData.name}</Text>
        )}

        <Text style={styles.subtitle}>Home del Agente</Text>
        <Text style={styles.hint}>
          (Se implementará en próximos sprints)
        </Text>

        <ButtonSecondary
          title="Cerrar sesión"
          icon={LogOut}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  appName: {
    fontSize: fontSize.h1,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.md,
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  badgeText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  greeting: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  institution: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  hint: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing['2xl'],
    alignSelf: 'stretch',
  },
});
