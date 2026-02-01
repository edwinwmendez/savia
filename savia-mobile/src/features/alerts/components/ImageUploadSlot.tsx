import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Camera, Plus, X } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { iconSize, radius, spacing } from '@/shared/theme/spacing';

type SlotType = 'image' | 'camera' | 'empty';

interface ImageUploadSlotProps {
  type: SlotType;
  uri?: string;
  onPress?: () => void;
  onRemove?: () => void;
}

export function ImageUploadSlot({ type, uri, onPress, onRemove }: ImageUploadSlotProps) {
  if (type === 'image' && uri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri }} style={styles.image} />
        {onRemove && (
          <Pressable style={styles.deleteButton} onPress={onRemove} hitSlop={4}>
            <X size={14} color={colors.surface} />
          </Pressable>
        )}
      </View>
    );
  }

  if (type === 'camera') {
    return (
      <Pressable style={[styles.container, styles.cameraSlot]} onPress={onPress}>
        <Camera size={iconSize.lg} color={colors.primary} />
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.container, styles.emptySlot]} onPress={onPress}>
      <Plus size={iconSize.lg} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraSlot: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: `${colors.primaryLight}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
