import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { RootNavigator } from '@/navigation/RootNavigator';

Sentry.init({
  dsn: 'https://88a1d512ee010c7a514fdb6ba733d14e@o4510818741714944.ingest.us.sentry.io/4510818752790528',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

SplashScreen.preventAutoHideAsync().catch(() => {});

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Inicializar listener de autenticación
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  // Ocultar splash nativo cuando las fuentes estén listas
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
