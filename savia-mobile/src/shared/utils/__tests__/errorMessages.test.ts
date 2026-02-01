import { getFirebaseErrorMessage } from '@/shared/utils/errorMessages';

describe('getFirebaseErrorMessage', () => {
  it('retorna mensaje para código auth conocido', () => {
    const error = { code: 'auth/invalid-credential' };
    expect(getFirebaseErrorMessage(error)).toBe('Credenciales inválidas');
  });

  it('retorna mensaje para código functions conocido', () => {
    const error = { code: 'functions/already-exists' };
    expect(getFirebaseErrorMessage(error)).toBe('Este DNI o correo ya está registrado');
  });

  it('retorna mensaje genérico para código desconocido', () => {
    const error = { code: 'auth/unknown-error-xyz' };
    expect(getFirebaseErrorMessage(error)).toBe('Ocurrió un error inesperado');
  });

  it('retorna mensaje genérico para error sin code', () => {
    const error = new Error('algo falló');
    expect(getFirebaseErrorMessage(error)).toBe('Ocurrió un error inesperado');
  });

  it('retorna mensaje genérico para null', () => {
    expect(getFirebaseErrorMessage(null)).toBe('Ocurrió un error inesperado');
  });

  it('retorna mensaje genérico para undefined', () => {
    expect(getFirebaseErrorMessage(undefined)).toBe('Ocurrió un error inesperado');
  });

  it('retorna mensaje para cada código de auth', () => {
    const expectedMap: Record<string, string> = {
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'El correo no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido desactivada',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    };

    for (const [code, message] of Object.entries(expectedMap)) {
      expect(getFirebaseErrorMessage({ code })).toBe(message);
    }
  });
});
