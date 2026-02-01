import { CircleCheck, Triangle, TriangleAlert, Zap } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import type { UrgencyLevel } from '@/shared/types/alert';
import type { LucideIcon } from 'lucide-react-native';

export interface UrgencyLevelConfig {
  level: UrgencyLevel;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const URGENCY_LEVELS: UrgencyLevelConfig[] = [
  {
    level: 'low',
    label: 'Baja',
    icon: CircleCheck,
    color: colors.urgencyLow,
    description: 'Situación controlada, no hay peligro inmediato. Puede esperar atención.',
  },
  {
    level: 'medium',
    label: 'Media',
    icon: Triangle,
    color: colors.urgencyMedium,
    description: 'Requiere atención pronto pero no es una emergencia inmediata.',
  },
  {
    level: 'high',
    label: 'Alta',
    icon: TriangleAlert,
    color: colors.urgencyHigh,
    description: 'Situación en curso con riesgo potencial para personas o propiedad privada. Requiere atención rápida.',
  },
  {
    level: 'critical',
    label: 'Crítica',
    icon: Zap,
    color: colors.urgencyCritical,
    description: 'Peligro inminente para la vida. Requiere respuesta inmediata de las autoridades.',
  },
];
