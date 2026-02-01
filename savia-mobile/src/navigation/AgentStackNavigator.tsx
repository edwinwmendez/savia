import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentTabNavigator } from './AgentTabNavigator';
import { AgentAlertDetailScreen } from '@/features/agent/screens/AgentAlertDetailScreen';
import { UpdateAlertStatusScreen } from '@/features/agent/screens/UpdateAlertStatusScreen';
import type { AgentStackParamList } from './types';

const Stack = createNativeStackNavigator<AgentStackParamList>();

export function AgentStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgentTabs" component={AgentTabNavigator} />
      <Stack.Screen name="AgentAlertDetail" component={AgentAlertDetailScreen} />
      <Stack.Screen name="UpdateAlertStatus" component={UpdateAlertStatusScreen} />
    </Stack.Navigator>
  );
}
