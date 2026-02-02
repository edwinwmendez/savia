import { useEffect } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/shared/store/authStore';
import { addNotificationResponseListener } from '@/features/notifications/services/notificationPushService';
import { SelectAlertTypeScreen } from '@/features/alerts/screens/SelectAlertTypeScreen';
import { DescribeAlertScreen } from '@/features/alerts/screens/DescribeAlertScreen';
import { LocateAlertScreen } from '@/features/alerts/screens/LocateAlertScreen';
import { ConfirmAlertScreen } from '@/features/alerts/screens/ConfirmAlertScreen';
import { AlertSuccessScreen } from '@/features/alerts/screens/AlertSuccessScreen';
import { CitizenAlertDetailScreen } from '@/features/home/screens/CitizenAlertDetailScreen';
import { RateAlertScreen } from '@/features/rating/screens/RateAlertScreen';
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

  // Deep linking: al tocar una notificación, navegar al detalle
  const navigation = useNavigation();
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data as Record<string, string> | undefined;
      const alertId = data?.alertId;
      if (!alertId) return;

      console.log('[Navigation] Notificación tocada, navegando a alerta:', alertId);
      try {
        if (userData?.role === 'agent') {
          (navigation as any).navigate('AgentAlertDetail', { alertId });
        } else {
          (navigation as any).navigate('AlertDetail', { alertId });
        }
      } catch (err) {
        console.warn('[Navigation] Error navegando desde notificación:', err);
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, userData?.role, navigation]);

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
      <Stack.Screen name="RateAlert" component={RateAlertScreen} />
    </Stack.Navigator>
  );
}
