import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Star } from 'lucide-react-native';
import { submitRating } from '@/features/rating/services/ratingService';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;
type RouteProps = RouteProp<CitizenStackParamList, 'RateAlert'>;

const RATING_LABELS = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];
const STAR_SIZE = 48;
const MAX_COMMENT_LENGTH = 300;

export function RateAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alertId, alertCode, agentName, agentId } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Selecciona una calificacion', 'Por favor selecciona al menos una estrella.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRating(alertId, rating, comment.trim() || undefined, agentId);
      Alert.alert(
        'Gracias',
        'Tu calificacion fue enviada exitosamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error('[RateAlert] Error:', error);
      Alert.alert('Error', 'No se pudo enviar la calificacion. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Calificar Atencion</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Alert Reference */}
          <View style={styles.referenceCard}>
            {alertCode && (
              <Text style={styles.referenceCode}>Alerta #{alertCode}</Text>
            )}
            {agentName && (
              <Text style={styles.referenceAgent}>
                Atendida por: {agentName}
              </Text>
            )}
          </View>

          {/* Stars */}
          <Text style={styles.starsLabel}>
            Como calificarias la atencion recibida?
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                hitSlop={4}
              >
                <Star
                  size={STAR_SIZE}
                  color={star <= rating ? '#FFC107' : '#E0E0E0'}
                  fill={star <= rating ? '#FFC107' : 'transparent'}
                />
              </Pressable>
            ))}
          </View>

          {/* Dynamic Label */}
          {rating > 0 && (
            <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>
          )}

          {/* Comment */}
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>
              Comentario (opcional)
            </Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Cuentanos mas sobre tu experiencia..."
              placeholderTextColor={colors.textSecondary}
              value={comment}
              onChangeText={(text) => setComment(text.slice(0, MAX_COMMENT_LENGTH))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {comment.length}/{MAX_COMMENT_LENGTH}
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              rating === 0 && styles.submitBtnDisabled,
              pressed && rating > 0 && styles.submitBtnPressed,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text style={styles.submitBtnText}>ENVIAR CALIFICACION</Text>
            )}
          </Pressable>

          {/* Skip Link */}
          <Pressable onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Omitir</Text>
          </Pressable>
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

  // Header
  header: {
    height: 56,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // Content
  content: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },

  // Reference
  referenceCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  referenceCode: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  referenceAgent: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },

  // Stars
  starsLabel: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingLabel: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: '#FFC107',
    marginTop: -spacing.sm,
  },

  // Comment
  commentContainer: {
    width: '100%',
  },
  commentLabel: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  commentInput: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  charCount: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },

  // Submit
  submitBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.success,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },

  // Skip
  skipBtn: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
