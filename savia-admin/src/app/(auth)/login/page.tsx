'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { loginAdmin } from '@/lib/auth';

function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Correo o contrasena incorrectos',
    'auth/invalid-email': 'Correo electronico invalido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contrasena incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta mas tarde',
    'auth/network-request-failed': 'Error de conexion. Verifica tu internet',
  };
  return messages[code] || 'Error al iniciar sesion. Intenta nuevamente';
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const displayError = error || authError;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    clearError();

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      setError(getFirebaseErrorMessage(firebaseErr.code || ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-surface rounded-xl p-12 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-[32px] font-bold text-primary tracking-[2px]">
          SAVIA
        </h1>
        <p className="text-base text-text-secondary">Panel de Administracion</p>
      </div>

      {/* Error */}
      {displayError && (
        <div className="mb-6 p-3 rounded-md bg-error/10 border border-error/20">
          <p className="text-sm text-error text-center">{displayError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Correo electronico"
          type="email"
          icon={Mail}
          placeholder="admin@savia.gob.pe"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Contrasena"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {/* Options row */}
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary accent-primary"
            />
            <span className="text-sm text-text-secondary">Recordarme</span>
          </label>
          <button
            type="button"
            onClick={() => alert('Contacta al administrador del sistema para restablecer tu contrasena.')}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Olvidaste tu contrasena?
          </button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          className="mt-4"
        >
          INGRESAR
        </Button>
      </form>

      {/* Footer */}
      <div className="flex flex-col items-center gap-1 mt-8">
        <p className="text-xs text-text-secondary text-center">
          Sistema de Gestion de Alertas Vecinales
        </p>
        <p className="text-xs text-border text-center">
          COPROSEC Atalaya &copy; 2026
        </p>
      </div>
    </div>
  );
}
