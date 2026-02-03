import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import { InputField } from '@/shared/components/InputField';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/authSchemas';
import { loginWithEmail } from '@/features/auth/services/authService';
import { getFirebaseErrorMessage } from '@/shared/utils/errorMessages';
import { APP_NAME, APP_TAGLINE, APP_SUBTITLE, APP_COPYRIGHT } from '@/shared/config/constants';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationSuccess = route.params?.registrationSuccess;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (registrationSuccess) {
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.',
      );
    }
  }, [registrationSuccess]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await loginWithEmail(data.email, data.password);
      // No quitamos el loading aquí - se mantiene hasta que la navegación ocurra
      // automáticamente cuando authStore detecte el cambio de autenticación
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error al iniciar sesión', getFirebaseErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <LoadingOverlay visible={isSubmitting} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section — .pen: height 200, centered, gap 8 */}
          <View style={styles.logoSection}>
            <ShieldCheck size={64} color={colors.primary} strokeWidth={1.5} />
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.tagline}>
              {APP_TAGLINE}
              {'\n'}
              {APP_SUBTITLE}
            </Text>
          </View>

          {/* Welcome Section — .pen: centered, padding-top 48 */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <Text style={styles.welcomeSubtitle}>Ingresa a tu cuenta</Text>
          </View>

          {/* Form Section — .pen: gap 16, padding-top 24 */}
          <View style={styles.formSection}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Correo electrónico"
                  iconLeft={Mail}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Contraseña"
                  iconLeft={Lock}
                  iconRight={showPassword ? EyeOff : Eye}
                  onPressIconRight={() => setShowPassword((prev) => !prev)}
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* Forgot Password — .pen: right-aligned */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Login Button — .pen: margin-top 32 */}
          <ButtonPrimary
            title="INICIAR SESIÓN"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.loginButton}
          />

          {/* Divider — .pen: gap 16, margin-top 32 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link — .pen: gap 4, centered */}
          <View style={styles.registerLink}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer to push footer down */}
          <View style={styles.spacer} />

          {/* Footer — .pen: bottom, centered */}
          <Text style={styles.footerText}>{APP_COPYRIGHT}</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  // Logo — .pen: height 200, alignItems center, justifyContent center, gap 8
  logoSection: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  appName: {
    fontSize: fontSize.h1,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Welcome — .pen: alignItems center, padding-top 48, gap 8
  welcomeSection: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    gap: spacing.sm,
  },
  welcomeTitle: {
    fontSize: fontSize.h2,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  // Form — .pen: gap 16, padding-top 24
  formSection: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  // Forgot — .pen: right-aligned, padding-top 16
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.md,
  },
  forgotPasswordText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  // Button — .pen: padding-top 32
  loginButton: {
    marginTop: spacing.xl,
  },
  // Divider — .pen: gap 16, padding-top 32
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  // Register link — .pen: gap 4, centered, padding-top 24
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  registerText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  registerLinkText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  spacer: {
    flex: 1,
  },
  // Footer — .pen: bottom, padding-bottom 24
  footerText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingBottom: spacing.lg,
  },
});
