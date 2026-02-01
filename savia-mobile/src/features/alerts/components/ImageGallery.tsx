import { useState } from 'react';
import {
  View,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, radius } from '@/shared/theme/spacing';

interface ImageGalleryProps {
  imageUrls: string[];
}

const THUMBNAIL_SIZE = 80;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ImageGallery({ imageUrls }: ImageGalleryProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Grid de thumbnails */}
      <View style={styles.grid}>
        {imageUrls.map((url, index) => (
          <Pressable
            key={`${url}-${index}`}
            onPress={() => setSelectedUrl(url)}
            style={({ pressed }) => [styles.thumbnailWrapper, pressed && styles.pressed]}
          >
            <Image source={{ uri: url }} style={styles.thumbnail} />
          </Pressable>
        ))}
      </View>

      {/* Modal fullscreen */}
      <Modal
        visible={selectedUrl !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedUrl(null)}
      >
        <View style={styles.modalContainer}>
          {/* Botón cerrar */}
          <Pressable
            onPress={() => setSelectedUrl(null)}
            style={styles.closeButton}
          >
            <X size={28} color={colors.surface} />
          </Pressable>

          {/* Imagen ampliada */}
          {isLoading && (
            <ActivityIndicator
              size="large"
              color={colors.surface}
              style={styles.loader}
            />
          )}
          {selectedUrl && (
            <Image
              source={{ uri: selectedUrl }}
              style={styles.fullImage}
              resizeMode="contain"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: spacing.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
