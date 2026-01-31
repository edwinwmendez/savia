import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft, X, type LucideIcon } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize, componentHeight } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';

type LeftSlot = 'back' | 'close' | 'none';

interface HeaderMobileProps {
  title: string;
  leftSlot?: LeftSlot;
  onLeftPress?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
}

export function HeaderMobile({
  title,
  leftSlot = 'back',
  onLeftPress,
  rightIcon: RightIcon,
  onRightPress,
}: HeaderMobileProps) {
  const LeftIcon = leftSlot === 'back' ? ArrowLeft : leftSlot === 'close' ? X : null;

  return (
    <View style={styles.container}>
      <View style={styles.slot}>
        {LeftIcon && (
          <Pressable onPress={onLeftPress} hitSlop={8}>
            <LeftIcon size={iconSize.lg} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.slot}>
        {RightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={8}>
            <RightIcon size={iconSize.lg} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: componentHeight.header,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  slot: {
    width: iconSize.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.h4,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  spacer: {
    width: iconSize.lg,
  },
});
