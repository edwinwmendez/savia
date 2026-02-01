import { ALERT_CATEGORIES } from '@/features/alerts/data/categories';
import { colors } from '@/shared/theme/colors';

describe('ALERT_CATEGORIES', () => {
  it('contiene exactamente 8 categorías', () => {
    expect(ALERT_CATEGORIES).toHaveLength(8);
  });

  it('cada categoría tiene id, name, icon, color y order', () => {
    for (const cat of ALERT_CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(cat.order).toBeGreaterThan(0);
    }
  });

  it('los ids son únicos', () => {
    const ids = ALERT_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('los colores corresponden a los del theme', () => {
    const colorMap: Record<string, string> = {
      robbery: colors.alertRobbery,
      accident: colors.alertAccident,
      medical: colors.alertMedical,
      fire: colors.alertFire,
      electrical: colors.alertElectrical,
      water: colors.alertWater,
      lost: colors.alertLost,
      other: colors.alertOther,
    };

    for (const cat of ALERT_CATEGORIES) {
      expect(cat.color).toBe(colorMap[cat.id]);
    }
  });

  it('están ordenadas de 1 a 8', () => {
    const orders = ALERT_CATEGORIES.map((c) => c.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
