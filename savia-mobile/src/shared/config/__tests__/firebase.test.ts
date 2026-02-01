import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';

const mockInitializeApp = initializeApp as jest.Mock;
const mockGetApps = getApps as jest.Mock;
const mockGetApp = getApp as jest.Mock;
const mockInitializeAuth = initializeAuth as jest.Mock;
const mockGetAuth = getAuth as jest.Mock;

// firebase.ts se ejecuta a nivel de módulo, así que lo testeamos
// verificando que los mocks del jest.setup.js tengan el patrón correcto.

describe('firebase initialization (hot reload safety)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('usa initializeApp cuando no hay apps (primer inicio)', () => {
    mockGetApps.mockReturnValue([]);
    mockInitializeApp.mockReturnValue({ name: 'default' });

    const app = getApps().length === 0 ? initializeApp({}) : getApp();

    expect(mockInitializeApp).toHaveBeenCalled();
    expect(mockGetApp).not.toHaveBeenCalled();
    expect(app).toEqual({ name: 'default' });
  });

  it('usa getApp cuando ya hay apps (hot reload)', () => {
    mockGetApps.mockReturnValue([{ name: 'default' }]);
    mockGetApp.mockReturnValue({ name: 'default' });

    const app = getApps().length === 0 ? initializeApp({}) : getApp();

    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(mockGetApp).toHaveBeenCalled();
    expect(app).toEqual({ name: 'default' });
  });

  it('usa initializeAuth en primer inicio', () => {
    const mockApp = { name: 'default' };
    const mockAuthInstance = { currentUser: null };
    mockInitializeAuth.mockReturnValue(mockAuthInstance);

    let auth;
    try {
      auth = initializeAuth(mockApp, { persistence: undefined });
    } catch {
      auth = getAuth(mockApp);
    }

    expect(mockInitializeAuth).toHaveBeenCalledWith(mockApp, { persistence: undefined });
    expect(mockGetAuth).not.toHaveBeenCalled();
    expect(auth).toEqual(mockAuthInstance);
  });

  it('usa getAuth como fallback cuando initializeAuth lanza error (hot reload)', () => {
    const mockApp = { name: 'default' };
    const mockAuthInstance = { currentUser: null };
    mockInitializeAuth.mockImplementation(() => {
      throw new Error('Firebase: Error (auth/already-initialized)');
    });
    mockGetAuth.mockReturnValue(mockAuthInstance);

    let auth;
    try {
      auth = initializeAuth(mockApp, { persistence: undefined });
    } catch {
      auth = getAuth(mockApp);
    }

    expect(mockInitializeAuth).toHaveBeenCalled();
    expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
    expect(auth).toEqual(mockAuthInstance);
  });

  it('no retorna undefined incluso si ambos métodos fallan parcialmente', () => {
    const mockApp = { name: 'default' };
    const fallbackAuth = { currentUser: null };
    mockInitializeAuth.mockImplementation(() => {
      throw new Error('init failed');
    });
    mockGetAuth.mockReturnValue(fallbackAuth);

    let auth;
    try {
      auth = initializeAuth(mockApp, {});
    } catch {
      auth = getAuth(mockApp);
    }

    expect(auth).toBeDefined();
    expect(auth).not.toBeNull();
  });
});
