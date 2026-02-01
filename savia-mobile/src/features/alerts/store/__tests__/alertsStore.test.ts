import { useAlertsStore } from '@/features/alerts/store/alertsStore';
import type { AlertData } from '@/shared/types/alert';

const mockTimestamp = {
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
  toDate: () => new Date(),
} as any;

const makeAlert = (overrides: Partial<AlertData> = {}): AlertData => ({
  id: 'alert-1',
  type: 'robbery',
  categoryName: 'Robo',
  description: 'Descripcion',
  urgency: 'high',
  status: 'pending',
  location: { latitude: -10.72, longitude: -73.75 },
  address: 'Av. Test 123',
  imageUrls: [],
  createdBy: 'user-1',
  assignedTo: null,
  assignedInstitution: null,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
  ...overrides,
});

describe('alertsStore', () => {
  beforeEach(() => {
    useAlertsStore.getState().reset();
  });

  it('estado inicial correcto', () => {
    const state = useAlertsStore.getState();
    expect(state.alerts).toEqual([]);
    expect(state.selectedTab).toBe('all');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setAlerts actualiza las alertas', () => {
    const alerts = [makeAlert({ id: '1' }), makeAlert({ id: '2' })];
    useAlertsStore.getState().setAlerts(alerts);
    expect(useAlertsStore.getState().alerts).toHaveLength(2);
  });

  it('setSelectedTab cambia el tab', () => {
    useAlertsStore.getState().setSelectedTab('active');
    expect(useAlertsStore.getState().selectedTab).toBe('active');
  });

  it('filteredAlerts retorna todas cuando tab es "all"', () => {
    const alerts = [
      makeAlert({ id: '1', status: 'pending' }),
      makeAlert({ id: '2', status: 'resolved' }),
    ];
    useAlertsStore.getState().setAlerts(alerts);
    useAlertsStore.getState().setSelectedTab('all');
    expect(useAlertsStore.getState().filteredAlerts()).toHaveLength(2);
  });

  it('filteredAlerts retorna solo activas cuando tab es "active"', () => {
    const alerts = [
      makeAlert({ id: '1', status: 'pending' }),
      makeAlert({ id: '2', status: 'assigned' }),
      makeAlert({ id: '3', status: 'resolved' }),
    ];
    useAlertsStore.getState().setAlerts(alerts);
    useAlertsStore.getState().setSelectedTab('active');
    expect(useAlertsStore.getState().filteredAlerts()).toHaveLength(2);
  });

  it('filteredAlerts retorna solo cerradas cuando tab es "closed"', () => {
    const alerts = [
      makeAlert({ id: '1', status: 'pending' }),
      makeAlert({ id: '2', status: 'resolved' }),
      makeAlert({ id: '3', status: 'cancelled' }),
    ];
    useAlertsStore.getState().setAlerts(alerts);
    useAlertsStore.getState().setSelectedTab('closed');
    expect(useAlertsStore.getState().filteredAlerts()).toHaveLength(2);
  });

  it('activeCount cuenta solo alertas activas', () => {
    const alerts = [
      makeAlert({ id: '1', status: 'pending' }),
      makeAlert({ id: '2', status: 'in_progress' }),
      makeAlert({ id: '3', status: 'resolved' }),
    ];
    useAlertsStore.getState().setAlerts(alerts);
    expect(useAlertsStore.getState().activeCount()).toBe(2);
  });

  it('reset restaura el estado inicial', () => {
    useAlertsStore.getState().setAlerts([makeAlert()]);
    useAlertsStore.getState().setSelectedTab('active');
    useAlertsStore.getState().setLoading(true);
    useAlertsStore.getState().reset();

    const state = useAlertsStore.getState();
    expect(state.alerts).toEqual([]);
    expect(state.selectedTab).toBe('all');
    expect(state.isLoading).toBe(false);
  });
});
