import { onSnapshot, updateDoc, getDocs, writeBatch } from 'firebase/firestore';
import {
  subscribeToNotifications,
  subscribeToUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../notificationQueryService';

const mockOnSnapshot = onSnapshot as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;
const mockWriteBatch = writeBatch as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notificationQueryService', () => {
  describe('subscribeToNotifications', () => {
    it('llama onSnapshot y retorna unsubscribe', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToNotifications('user-1', onData, onError);

      expect(mockOnSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });

    it('mapea documentos correctamente en el callback', () => {
      mockOnSnapshot.mockImplementation((_query, onSuccess) => {
        onSuccess({
          docs: [
            {
              id: 'notif-1',
              data: () => ({
                userId: 'user-1',
                type: 'status_change',
                title: 'Test',
                body: 'Body',
                alertId: 'alert-1',
                read: false,
              }),
            },
          ],
        });
        return jest.fn();
      });

      const onData = jest.fn();
      subscribeToNotifications('user-1', onData, jest.fn());

      expect(onData).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'notif-1',
          type: 'status_change',
          read: false,
        }),
      ]);
    });
  });

  describe('subscribeToUnreadCount', () => {
    it('retorna el tamaño del snapshot como conteo', () => {
      mockOnSnapshot.mockImplementation((_query, onSuccess) => {
        onSuccess({ size: 3 });
        return jest.fn();
      });

      const onCount = jest.fn();
      subscribeToUnreadCount('user-1', onCount, jest.fn());

      expect(onCount).toHaveBeenCalledWith(3);
    });
  });

  describe('markAsRead', () => {
    it('actualiza el documento con read=true', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);

      await markAsRead('notif-1');

      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('usa batch para actualizar múltiples documentos', async () => {
      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn(() => Promise.resolve()),
      };
      mockWriteBatch.mockReturnValue(mockBatch);
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          { ref: { id: 'notif-1' } },
          { ref: { id: 'notif-2' } },
        ],
      });

      await markAllAsRead('user-1');

      expect(mockBatch.update).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('no hace nada si no hay documentos', async () => {
      mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

      await markAllAsRead('user-1');

      expect(mockWriteBatch).not.toHaveBeenCalled();
    });
  });
});
