import { useEffect } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/store/authStore';
import { SelectAlertTypeScreen } from '@/features/alerts/screens/SelectAlertTypeScreen';
import { AuthNavigator } from './AuthNavigator';
import { CitizenTabNavigator } from './CitizenTabNavigator';
import { AgentTabNavigator } from './AgentTabNavigator';
import type { CitizenStackParamList } from './types';

const Stack = createNativeStackNavigator<CitizenStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const userData = useAuthStore((s) => s.userData);
  const inactiveAccountError = useAuthStore((s) => s.inactiveAccountError);

  useEffect(() => {
    if (inactiveAccountError) {
      Alert.alert('Cuenta desactivada', inactiveAccountError);
    }
  }, [inactiveAccountError]);

  if (isLoading || !isAuthenticated) {
    return <AuthNavigator />;
  }

  if (userData?.role === 'agent') {
    return <AgentTabNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CitizenTabs" component={CitizenTabNavigator} />
      <Stack.Screen name="SelectAlertType" component={SelectAlertTypeScreen} />
    </Stack.Navigator>
  );
}
