import { useState } from 'react';
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
import {
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { InputField } from '@/shared/components/InputField';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/authSchemas';
import { registerCitizen } from '@/features/auth/services/authService';
import { getFirebaseErrorMessage } from '@/shared/utils/errorMessages';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_SUBTITLE,
  APP_COPYRIGHT,
  VALIDATION,
} from '@/shared/config/constants';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const CHECKBOX_SIZE = 22;

export function RegisterScreen({ navigation }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      dni: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerCitizen({
        dni: data.dni,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });
      navigation.replace('Login', { registrationSuccess: true });
    } catch (error) {
      Alert.alert('Error al registrar', getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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

          {/* Welcome Section — .pen: centered, padding [24,24,0,24], gap 8 */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Crear Cuenta</Text>
            <Text style={styles.welcomeSubtitle}>Regístrate para comenzar</Text>
          </View>

          {/* Form Section — .pen: gap 16, padding [24,24,0,24] */}
          <View style={styles.formSection}>
            <Controller
              control={control}
              name="dni"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="DNI"
                  iconLeft={CreditCard}
                  placeholder={`DNI (${VALIDATION.DNI_LENGTH} dígitos)`}
                  keyboardType="numeric"
                  maxLength={VALIDATION.DNI_LENGTH}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dni?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Nombres"
                  iconLeft={User}
                  placeholder="Nombres"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Apellidos"
                  iconLeft={User}
                  placeholder="Apellidos"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Celular"
                  iconLeft={Phone}
                  placeholder={`Celular (${VALIDATION.PHONE_LENGTH} dígitos)`}
                  keyboardType="phone-pad"
                  maxLength={VALIDATION.PHONE_LENGTH}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email"
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
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Confirmar contraseña"
                  iconLeft={Lock}
                  iconRight={showConfirmPassword ? EyeOff : Eye}
                  onPressIconRight={() => setShowConfirmPassword((prev) => !prev)}
                  placeholder="Confirmar contraseña"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          {/* Terms Checkbox — .pen: gap 10, padding [16,24,0,24] */}
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <View style={styles.termsSection}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    value && styles.checkboxChecked,
                    errors.acceptTerms && styles.checkboxError,
                  ]}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.7}
                >
                  {value && <Check size={14} color={colors.surface} strokeWidth={3} />}
                </TouchableOpacity>
                <Text style={styles.termsText}>Acepto los términos y condiciones</Text>
              </View>
            )}
          />
          {errors.acceptTerms && (
            <Text style={styles.termsError}>{errors.acceptTerms.message}</Text>
          )}

          {/* Register Button — .pen: padding [32,24,0,24] */}
          <ButtonPrimary
            title="REGISTRARME"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.registerButton}
          />

          {/* Divider — .pen: gap 16, padding [32,24,0,24] */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link — .pen: gap 4, centered, padding [24,24,0,24] */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLinkText}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Footer — .pen: padding [0,24,24,24] */}
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
  // Logo — .pen: height 200, centered, gap 8
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
  // Welcome — .pen: centered, padding-top 24, gap 8
  welcomeSection: {
    alignItems: 'center',
    paddingTop: spacing.lg,
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
  // Terms — .pen: gap 10, padding-top 16
  termsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 10,
  },
  checkbox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  termsText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  termsError: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: CHECKBOX_SIZE + 10,
  },
  // Button — .pen: padding-top 32
  registerButton: {
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
  // Login link — .pen: gap 4, centered, padding-top 24
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  loginText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  loginLinkText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  spacer: {
    flex: 1,
  },
  // Footer — .pen: padding-bottom 24
  footerText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingBottom: spacing.lg,
  },
});
