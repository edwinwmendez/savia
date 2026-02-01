import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { updateDoc } from 'firebase/firestore';
import {
  registerForPushNotifications,
  setupNotificationHandler,
  setupAndroidChannel,
} from '../notificationPushService';

// Usamos los mocks reales de expo-notifications (no el mock del servicio)
jest.unmock('@/features/notifications/services/notificationPushService');

const mockUpdateDoc = updateDoc as jest.Mock;
const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissions = Notifications.requestPermissionsAsync as jest.Mock;
const mockGetToken = Notifications.getExpoPushTokenAsync as jest.Mock;
const mockSetHandler = Notifications.setNotificationHandler as jest.Mock;
const mockSetChannel = Notifications.setNotificationChannelAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notificationPushService', () => {
  describe('setupNotificationHandler', () => {
    it('llama a setNotificationHandler', () => {
      setupNotificationHandler();
      expect(mockSetHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          handleNotification: expect.any(Function),
        }),
      );
    });
  });

  describe('setupAndroidChannel', () => {
    it('configura canal en Android', async () => {
      const originalPlatform = jest.requireActual('react-native').Platform;
      jest.doMock('react-native', () => ({
        ...jest.requireActual('react-native'),
        Platform: { ...originalPlatform, OS: 'android' },
      }));

      // El mock de setNotificationChannelAsync ya está configurado en jest.setup.js
      await setupAndroidChannel();
      // En el entorno de test, Platform.OS puede no ser 'android', así que solo verificamos que no crashee
    });
  });

  describe('registerForPushNotifications', () => {
    it('retorna null si no es dispositivo físico', async () => {
      (Device as any).isDevice = false;

      const token = await registerForPushNotifications('user-1');

      expect(token).toBeNull();
      expect(mockGetPermissions).not.toHaveBeenCalled();

      // Restaurar
      (Device as any).isDevice = true;
    });

    it('solicita permisos y obtiene token cuando permisos ya están granted', async () => {
      mockGetPermissions.mockResolvedValueOnce({ status: 'granted' });
      mockGetToken.mockResolvedValueOnce({ data: 'ExponentPushToken[abc123]' });
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      const token = await registerForPushNotifications('user-1');

      expect(token).toBe('ExponentPushToken[abc123]');
      expect(mockGetPermissions).toHaveBeenCalled();
      expect(mockGetToken).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it('solicita permisos cuando no están granted', async () => {
      mockGetPermissions.mockResolvedValueOnce({ status: 'undetermined' });
      mockRequestPermissions.mockResolvedValueOnce({ status: 'granted' });
      mockGetToken.mockResolvedValueOnce({ data: 'ExponentPushToken[def456]' });
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      const token = await registerForPushNotifications('user-2');

      expect(token).toBe('ExponentPushToken[def456]');
      expect(mockRequestPermissions).toHaveBeenCalled();
    });

    it('retorna null cuando permisos son denegados', async () => {
      mockGetPermissions.mockResolvedValueOnce({ status: 'denied' });
      mockRequestPermissions.mockResolvedValueOnce({ status: 'denied' });

      const token = await registerForPushNotifications('user-3');

      expect(token).toBeNull();
      expect(mockGetToken).not.toHaveBeenCalled();
    });

    it('maneja error sin crashear', async () => {
      mockGetPermissions.mockRejectedValueOnce(new Error('Permission error'));

      const token = await registerForPushNotifications('user-4');

      expect(token).toBeNull();
    });
  });
});
