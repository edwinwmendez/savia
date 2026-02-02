import { Alert, Linking, Platform } from 'react-native';

interface NavigationOption {
  label: string;
  url: string;
  check?: string;
}

/**
 * Abre una app de navegación para dirigirse a las coordenadas dadas.
 * Muestra un ActionSheet con las apps disponibles (Google Maps, Waze)
 * y un fallback al navegador si ninguna está instalada.
 */
export async function openNavigation(
  latitude: number,
  longitude: number,
): Promise<void> {
  const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const options: NavigationOption[] = Platform.select({
    ios: [
      {
        label: 'Google Maps',
        url: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
        check: 'comgooglemaps://',
      },
      {
        label: 'Waze',
        url: `waze://?ll=${latitude},${longitude}&navigate=yes`,
        check: 'waze://',
      },
      {
        label: 'Apple Maps',
        url: `maps:0,0?q=Alerta@${latitude},${longitude}`,
      },
    ],
    android: [
      {
        label: 'Google Maps',
        url: `google.navigation:q=${latitude},${longitude}`,
        check: 'google.navigation:',
      },
      {
        label: 'Waze',
        url: `waze://?ll=${latitude},${longitude}&navigate=yes`,
        check: 'waze://',
      },
    ],
    default: [],
  }) as NavigationOption[];

  // Verificar qué apps están instaladas
  const available: NavigationOption[] = [];
  for (const opt of options) {
    if (!opt.check) {
      available.push(opt);
      continue;
    }
    try {
      const canOpen = await Linking.canOpenURL(opt.check);
      if (canOpen) available.push(opt);
    } catch {
      // App no disponible, skip
    }
  }

  // Si no hay ninguna app, abrir fallback directamente
  if (available.length === 0) {
    Linking.openURL(fallbackUrl).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la navegación.');
    });
    return;
  }

  // Si solo hay una opción, abrirla directamente
  if (available.length === 1) {
    Linking.openURL(available[0].url).catch(() => {
      Linking.openURL(fallbackUrl).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la navegación.');
      });
    });
    return;
  }

  // Mostrar opciones
  const buttons = available.map((opt) => ({
    text: opt.label,
    onPress: () => {
      Linking.openURL(opt.url).catch(() => {
        Linking.openURL(fallbackUrl).catch(() => {
          Alert.alert('Error', 'No se pudo abrir la navegación.');
        });
      });
    },
  }));

  buttons.push({
    text: 'Abrir en navegador',
    onPress: () => {
      Linking.openURL(fallbackUrl).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la navegación.');
      });
    },
  });

  Alert.alert(
    'Abrir con',
    'Selecciona la app de navegación',
    [...buttons, { text: 'Cancelar', onPress: () => {} }],
  );
}
