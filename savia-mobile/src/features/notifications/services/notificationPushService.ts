import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';

// Configura cómo se muestran notificaciones con la app en foreground
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Crea canal de notificaciones para Android 8+
export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Alertas de Emergencia',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF0000',
      sound: 'default',
    });
    console.log('[Notifications] Canal Android "alerts" configurado');
  }
}

// Solicita permisos, obtiene Expo Push Token y lo guarda en Firestore
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[Notifications] Push notifications requieren dispositivo físico');
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    (Constants as Record<string, unknown>)?.easConfig?.projectId;

  if (!projectId) {
    console.warn('[Notifications] No se encontró projectId de EAS. Ejecuta: eas init');
    return null;
  }

  try {
    // Solicitar permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permisos de notificaciones denegados');
      return null;
    }

    // Configurar canal Android
    await setupAndroidChannel();

    // Obtener token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId as string,
    });
    const token = tokenData.data;
    console.log('[Notifications] Expo Push Token obtenido:', token.substring(0, 30) + '...');

    // Guardar en Firestore
    await updateDoc(doc(db, 'users', userId), {
      expoPushToken: token,
    });
    console.log('[Notifications] Token guardado en Firestore para usuario:', userId);

    return token;
  } catch (error) {
    console.error('[Notifications] Error registrando push notifications:', error);
    return null;
  }
}

// Limpia el token de push del usuario en Firestore (llamar al hacer logout)
export async function unregisterPushToken(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      expoPushToken: '',
    });
    console.log('[Notifications] Token eliminado de Firestore para usuario:', userId);
  } catch (error) {
    console.error('[Notifications] Error eliminando token:', error);
  }
}

// Wrappers para listeners
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void,
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void,
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
