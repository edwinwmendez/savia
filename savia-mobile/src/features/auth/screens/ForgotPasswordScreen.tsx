import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, Mail, Send, ArrowLeft, CircleCheck } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { InputField } from '@/shared/components/InputField';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { resetPassword } from '@/features/auth/services/authService';
import { getFirebaseErrorMessage } from '@/shared/utils/errorMessages';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/authSchemas';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ILLUSTRATION_SIZE = 100;
const ICON_SIZE = 48;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <HeaderMobile
        title="Recuperar Contraseña"
        leftSlot="back"
        onLeftPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {emailSent ? (
            /* Estado: Email enviado */
            <View style={styles.successContainer}>
              <View style={styles.successIllustration}>
                <CircleCheck size={ICON_SIZE} color={colors.success} strokeWidth={1.5} />
              </View>
              <Text style={styles.successTitle}>Revisa tu correo</Text>
              <Text style={styles.successText}>
                Si el correo está registrado, recibirás instrucciones para restablecer tu
                contraseña. Revisa también tu carpeta de spam.
              </Text>
              <ButtonPrimary
                title="VOLVER A INICIAR SESIÓN"
                onPress={() => navigation.navigate('Login')}
                style={styles.submitButton}
              />
            </View>
          ) : (
            /* Estado: Formulario */
            <>
              {/* Ilustración — C04: circle 100px, key icon */}
              <View style={styles.illustrationContainer}>
                <View style={styles.illustration}>
                  <KeyRound size={ICON_SIZE} color={colors.primary} strokeWidth={1.5} />
                </View>
              </View>

              {/* Texto instructivo — C04: centered, textSecondary */}
              <Text style={styles.instructionText}>
                Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
              </Text>

              {/* Formulario — C04: email field */}
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
              </View>

              {/* Botón — C04: ENVIAR INSTRUCCIONES */}
              <ButtonPrimary
                title="ENVIAR INSTRUCCIONES"
                icon={Send}
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submitButton}
              />

              {/* Volver — C04: back link */}
              <TouchableOpacity
                style={styles.backLink}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft size={16} color={colors.textSecondary} />
                <Text style={styles.backLinkText}>Volver a inicio de sesión</Text>
              </TouchableOpacity>
            </>
          )}
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
  // Ilustración — C04: circle 100px, primaryLight background, primary border
  illustrationContainer: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    borderRadius: ILLUSTRATION_SIZE / 2,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto instructivo — C04: centered, line-height 24
  instructionText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  // Form — C04: margin-top spacing-xl
  formSection: {
    marginTop: spacing.xl,
  },
  // Botón — C04: margin-top spacing-lg
  submitButton: {
    marginTop: spacing.lg,
  },
  // Back link — C04: row, centered, margin-top spacing-lg
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  backLinkText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  // Estado de éxito
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing['2xl'],
  },
  successIllustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    borderRadius: ILLUSTRATION_SIZE / 2,
    backgroundColor: '#E8F5E9',
    borderWidth: 3,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  successText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
