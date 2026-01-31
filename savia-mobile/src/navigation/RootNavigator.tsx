import { useAuthStore } from '@/shared/store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CitizenTabNavigator } from './CitizenTabNavigator';

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Mientras carga, AuthNavigator muestra el SplashScreen
  if (isLoading || !isAuthenticated) {
    return <AuthNavigator />;
  }

  return <CitizenTabNavigator />;
}
