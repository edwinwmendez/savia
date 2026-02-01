import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ClipboardList, Map, Bell, User } from 'lucide-react-native';
import { CitizenHomeScreen } from '@/features/home/screens/CitizenHomeScreen';
import { CitizenAlertsScreen } from '@/features/home/screens/CitizenAlertsScreen';
import { CitizenMapScreen } from '@/features/home/screens/CitizenMapScreen';
import { CitizenNotificationsScreen } from '@/features/home/screens/CitizenNotificationsScreen';
import { CitizenProfileScreen } from '@/features/home/screens/CitizenProfileScreen';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import { shadows } from '@/shared/theme/shadows';
import type { CitizenTabParamList } from './types';

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenTabNavigator() {
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
