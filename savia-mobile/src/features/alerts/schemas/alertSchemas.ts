import { z } from 'zod';
import { VALIDATION } from '@/shared/config/constants';

export const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;

export const describeAlertSchema = z.object({
  description: z
    .string()
    .min(10, 'Describe la situación con al menos 10 caracteres')
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH, `Máximo ${VALIDATION.DESCRIPTION_MAX_LENGTH} caracteres`),
  urgency: z.enum(urgencyLevels, { message: 'Selecciona el nivel de urgencia' }),
});

export const locateAlertSchema = z.object({
  latitude: z.number({ message: 'La ubicación es requerida' }),
  longitude: z.number({ message: 'La ubicación es requerida' }),
  address: z.string().min(1, 'La dirección es requerida'),
});

export type DescribeAlertFormData = z.infer<typeof describeAlertSchema>;
export type LocateAlertFormData = z.infer<typeof locateAlertSchema>;
