import { onSnapshot, collection, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import {
  subscribeToCitizenAlerts,
  subscribeToPendingAlerts,
  subscribeToMyCases,
  subscribeToAgentHistory,
  subscribeToAlertDetail,
  getUserById,
  takeAlert,
  updateAlertStatus,
} from '@/features/alerts/services/alertQueryService';

jest.mock('firebase/firestore');
jest.mock('firebase/functions');

const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockHttpsCallable = httpsCallable as jest.MockedFunction<typeof httpsCallable>;

describe('alertQueryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribeToCitizenAlerts', () => {
    it('crea un listener con onSnapshot y retorna unsubscribe', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToCitizenAlerts('user-1', onData, onError);

      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToPendingAlerts', () => {
    it('crea un listener para alertas pendientes', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToPendingAlerts(onData, onError);

      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToMyCases', () => {
    it('crea un listener para los casos del agente', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToMyCases('agent-1', onData, onError);

      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToAgentHistory', () => {
    it('crea un listener para el historial del agente', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToAgentHistory('agent-1', onData, onError);

      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToAlertDetail', () => {
    it('crea un listener para un documento de alerta', () => {
      const mockUnsubscribe = jest.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const onData = jest.fn();
      const onError = jest.fn();
      const unsub = subscribeToAlertDetail('alert-1', onData, onError);

      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });
  });

  describe('getUserById', () => {
    it('retorna datos del usuario cuando existe', async () => {
      const mockUserData = { firstName: 'Juan', lastName: 'Perez' };
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      } as any);

      const result = await getUserById('user-1');
      expect(result).toEqual(mockUserData);
    });

    it('retorna null cuando el usuario no existe', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      } as any);

      const result = await getUserById('user-nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('takeAlert', () => {
    it('llama a la Cloud Function correctamente', async () => {
      const mockCallable = jest.fn().mockResolvedValue({ data: { success: true } });
      mockHttpsCallable.mockReturnValue(mockCallable);

      const result = await takeAlert('alert-1');
      expect(mockHttpsCallable).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateAlertStatus', () => {
    it('llama a la Cloud Function con los parametros correctos', async () => {
      const mockCallable = jest.fn().mockResolvedValue({ data: { success: true } });
      mockHttpsCallable.mockReturnValue(mockCallable);

      const result = await updateAlertStatus('alert-1', 'in_progress', 'Nota test');
      expect(mockHttpsCallable).toHaveBeenCalled();
      expect(mockCallable).toHaveBeenCalledWith({
        alertId: 'alert-1',
        newStatus: 'in_progress',
        note: 'Nota test',
      });
      expect(result).toEqual({ success: true });
    });
  });
});
