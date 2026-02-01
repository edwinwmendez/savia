import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bell, CheckCircle } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { formatRelativeTime } from '@/shared/utils/formatters';
import type { NotificationData, NotificationType } from '@/shared/types/notification';

interface NotificationItemProps {
  notification: NotificationData;
  onPress: () => void;
}

const ICON_CONFIG: Record<NotificationType, { Icon: typeof Bell; color: string }> = {
  new_alert: { Icon: Bell, color: colors.primary },
  status_change: { Icon: CheckCircle, color: colors.success },
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { Icon, color } = ICON_CONFIG[notification.type] ?? ICON_CONFIG.new_alert;

  const isUnread = !notification.read;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {/* Icono */}
      <View style={[styles.iconContainer, { backgroundColor: color + '1A' }]}>
        <Icon size={22} color={color} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={[styles.title, isUnread && styles.titleUnread]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={[styles.body, isUnread && styles.bodyUnread]} numberOfLines={2}>
          {notification.body}
        </Text>
        {notification.createdAt && (
          <Text style={styles.time}>
            {formatRelativeTime(notification.createdAt)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  titleUnread: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  body: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  bodyUnread: {
    color: colors.textPrimary,
  },
  time: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
