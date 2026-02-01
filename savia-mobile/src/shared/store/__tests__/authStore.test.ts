import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/shared/store/authStore';
import { signOut } from '@/features/auth/services/authService';

jest.mock('@/features/auth/services/authService', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockSignOut = signOut as jest.Mock;

// Helper para simular un callback de onAuthStateChanged
function triggerAuthChange(user: unknown) {
  const callback = mockOnAuthStateChanged.mock.calls[0][1];
  return callback(user);
}

// Helper para crear un mock de documento Firestore
function mockFirestoreDoc(data: Record<string, unknown> | null) {
  mockGetDoc.mockResolvedValue({
    exists: () => data !== null,
    data: () => data,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  mockOnAuthStateChanged.mockReturnValue(jest.fn()); // unsubscribe
  useAuthStore.getState().reset();
  // reset() pone isLoading en false; initialize() espera que empiece en true
  useAuthStore.setState({ isLoading: true });
});

describe('authStore', () => {
  it('establece isAuthenticated=false cuando no hay usuario', async () => {
    useAuthStore.getState().initialize();

    await triggerAuthChange(null);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.userData).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('carga userData para ciudadano autenticado', async () => {
    const mockUser = { uid: 'citizen-123' };
    const mockUserData = {
      dni: '12345678',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      phone: '987654321',
      role: 'citizen',
      isActive: true,
    };

    mockFirestoreDoc(mockUserData);
    useAuthStore.getState().initialize();

    await triggerAuthChange(mockUser);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.userData).toEqual(mockUserData);
    expect(state.institutionData).toBeNull();
  });

  it('cierra sesión para agente inactivo', async () => {
    const mockUser = { uid: 'agent-inactive' };
    const mockUserData = {
      role: 'agent',
      isActive: false,
      institutionId: 'inst-1',
    };

    mockFirestoreDoc(mockUserData);
    useAuthStore.getState().initialize();

    await triggerAuthChange(mockUser);

    const state = useAuthStore.getState();
    expect(state.inactiveAccountError).toBe(
      'Tu cuenta de agente ha sido desactivada. Contacta al administrador.',
    );
    expect(state.isAuthenticated).toBe(false);
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('carga userData e institutionData para agente activo', async () => {
    const mockUser = { uid: 'agent-active' };
    const agentData = {
      role: 'agent',
      isActive: true,
      institutionId: 'inst-1',
    };
    const institutionData = {
      name: 'PNP Atalaya',
      type: 'pnp',
      isActive: true,
    };

    // Primera llamada a getDoc → userData, segunda → institutionData
    mockGetDoc
      .mockResolvedValueOnce({ exists: () => true, data: () => agentData })
      .mockResolvedValueOnce({ exists: () => true, data: () => institutionData });

    useAuthStore.getState().initialize();

    await triggerAuthChange(mockUser);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.userData).toEqual(agentData);
    expect(state.institutionData).toEqual(institutionData);
  });

  it('maneja error en getDoc de userData sin colgar', async () => {
    const mockUser = { uid: 'user-error' };
    mockGetDoc.mockRejectedValueOnce(new Error('Firestore error'));

    useAuthStore.getState().initialize();

    await triggerAuthChange(mockUser);

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.userData).toBeNull();
  });

  it('maneja error en getDoc de institución sin afectar el flujo', async () => {
    const mockUser = { uid: 'agent-inst-error' };
    const agentData = {
      role: 'agent',
      isActive: true,
      institutionId: 'inst-broken',
    };

    mockGetDoc
      .mockResolvedValueOnce({ exists: () => true, data: () => agentData })
      .mockRejectedValueOnce(new Error('Institution fetch failed'));

    useAuthStore.getState().initialize();

    await triggerAuthChange(mockUser);

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.userData).toEqual(agentData);
    expect(state.institutionData).toBeNull();
  });

  it('reset() limpia todo el estado', () => {
    useAuthStore.setState({
      user: { uid: 'test' } as never,
      userData: { role: 'citizen' } as never,
      institutionData: { name: 'Test' } as never,
      inactiveAccountError: 'error',
      isLoading: true,
      isAuthenticated: true,
    });

    useAuthStore.getState().reset();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.userData).toBeNull();
    expect(state.institutionData).toBeNull();
    expect(state.inactiveAccountError).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('authStore - safety timeout (hot reload)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('safety timeout fuerza isLoading=false si onAuthStateChanged no dispara en 10s', () => {
    useAuthStore.getState().initialize();

    // onAuthStateChanged registrado pero nunca llamado (simula hot reload roto)
    expect(useAuthStore.getState().isLoading).toBe(true);

    // Avanzar 9 segundos: todavía cargando
    jest.advanceTimersByTime(9000);
    expect(useAuthStore.getState().isLoading).toBe(true);

    // Avanzar al segundo 10: safety timeout dispara
    jest.advanceTimersByTime(1000);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('safety timeout se cancela cuando onAuthStateChanged dispara normalmente', async () => {
    mockFirestoreDoc({ role: 'citizen', isActive: true });
    useAuthStore.getState().initialize();

    // Auth callback dispara antes del timeout
    await triggerAuthChange({ uid: 'user-1' });

    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Avanzar más de 10s: no debería causar ningún cambio adicional
    jest.advanceTimersByTime(15000);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('cleanup de initialize() limpia timeout y unsubscribe', () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);

    const cleanup = useAuthStore.getState().initialize();

    expect(useAuthStore.getState().isLoading).toBe(true);

    // Ejecutar cleanup (simula unmount de App.tsx)
    cleanup();

    expect(mockUnsubscribe).toHaveBeenCalled();

    // Avanzar el timer: no debería forzar isLoading=false porque se limpió
    jest.advanceTimersByTime(15000);
    expect(useAuthStore.getState().isLoading).toBe(true); // no cambió
  });

  it('safety timeout no cambia estado si auth ya resolvió (isLoading=false)', async () => {
    useAuthStore.getState().initialize();

    // Auth resuelve con null (no autenticado)
    await triggerAuthChange(null);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    // Avanzar 15s: timeout ya fue cancelado por clearTimeout
    jest.advanceTimersByTime(15000);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
