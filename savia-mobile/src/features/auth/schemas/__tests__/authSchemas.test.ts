import { loginSchema, forgotPasswordSchema, registerSchema } from '@/features/auth/schemas/authSchemas';

describe('loginSchema', () => {
  it('valida datos correctos', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza email inválido', () => {
    const result = loginSchema.safeParse({
      email: 'no-es-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza email vacío', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza password vacío', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('valida email correcto', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza email inválido', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'invalido',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    dni: '12345678',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '987654321',
    email: 'juan@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    acceptTerms: true as const,
  };

  it('valida datos completos correctos', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rechaza DNI con menos de 8 dígitos', () => {
    const result = registerSchema.safeParse({ ...validData, dni: '1234' });
    expect(result.success).toBe(false);
  });

  it('rechaza DNI con letras', () => {
    const result = registerSchema.safeParse({ ...validData, dni: '1234abcd' });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseñas que no coinciden', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'otra-password',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza si no acepta términos', () => {
    const result = registerSchema.safeParse({
      ...validData,
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza teléfono con longitud incorrecta', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '12345' });
    expect(result.success).toBe(false);
  });
});
