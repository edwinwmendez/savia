import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import { formatTimestamp } from '@/shared/utils/formatters';
import type { AlertStatus, StatusHistoryEntry } from '@/shared/types/alert';

interface AlertTimelineProps {
  statusHistory: StatusHistoryEntry[];
  currentStatus: AlertStatus;
}

const STATUS_TITLES: Record<AlertStatus, string> = {
  pending: 'Reportada',
  assigned: 'En camino',
  in_progress: 'En el lugar',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

// Orden canónico del flujo de estados para determinar cuáles están completados
const STATUS_ORDER: AlertStatus[] = [
  'pending',
  'assigned',
  'in_progress',
  'resolved',
];

function isEntryCompleted(
  entryIndex: number,
  totalEntries: number,
  currentStatus: AlertStatus,
): boolean {
  // Todas las entries que ya pasaron están completadas.
  // La última entry es la actual (completada si currentStatus coincide o ya avanzó).
  // Simplificación: todos los entries que están en el historial ya ocurrieron, por lo tanto están completados.
  // Solo la línea que conecta con un futuro estado pendiente no está completada.
  return entryIndex < totalEntries;
}

export function AlertTimeline({ statusHistory, currentStatus }: AlertTimelineProps) {
  if (!statusHistory || statusHistory.length === 0) return null;

  // Determinar el índice del currentStatus en el flujo canónico
  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {statusHistory.map((entry, index) => {
        const isLast = index === statusHistory.length - 1;
        const title = STATUS_TITLES[entry.status] ?? entry.status;
        const subtitle = entry.agentName ?? entry.note ?? null;
        const timeText = formatTimestamp(entry.timestamp);

        // Un entry en el historial ya ocurrió, por lo tanto su dot está completado
        const isDotCompleted = true;
        // La línea que conecta al siguiente está completada si el siguiente entry también existe
        const isLineCompleted = !isLast;

        return (
          <View key={`${entry.status}-${index}`} style={styles.entryRow}>
            {/* Columna de la línea y el dot */}
            <View style={styles.lineColumn}>
              <View
                style={[
                  styles.dot,
                  isDotCompleted ? styles.dotCompleted : styles.dotPending,
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    isLineCompleted ? styles.lineCompleted : styles.linePending,
                  ]}
                />
              )}
            </View>

            {/* Contenido del entry */}
            <View style={styles.entryContent}>
              <Text style={styles.entryTitle}>{title}</Text>
              {subtitle && (
                <Text style={styles.entrySubtitle} numberOfLines={2}>
                  {subtitle}
                </Text>
              )}
              <Text style={styles.entryTime}>{timeText}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  entryRow: {
    flexDirection: 'row',
  },
  lineColumn: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  dotPending: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
  linePending: {
    backgroundColor: colors.border,
  },
  entryContent: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  entryTitle: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  entrySubtitle: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  entryTime: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
