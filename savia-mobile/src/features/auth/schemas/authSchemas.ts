import { z } from 'zod';
import { VALIDATION } from '@/shared/config/constants';

const emailSchema = z.email({
  error: (issue) => {
    if (!issue.input) return 'El correo es requerido';
    return 'El correo no es válido';
  },
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { error: 'La contraseña es requerida' }),
});

export const registerSchema = z
  .object({
    dni: z
      .string()
      .min(1, { error: 'El DNI es requerido' })
      .length(VALIDATION.DNI_LENGTH, { error: `El DNI debe tener ${VALIDATION.DNI_LENGTH} dígitos` })
      .regex(/^\d+$/, { error: 'El DNI solo debe contener números' }),
    firstName: z
      .string()
      .min(1, { error: 'Los nombres son requeridos' })
      .min(2, { error: 'Mínimo 2 caracteres' }),
    lastName: z
      .string()
      .min(1, { error: 'Los apellidos son requeridos' })
      .min(2, { error: 'Mínimo 2 caracteres' }),
    phone: z
      .string()
      .min(1, { error: 'El celular es requerido' })
      .length(VALIDATION.PHONE_LENGTH, { error: `El celular debe tener ${VALIDATION.PHONE_LENGTH} dígitos` })
      .regex(/^\d+$/, { error: 'El celular solo debe contener números' }),
    email: emailSchema,
    password: z
      .string()
      .min(1, { error: 'La contraseña es requerida' })
      .min(VALIDATION.PASSWORD_MIN_LENGTH, { error: `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres` }),
    confirmPassword: z
      .string()
      .min(1, { error: 'Confirma tu contraseña' }),
    acceptTerms: z.literal(true, {
      error: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
