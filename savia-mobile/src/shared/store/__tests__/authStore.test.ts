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
  mockOnAuthStateChanged.mockReturnValue(jest.fn()); // unsubscribe
  useAuthStore.getState().reset();
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

  it('reset() limpia todo el estado', () => {
    // Simular un estado con datos
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
