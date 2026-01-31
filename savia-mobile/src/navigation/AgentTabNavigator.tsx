import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, Clock, User } from 'lucide-react-native';
import { AgentHomeScreen } from '@/features/agent/screens/AgentHomeScreen';
import { AgentAlertsScreen } from '@/features/agent/screens/AgentAlertsScreen';
import { AgentHistoryScreen } from '@/features/agent/screens/AgentHistoryScreen';
import { AgentProfileScreen } from '@/features/agent/screens/AgentProfileScreen';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily } from '@/shared/theme/typography';
import type { AgentTabParamList } from './types';

const Tab = createBottomTabNavigator<AgentTabParamList>();

export function AgentTabNavigator() {
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={AgentHomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AgentAlertsScreen}
        options={{
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={AgentHistoryScreen}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AgentProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
