import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { ButtonSecondary } from '@/shared/components/ButtonSecondary';
import { useAuthStore } from '@/shared/store/authStore';
import { signOut } from '@/features/auth/services/authService';

export function AgentProfileScreen() {
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
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.surface} />
        </View>

        <Text style={styles.name}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={styles.email}>{userData?.email}</Text>

        {institutionData && (
          <View style={styles.institutionCard}>
            <Text style={styles.institutionLabel}>Institución</Text>
            <Text style={styles.institutionName}>{institutionData.name}</Text>
          </View>
        )}

        <Text style={styles.hint}>(Perfil completo en próximos sprints)</Text>

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
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  email: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  institutionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  institutionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  institutionName: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing['2xl'],
    alignSelf: 'stretch',
  },
});
