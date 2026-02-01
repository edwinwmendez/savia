import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { shadows } from '@/shared/theme/shadows';

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  badgeCount?: number;
  badgeColor?: string;
  badgeBgColor?: string;
  onPress?: () => void;
}

export function QuickActionCard({
  title,
  icon: Icon,
  iconColor,
  badgeCount,
  badgeColor,
  badgeBgColor,
  onPress,
}: QuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Icon size={32} color={iconColor} />
        {badgeCount != null && badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadows.md,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: radius.lg,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
  },
  title: {
    fontSize: 15,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});
