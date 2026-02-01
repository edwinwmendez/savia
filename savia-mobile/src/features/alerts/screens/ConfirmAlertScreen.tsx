import { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircleAlert } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { EvidenceSection } from '@/features/alerts/components/EvidenceSection';
import { AlertSummaryCard } from '@/features/alerts/components/AlertSummaryCard';
import { WarningBanner } from '@/features/alerts/components/WarningBanner';
import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import { createAlert } from '@/features/alerts/services/alertService';
import { uploadImage } from '@/features/alerts/services/imageService';
import { pickImageFromCamera, pickImageFromGallery } from '@/features/alerts/services/imageService';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import type { CitizenStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

export function ConfirmAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedCategory = useCreateAlertStore((s) => s.selectedCategory);
  const description = useCreateAlertStore((s) => s.description);
  const urgency = useCreateAlertStore((s) => s.urgency);
  const location = useCreateAlertStore((s) => s.location);
  const address = useCreateAlertStore((s) => s.address);
  const imageUris = useCreateAlertStore((s) => s.imageUris);
  const addImage = useCreateAlertStore((s) => s.addImage);
  const removeImage = useCreateAlertStore((s) => s.removeImage);
  const reset = useCreateAlertStore((s) => s.reset);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddCamera = async () => {
    const uri = await pickImageFromCamera();
    if (uri) addImage(uri);
  };

  const handleAddGallery = async () => {
    const uri = await pickImageFromGallery();
    if (uri) addImage(uri);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !urgency || !location) return;

    setIsSubmitting(true);
    try {
      // Crear alerta primero para obtener ID
      const result = await createAlert({
        type: selectedCategory.id,
        categoryName: selectedCategory.name,
        description,
        urgency,
        location,
        address,
        imageUrls: [],
      });

      // Subir imágenes si hay
      if (imageUris.length > 0) {
        console.log('[Alerts] Subiendo', imageUris.length, 'imágenes...');
        const uploadPromises = imageUris.map((uri, index) =>
          uploadImage(uri, result.alertId, index),
        );
        await Promise.all(uploadPromises);
      }

      console.log('[Alerts] Alerta enviada exitosamente:', result.alertCode);
      navigation.navigate('AlertSuccess', { alertCode: result.alertCode });
    } catch (error) {
      console.error('[Alerts] Error al enviar alerta:', error);
      Alert.alert(
        'Error',
        'No se pudo enviar la alerta. Por favor intenta de nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedCategory || !urgency || !location) {
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
      <ProgressBar currentStep={4} totalSteps={4} fillColor={colors.success} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <EvidenceSection
            imageUris={imageUris}
            onAddCamera={handleAddCamera}
            onAddGallery={handleAddGallery}
            onRemove={removeImage}
          />
        </View>

        <View style={styles.section}>
          <AlertSummaryCard
            category={selectedCategory}
            urgency={urgency}
            address={address}
            description={description}
          />
        </View>

        <WarningBanner message="Al enviar esta alerta, las autoridades de tu zona serán notificadas inmediatamente." />
      </ScrollView>

      <View style={styles.bottomSection}>
        <ButtonPrimary
          title="ENVIAR ALERTA"
          icon={CircleAlert}
          onPress={handleSubmit}
          loading={isSubmitting}
          color={colors.error}
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: spacing.lg,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
});
