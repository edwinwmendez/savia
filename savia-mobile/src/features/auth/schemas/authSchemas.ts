import { z } from 'zod';
import { VALIDATION } from '@/shared/config/constants';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('El correo no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

export const registerSchema = z
  .object({
    dni: z
      .string()
      .min(1, 'El DNI es requerido')
      .length(VALIDATION.DNI_LENGTH, `El DNI debe tener ${VALIDATION.DNI_LENGTH} dígitos`)
      .regex(/^\d+$/, 'El DNI solo debe contener números'),
    firstName: z
      .string()
      .min(1, 'Los nombres son requeridos')
      .min(2, 'Mínimo 2 caracteres'),
    lastName: z
      .string()
      .min(1, 'Los apellidos son requeridos')
      .min(2, 'Mínimo 2 caracteres'),
    phone: z
      .string()
      .min(1, 'El celular es requerido')
      .length(VALIDATION.PHONE_LENGTH, `El celular debe tener ${VALIDATION.PHONE_LENGTH} dígitos`)
      .regex(/^\d+$/, 'El celular solo debe contener números'),
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('El correo no es válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(VALIDATION.PASSWORD_MIN_LENGTH, `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
    acceptTerms: z.literal(true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
