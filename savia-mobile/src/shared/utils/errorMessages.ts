const firebaseErrorMap: Record<string, string> = {
  // Auth errors
  'auth/user-not-found': 'No existe una cuenta con este correo',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-credential': 'Credenciales inválidas',
  'auth/email-already-in-use': 'Este correo ya está registrado',
  'auth/weak-password': 'La contraseña es muy débil',
  'auth/invalid-email': 'El correo no es válido',
  'auth/user-disabled': 'Esta cuenta ha sido desactivada',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
  'auth/requires-recent-login': 'Necesitas iniciar sesión nuevamente',

  // Cloud Functions errors
  'functions/already-exists': 'Este DNI o correo ya está registrado',
  'functions/invalid-argument': 'Datos inválidos. Verifica la información',
  'functions/unauthenticated': 'Debes iniciar sesión',
  'functions/permission-denied': 'No tienes permisos para esta acción',
  'functions/not-found': 'Recurso no encontrado',
  'functions/internal': 'Error del servidor. Intenta más tarde',
};

export function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    return firebaseErrorMap[code] ?? 'Ocurrió un error inesperado';
  }
  return 'Ocurrió un error inesperado';
}
