import { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { CategoryChip } from '@/features/alerts/components/CategoryChip';
import { TextAreaField } from '@/features/alerts/components/TextAreaField';
import { UrgencySelector } from '@/features/alerts/components/UrgencySelector';
import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import { describeAlertSchema } from '@/features/alerts/schemas/alertSchemas';
import { VALIDATION } from '@/shared/config/constants';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';
import type { UrgencyLevel } from '@/shared/types/alert';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

export function DescribeAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedCategory = useCreateAlertStore((s) => s.selectedCategory);
  const storeDescription = useCreateAlertStore((s) => s.description);
  const storeUrgency = useCreateAlertStore((s) => s.urgency);
  const setDescription = useCreateAlertStore((s) => s.setDescription);
  const setUrgency = useCreateAlertStore((s) => s.setUrgency);
  const reset = useCreateAlertStore((s) => s.reset);

  const [description, setLocalDescription] = useState(storeDescription);
  const [urgency, setLocalUrgency] = useState<UrgencyLevel | null>(storeUrgency);
  const [descriptionError, setDescriptionError] = useState('');

  const handleCancel = () => {
    Alert.alert(
      'Cancelar alerta',
      '¿Estás seguro de que deseas cancelar? Se perderá el progreso.',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => {
            reset();
            navigation.popToTop();
          },
        },
      ],
    );
  };

  const handleNext = () => {
    setDescriptionError('');

    const result = describeAlertSchema.safeParse({ description, urgency });

    if (!result.success) {
      const issues = result.error.issues;
      const descIssue = issues.find((i) => i.path[0] === 'description');
      const urgIssue = issues.find((i) => i.path[0] === 'urgency');

      if (descIssue) {
        setDescriptionError(descIssue.message);
      }
      if (urgIssue) {
        Alert.alert('Urgencia requerida', urgIssue.message);
      }
      return;
    }

    setDescription(description);
    setUrgency(urgency!);
    console.log('[Alerts] Descripción y urgencia guardados');
    navigation.navigate('LocateAlert');
  };

  const isValid = description.trim().length >= 10 && urgency !== null;

  if (!selectedCategory) {
    navigation.goBack();
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMobile
        title="Nueva Alerta"
        leftSlot="back"
        onLeftPress={() => navigation.goBack()}
        rightText="Cancelar"
        onRightTextPress={handleCancel}
      />
      <ProgressBar currentStep={2} totalSteps={4} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipo de incidente</Text>
            <CategoryChip category={selectedCategory} onEdit={() => navigation.goBack()} />
          </View>

          <View style={styles.section}>
            <TextAreaField
              label="Describe la situación"
              value={description}
              onChangeText={(text) => {
                setLocalDescription(text);
                if (descriptionError) setDescriptionError('');
              }}
              placeholder="Describe brevemente qué está sucediendo (ej: dos sujetos en moto)..."
              maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
              error={descriptionError}
            />
          </View>

          <View style={styles.section}>
            <UrgencySelector
              selectedLevel={urgency}
              onSelect={setLocalUrgency}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <ButtonPrimary
            title="SIGUIENTE"
            icon={ArrowRight}
            onPress={handleNext}
            disabled={!isValid}
          />
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
