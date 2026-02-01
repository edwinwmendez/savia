import { colors } from '@/shared/theme/colors';
import type { AlertCategory } from '@/shared/types/alert';

export const ALERT_CATEGORIES: AlertCategory[] = [
  { id: 'robbery', name: 'Robo/Asalto', icon: 'Siren', color: colors.alertRobbery, order: 1 },
  { id: 'accident', name: 'Accidente', icon: 'Car', color: colors.alertAccident, order: 2 },
  { id: 'medical', name: 'Emergencia Médica', icon: 'HeartPulse', color: colors.alertMedical, order: 3 },
  { id: 'fire', name: 'Incendio', icon: 'Flame', color: colors.alertFire, order: 4 },
  { id: 'electrical', name: 'Falla Eléctrica', icon: 'Zap', color: colors.alertElectrical, order: 5 },
  { id: 'water', name: 'Problema de Agua', icon: 'Droplets', color: colors.alertWater, order: 6 },
  { id: 'lost', name: 'Pérdida/Hallazgo', icon: 'Search', color: colors.alertLost, order: 7 },
  { id: 'other', name: 'Otro', icon: 'Pencil', color: colors.alertOther, order: 8 },
];
