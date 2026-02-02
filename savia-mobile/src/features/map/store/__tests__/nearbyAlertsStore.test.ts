import { useNearbyAlertsStore, type RadiusOption } from '../nearbyAlertsStore';
import type { AlertData, UrgencyLevel } from '@/shared/types/alert';
import { Timestamp } from 'firebase/firestore';

const now = Timestamp.now();

function makeAlert(overrides: Partial<AlertData> = {}): AlertData {
  return {
    id: 'alert-1',
    type: 'robbery',
    categoryName: 'Robo',
    description: 'Test',
    urgency: 'high',
    status: 'pending',
    location: { latitude: -10.7295, longitude: -73.7540 },
    address: 'Jr. Test 123',
    imageUrls: [],
    createdBy: 'user-1',
    assignedTo: null,
    assignedInstitution: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('nearbyAlertsStore', () => {
  beforeEach(() => {
    useNearbyAlertsStore.getState().reset();
  });

  describe('estado inicial', () => {
    it('tiene valores por defecto correctos', () => {
      const state = useNearbyAlertsStore.getState();
      expect(state.allAlerts).toEqual([]);
      expect(state.userLatitude).toBeNull();
      expect(state.userLongitude).toBeNull();
      expect(state.selectedRadius).toBe(1000);
      expect(state.selectedUrgencies).toEqual(['critical', 'high', 'medium', 'low']);
      expect(state.selectedCategories).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.locationError).toBeNull();
    });
  });

  describe('setAllAlerts', () => {
    it('actualiza la lista de alertas', () => {
      const alerts = [makeAlert()];
      useNearbyAlertsStore.getState().setAllAlerts(alerts);
      expect(useNearbyAlertsStore.getState().allAlerts).toEqual(alerts);
    });
  });

  describe('setUserLocation', () => {
    it('actualiza la ubicación del usuario', () => {
      useNearbyAlertsStore.getState().setUserLocation(-10.7291, -73.7538);
      const state = useNearbyAlertsStore.getState();
      expect(state.userLatitude).toBe(-10.7291);
      expect(state.userLongitude).toBe(-73.7538);
    });
  });

  describe('setSelectedRadius', () => {
    it('actualiza el radio seleccionado', () => {
      useNearbyAlertsStore.getState().setSelectedRadius(500);
      expect(useNearbyAlertsStore.getState().selectedRadius).toBe(500);
    });
  });

  describe('toggleUrgency', () => {
    it('deselecciona una urgencia activa', () => {
      useNearbyAlertsStore.getState().toggleUrgency('low');
      expect(useNearbyAlertsStore.getState().selectedUrgencies).not.toContain('low');
    });

    it('selecciona una urgencia desactivada', () => {
      useNearbyAlertsStore.getState().toggleUrgency('low'); // quitar
      useNearbyAlertsStore.getState().toggleUrgency('low'); // poner
      expect(useNearbyAlertsStore.getState().selectedUrgencies).toContain('low');
    });

    it('no permite deseleccionar la última urgencia', () => {
      // Deseleccionar 3 de 4
      useNearbyAlertsStore.getState().toggleUrgency('low');
      useNearbyAlertsStore.getState().toggleUrgency('medium');
      useNearbyAlertsStore.getState().toggleUrgency('high');
      // Intentar deseleccionar la última
      useNearbyAlertsStore.getState().toggleUrgency('critical');
      expect(useNearbyAlertsStore.getState().selectedUrgencies).toEqual(['critical']);
    });
  });

  describe('toggleCategory', () => {
    it('selecciona una categoría', () => {
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      expect(useNearbyAlertsStore.getState().selectedCategories).toContain('robbery');
    });

    it('deselecciona una categoría activa', () => {
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      expect(useNearbyAlertsStore.getState().selectedCategories).not.toContain('robbery');
    });

    it('permite deseleccionar todas las categorías (muestra todas)', () => {
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      expect(useNearbyAlertsStore.getState().selectedCategories).toEqual([]);
    });
  });

  describe('mapFilteredAlerts', () => {
    it('retorna todas las alertas cuando no hay filtros activos', () => {
      const alerts = [makeAlert({ id: '1' }), makeAlert({ id: '2' })];
      useNearbyAlertsStore.getState().setAllAlerts(alerts);
      expect(useNearbyAlertsStore.getState().mapFilteredAlerts()).toHaveLength(2);
    });

    it('filtra por urgencia', () => {
      const alerts = [
        makeAlert({ id: '1', urgency: 'critical' }),
        makeAlert({ id: '2', urgency: 'low' }),
      ];
      useNearbyAlertsStore.getState().setAllAlerts(alerts);
      useNearbyAlertsStore.getState().toggleUrgency('low');
      expect(useNearbyAlertsStore.getState().mapFilteredAlerts()).toHaveLength(1);
      expect(useNearbyAlertsStore.getState().mapFilteredAlerts()[0].id).toBe('1');
    });

    it('filtra por categoría', () => {
      const alerts = [
        makeAlert({ id: '1', type: 'robbery' }),
        makeAlert({ id: '2', type: 'fire' }),
      ];
      useNearbyAlertsStore.getState().setAllAlerts(alerts);
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      expect(useNearbyAlertsStore.getState().mapFilteredAlerts()).toHaveLength(1);
      expect(useNearbyAlertsStore.getState().mapFilteredAlerts()[0].id).toBe('1');
    });

    it('filtra por urgencia y categoría combinados', () => {
      const alerts = [
        makeAlert({ id: '1', type: 'robbery', urgency: 'critical' }),
        makeAlert({ id: '2', type: 'robbery', urgency: 'low' }),
        makeAlert({ id: '3', type: 'fire', urgency: 'critical' }),
      ];
      useNearbyAlertsStore.getState().setAllAlerts(alerts);
      useNearbyAlertsStore.getState().toggleCategory('robbery');
      useNearbyAlertsStore.getState().toggleUrgency('low');
      const result = useNearbyAlertsStore.getState().mapFilteredAlerts();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('filteredAlerts', () => {
    it('retorna vacío si no hay ubicación del usuario', () => {
      useNearbyAlertsStore.getState().setAllAlerts([makeAlert()]);
      expect(useNearbyAlertsStore.getState().filteredAlerts()).toEqual([]);
    });

    it('filtra alertas por distancia', () => {
      // Usuario en Atalaya centro
      useNearbyAlertsStore.getState().setUserLocation(-10.7291, -73.7538);
      useNearbyAlertsStore.getState().setSelectedRadius(500);

      const nearAlert = makeAlert({
        id: 'near',
        location: { latitude: -10.7295, longitude: -73.7540 },
      });
      const farAlert = makeAlert({
        id: 'far',
        location: { latitude: -10.7400, longitude: -73.7600 },
      });

      useNearbyAlertsStore.getState().setAllAlerts([nearAlert, farAlert]);
      const filtered = useNearbyAlertsStore.getState().filteredAlerts();

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('near');
    });

    it('filtra por urgencia', () => {
      useNearbyAlertsStore.getState().setUserLocation(-10.7291, -73.7538);
      useNearbyAlertsStore.getState().setSelectedRadius(2000);

      const criticalAlert = makeAlert({
        id: 'critical',
        urgency: 'critical',
        location: { latitude: -10.7295, longitude: -73.7540 },
      });
      const lowAlert = makeAlert({
        id: 'low',
        urgency: 'low',
        location: { latitude: -10.7295, longitude: -73.7540 },
      });

      useNearbyAlertsStore.getState().setAllAlerts([criticalAlert, lowAlert]);

      // Desactivar urgencia baja
      useNearbyAlertsStore.getState().toggleUrgency('low');

      const filtered = useNearbyAlertsStore.getState().filteredAlerts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('critical');
    });

    it('ordena por distancia ascendente', () => {
      useNearbyAlertsStore.getState().setUserLocation(-10.7291, -73.7538);
      useNearbyAlertsStore.getState().setSelectedRadius(2000);

      const farAlert = makeAlert({
        id: 'far',
        location: { latitude: -10.7350, longitude: -73.7580 },
      });
      const nearAlert = makeAlert({
        id: 'near',
        location: { latitude: -10.7295, longitude: -73.7540 },
      });

      useNearbyAlertsStore.getState().setAllAlerts([farAlert, nearAlert]);
      const filtered = useNearbyAlertsStore.getState().filteredAlerts();

      expect(filtered[0].id).toBe('near');
      expect(filtered[1].id).toBe('far');
    });

    it('incluye propiedad distance en los resultados', () => {
      useNearbyAlertsStore.getState().setUserLocation(-10.7291, -73.7538);
      useNearbyAlertsStore.getState().setAllAlerts([makeAlert()]);

      const filtered = useNearbyAlertsStore.getState().filteredAlerts();
      expect(filtered[0]).toHaveProperty('distance');
      expect(typeof filtered[0].distance).toBe('number');
    });
  });

  describe('reset', () => {
    it('restaura el estado inicial', () => {
      useNearbyAlertsStore.getState().setAllAlerts([makeAlert()]);
      useNearbyAlertsStore.getState().setUserLocation(-10, -73);
      useNearbyAlertsStore.getState().setSelectedRadius(200);

      useNearbyAlertsStore.getState().reset();

      const state = useNearbyAlertsStore.getState();
      expect(state.allAlerts).toEqual([]);
      expect(state.userLatitude).toBeNull();
      expect(state.selectedRadius).toBe(1000);
    });
  });
});
