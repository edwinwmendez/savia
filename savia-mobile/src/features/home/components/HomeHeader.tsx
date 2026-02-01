import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ShieldCheck, Bell } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, iconSize } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';
import { APP_NAME } from '@/shared/config/constants';

interface HomeHeaderProps {
  initials: string;
  notificationCount?: number;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
}

export function HomeHeader({
  initials,
  notificationCount = 0,
  onPressBell,
  onPressAvatar,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <ShieldCheck size={32} color={colors.primary} />
        <Text style={styles.title}>{APP_NAME}</Text>
      </View>
      <View style={styles.right}>
        <Pressable onPress={onPressBell} style={styles.bellContainer}>
          <Bell size={iconSize.lg} color={colors.textPrimary} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>
        <Pressable onPress={onPressAvatar} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bellContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
