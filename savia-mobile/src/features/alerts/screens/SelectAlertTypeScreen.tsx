import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { AlertTypeCard } from '@/features/alerts/components/AlertTypeCard';
import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';

export function SelectAlertTypeScreen() {
  const navigation = useNavigation();
  const selectedCategory = useCreateAlertStore((s) => s.selectedCategory);
  const setCategory = useCreateAlertStore((s) => s.setCategory);
  const reset = useCreateAlertStore((s) => s.reset);

  const handleClose = () => {
    reset();
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedCategory) return;
    console.log('[Alerts] Categoría seleccionada:', selectedCategory.name);
    // Paso 2 se implementará en feature/s2-alerta-descripcion
    Alert.alert(
      'Categoría seleccionada',
      `${selectedCategory.name}\n\nEl siguiente paso se implementará en la próxima feature.`,
    );
  };

  // Dividir categorías en 2 columnas (impares izquierda, pares derecha)
  const col1 = ALERT_CATEGORIES.filter((_, i) => i % 2 === 0);
  const col2 = ALERT_CATEGORIES.filter((_, i) => i % 2 === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMobile
        title="Nueva Alerta"
        leftSlot="close"
        onLeftPress={handleClose}
      />
      <ProgressBar currentStep={1} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>
          ¿Qué tipo de emergencia quieres reportar?
        </Text>

        <View style={styles.grid}>
          <View style={styles.column}>
            {col1.map((category) => (
              <AlertTypeCard
                key={category.id}
                category={category}
                selected={selectedCategory?.id === category.id}
                onPress={() => setCategory(category)}
              />
            ))}
          </View>
          <View style={styles.column}>
            {col2.map((category) => (
              <AlertTypeCard
                key={category.id}
                category={category}
                selected={selectedCategory?.id === category.id}
                onPress={() => setCategory(category)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <ButtonPrimary
          title="SIGUIENTE"
          icon={ArrowRight}
          onPress={handleNext}
          disabled={!selectedCategory}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  question: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    lineHeight: fontSize.h3 * 1.4,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  column: {
    flex: 1,
    gap: spacing.md,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
