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

// ProjectId de EAS (fallback hardcodeado para builds donde Constants no lo expone)
const EAS_PROJECT_ID = '6121b7e4-960c-41ea-83fc-57f06186367f';

// Solicita permisos, obtiene Expo Push Token y lo guarda en Firestore
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  console.log('[Push] ========== INICIO REGISTRO PUSH ==========');
  console.log('[Push] userId:', userId);
  console.log('[Push] Device.isDevice:', Device.isDevice);
  console.log('[Push] Device.modelName:', Device.modelName);
  console.log('[Push] Platform.OS:', Platform.OS);

  if (!Device.isDevice) {
    console.warn('[Push] ❌ FALLA: No es dispositivo físico (emulador/simulador)');
    console.log('[Push] ========== FIN REGISTRO PUSH (NO DEVICE) ==========');
    return null;
  }

  // Intentar obtener projectId de Constants, con fallback hardcodeado
  console.log('[Push] Constants.expoConfig:', JSON.stringify(Constants.expoConfig, null, 2));

  let projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    (Constants as Record<string, unknown>)?.easConfig?.projectId;

  console.log('[Push] projectId desde Constants:', projectId);

  // FALLBACK: Si no se encuentra en Constants, usar el hardcodeado
  if (!projectId) {
    console.warn('[Push] ⚠️ projectId no encontrado en Constants, usando fallback hardcodeado');
    projectId = EAS_PROJECT_ID;
  }

  console.log('[Push] projectId final a usar:', projectId);

  try {
    // Verificar permisos existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('[Push] Permisos existentes:', existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('[Push] Solicitando permisos al usuario...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[Push] Respuesta del usuario a permisos:', finalStatus);
    }

    if (finalStatus !== 'granted') {
      console.warn('[Push] ❌ FALLA: Permisos de notificaciones DENEGADOS por el usuario');
      console.log('[Push] ========== FIN REGISTRO PUSH (PERMISOS DENEGADOS) ==========');
      return null;
    }

    console.log('[Push] ✅ Permisos concedidos');

    // Configurar canal Android
    await setupAndroidChannel();

    // Obtener token de Expo
    console.log('[Push] Solicitando Expo Push Token con projectId:', projectId);
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId as string,
    });
    const token = tokenData.data;
    console.log('[Push] ✅ Token generado:', token);

    // Guardar en Firestore
    console.log('[Push] Guardando token en Firestore para usuario:', userId);
    await updateDoc(doc(db, 'users', userId), {
      expoPushToken: token,
    });
    console.log('[Push] ✅ Token guardado exitosamente en Firestore');
    console.log('[Push] ========== FIN REGISTRO PUSH (ÉXITO) ==========');

    return token;
  } catch (error) {
    console.error('[Push] ❌ ERROR en registro:', error);
    console.error('[Push] Error stack:', (error as Error).stack);
    console.log('[Push] ========== FIN REGISTRO PUSH (ERROR) ==========');
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
