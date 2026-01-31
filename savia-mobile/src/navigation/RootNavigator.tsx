import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CitizenTabNavigator } from './CitizenTabNavigator';
import { AgentTabNavigator } from './AgentTabNavigator';

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

  // Mientras carga, AuthNavigator muestra el SplashScreen
  if (isLoading || !isAuthenticated) {
    return <AuthNavigator />;
  }

  if (userData?.role === 'agent') {
    return <AgentTabNavigator />;
  }

  return <CitizenTabNavigator />;
}
