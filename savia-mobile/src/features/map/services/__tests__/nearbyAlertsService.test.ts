import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { subscribeToActiveAlerts } from '../nearbyAlertsService';

describe('nearbyAlertsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribeToActiveAlerts', () => {
    it('crea query con status activos y orderBy createdAt desc', () => {
      const onData = jest.fn();
      const onError = jest.fn();

      subscribeToActiveAlerts(onData, onError);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'alerts');
      expect(where).toHaveBeenCalledWith(
        'status',
        'in',
        ['pending', 'assigned', 'in_progress'],
      );
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(query).toHaveBeenCalled();
    });

    it('llama a onSnapshot con la query', () => {
      const onData = jest.fn();
      const onError = jest.fn();

      subscribeToActiveAlerts(onData, onError);

      expect(onSnapshot).toHaveBeenCalledWith(
        undefined, // query retorna undefined en el mock
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('retorna función de unsubscribe', () => {
      const unsubscribe = jest.fn();
      (onSnapshot as jest.Mock).mockReturnValueOnce(unsubscribe);

      const result = subscribeToActiveAlerts(jest.fn(), jest.fn());

      expect(result).toBe(unsubscribe);
    });
  });
});
