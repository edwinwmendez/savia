import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ClipboardList, Map, Bell, User } from 'lucide-react-native';
import { CitizenHomeScreen } from '@/features/home/screens/CitizenHomeScreen';
import { CitizenAlertsScreen } from '@/features/home/screens/CitizenAlertsScreen';
import { CitizenMapScreen } from '@/features/home/screens/CitizenMapScreen';
import { CitizenNotificationsScreen } from '@/features/home/screens/CitizenNotificationsScreen';
import { CitizenProfileScreen } from '@/features/home/screens/CitizenProfileScreen';
import { useNotificationsStore } from '@/features/notifications/store/notificationsStore';
import { subscribeToUnreadCount } from '@/features/notifications/services/notificationQueryService';
import { useAuthStore } from '@/shared/store/authStore';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import { shadows } from '@/shared/theme/shadows';
import type { CitizenTabParamList } from './types';

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenTabNavigator() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount);

  // Suscripción global al conteo de no leídas para el badge
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUnreadCount(
      user.uid,
      (count) => setUnreadCount(count),
      (error) => console.error('[TabNav] Error conteo notificaciones:', error),
    );

    return unsubscribe;
  }, [user?.uid]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: fontSize.caption,
          fontFamily: fontFamily.medium,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          ...shadows.nav,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CitizenHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={CitizenAlertsScreen}
        options={{
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={CitizenMapScreen}
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={CitizenNotificationsScreen}
        options={{
          tabBarLabel: 'Notif.',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            fontSize: 10,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CitizenProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
