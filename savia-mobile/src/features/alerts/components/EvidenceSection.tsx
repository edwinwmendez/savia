import { View, Text, Alert, StyleSheet } from 'react-native';
import { ImageUploadSlot } from './ImageUploadSlot';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import { VALIDATION } from '@/shared/config/constants';

interface EvidenceSectionProps {
  imageUris: string[];
  onAddCamera: () => void;
  onAddGallery: () => void;
  onRemove: (index: number) => void;
}

export function EvidenceSection({ imageUris, onAddCamera, onAddGallery, onRemove }: EvidenceSectionProps) {
  const maxImages = VALIDATION.MAX_ALERT_IMAGES;

  const handleAddPress = () => {
    Alert.alert(
      'Agregar evidencia',
      'Selecciona una opción',
      [
        { text: 'Tomar foto', onPress: onAddCamera },
        { text: 'Elegir de galería', onPress: onAddGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  const slots = [];
  for (let i = 0; i < maxImages; i++) {
    if (i < imageUris.length) {
      slots.push(
        <ImageUploadSlot
          key={i}
          type="image"
          uri={imageUris[i]}
          onRemove={() => onRemove(i)}
        />,
      );
    } else if (i === imageUris.length) {
      slots.push(
        <ImageUploadSlot key={i} type="camera" onPress={handleAddPress} />,
      );
    } else {
      slots.push(
        <ImageUploadSlot key={i} type="empty" onPress={handleAddPress} />,
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adjuntar evidencia (opcional)</Text>
      <View style={styles.slotsRow}>{slots}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
