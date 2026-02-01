import { describeAlertSchema, locateAlertSchema } from '@/features/alerts/schemas/alertSchemas';

describe('describeAlertSchema', () => {
  it('valida datos correctos', () => {
    const result = describeAlertSchema.safeParse({
      description: 'Robo en la esquina, dos sujetos en moto',
      urgency: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza descripción vacía', () => {
    const result = describeAlertSchema.safeParse({
      description: '',
      urgency: 'low',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza descripción menor a 10 caracteres', () => {
    const result = describeAlertSchema.safeParse({
      description: 'Corto',
      urgency: 'low',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza descripción que excede 500 caracteres', () => {
    const result = describeAlertSchema.safeParse({
      description: 'A'.repeat(501),
      urgency: 'medium',
    });
    expect(result.success).toBe(false);
  });

  it('acepta los 4 niveles de urgencia válidos', () => {
    const levels = ['low', 'medium', 'high', 'critical'] as const;
    for (const urgency of levels) {
      const result = describeAlertSchema.safeParse({
        description: 'Descripción válida con más de 10 caracteres',
        urgency,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rechaza urgencia inválida', () => {
    const result = describeAlertSchema.safeParse({
      description: 'Descripción válida con más de 10 caracteres',
      urgency: 'extreme',
    });
    expect(result.success).toBe(false);
  });
});

describe('locateAlertSchema', () => {
  it('valida datos correctos', () => {
    const result = locateAlertSchema.safeParse({
      latitude: -10.7312,
      longitude: -73.7565,
      address: 'Av. Atalaya 234, Atalaya',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza sin latitud', () => {
    const result = locateAlertSchema.safeParse({
      longitude: -73.7565,
      address: 'Dirección',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza sin dirección', () => {
    const result = locateAlertSchema.safeParse({
      latitude: -10.7312,
      longitude: -73.7565,
      address: '',
    });
    expect(result.success).toBe(false);
  });
});
