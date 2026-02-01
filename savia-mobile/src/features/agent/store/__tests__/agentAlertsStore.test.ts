import { useAgentAlertsStore } from '@/features/agent/store/agentAlertsStore';
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

describe('agentAlertsStore', () => {
  beforeEach(() => {
    useAgentAlertsStore.getState().reset();
  });

  it('estado inicial correcto', () => {
    const state = useAgentAlertsStore.getState();
    expect(state.pendingAlerts).toEqual([]);
    expect(state.myCases).toEqual([]);
    expect(state.history).toEqual([]);
    expect(state.selectedTab).toBe('pending');
    expect(state.isLoading).toBe(false);
    expect(state.isTakingCase).toBe(false);
    expect(state.isUpdatingStatus).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setPendingAlerts actualiza alertas pendientes', () => {
    const alerts = [makeAlert({ id: '1' }), makeAlert({ id: '2' })];
    useAgentAlertsStore.getState().setPendingAlerts(alerts);
    expect(useAgentAlertsStore.getState().pendingAlerts).toHaveLength(2);
  });

  it('setMyCases actualiza mis casos', () => {
    const alerts = [makeAlert({ id: '1', status: 'assigned' })];
    useAgentAlertsStore.getState().setMyCases(alerts);
    expect(useAgentAlertsStore.getState().myCases).toHaveLength(1);
  });

  it('setHistory actualiza el historial', () => {
    const alerts = [makeAlert({ id: '1', status: 'resolved' })];
    useAgentAlertsStore.getState().setHistory(alerts);
    expect(useAgentAlertsStore.getState().history).toHaveLength(1);
  });

  it('pendingCount retorna el conteo correcto', () => {
    const alerts = [makeAlert({ id: '1' }), makeAlert({ id: '2' }), makeAlert({ id: '3' })];
    useAgentAlertsStore.getState().setPendingAlerts(alerts);
    expect(useAgentAlertsStore.getState().pendingCount()).toBe(3);
  });

  it('myCasesCount retorna el conteo correcto', () => {
    const alerts = [makeAlert({ id: '1' })];
    useAgentAlertsStore.getState().setMyCases(alerts);
    expect(useAgentAlertsStore.getState().myCasesCount()).toBe(1);
  });

  it('setSelectedTab cambia el tab', () => {
    useAgentAlertsStore.getState().setSelectedTab('myCases');
    expect(useAgentAlertsStore.getState().selectedTab).toBe('myCases');
  });

  it('setTakingCase actualiza el estado de carga', () => {
    useAgentAlertsStore.getState().setTakingCase(true);
    expect(useAgentAlertsStore.getState().isTakingCase).toBe(true);
  });

  it('reset restaura el estado inicial', () => {
    useAgentAlertsStore.getState().setPendingAlerts([makeAlert()]);
    useAgentAlertsStore.getState().setMyCases([makeAlert()]);
    useAgentAlertsStore.getState().setSelectedTab('myCases');
    useAgentAlertsStore.getState().setTakingCase(true);
    useAgentAlertsStore.getState().reset();

    const state = useAgentAlertsStore.getState();
    expect(state.pendingAlerts).toEqual([]);
    expect(state.myCases).toEqual([]);
    expect(state.selectedTab).toBe('pending');
    expect(state.isTakingCase).toBe(false);
  });
});
