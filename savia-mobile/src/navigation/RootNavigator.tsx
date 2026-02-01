import { useEffect } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/store/authStore';
import { SelectAlertTypeScreen } from '@/features/alerts/screens/SelectAlertTypeScreen';
import { DescribeAlertScreen } from '@/features/alerts/screens/DescribeAlertScreen';
import { LocateAlertScreen } from '@/features/alerts/screens/LocateAlertScreen';
import { ConfirmAlertScreen } from '@/features/alerts/screens/ConfirmAlertScreen';
import { AlertSuccessScreen } from '@/features/alerts/screens/AlertSuccessScreen';
import { CitizenAlertDetailScreen } from '@/features/home/screens/CitizenAlertDetailScreen';
import { AuthNavigator } from './AuthNavigator';
import { CitizenTabNavigator } from './CitizenTabNavigator';
import { AgentStackNavigator } from './AgentStackNavigator';
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
    return <AgentStackNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CitizenTabs" component={CitizenTabNavigator} />
      <Stack.Screen name="SelectAlertType" component={SelectAlertTypeScreen} />
      <Stack.Screen name="DescribeAlert" component={DescribeAlertScreen} />
      <Stack.Screen name="LocateAlert" component={LocateAlertScreen} />
      <Stack.Screen name="ConfirmAlert" component={ConfirmAlertScreen} />
      <Stack.Screen name="AlertSuccess" component={AlertSuccessScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="AlertDetail" component={CitizenAlertDetailScreen} />
    </Stack.Navigator>
  );
}
