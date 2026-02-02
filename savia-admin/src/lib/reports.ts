import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  AlertData,
  DatePreset,
  DateRange,
  ReportFilters,
  ReportData,
  ReportSummary,
  ChartDataItem,
  TrendDataItem,
  ZoneData,
} from '@/types';

// Color maps
export const TYPE_COLORS: Record<string, string> = {
  robbery: '#D32F2F',
  accident: '#F57C00',
  medical: '#E91E63',
  fire: '#FF5722',
  electrical: '#FFC107',
  water: '#2196F3',
  lost: '#9C27B0',
  other: '#607D8B',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: '#FF9800',
  assigned: '#2196F3',
  in_progress: '#1976D2',
  resolved: '#4CAF50',
  cancelled: '#9E9E9E',
};

export const URGENCY_COLORS: Record<string, string> = {
  critical: '#D32F2F',
  high: '#F57C00',
  medium: '#FBC02D',
  low: '#388E3C',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

const URGENCY_LABELS: Record<string, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export function getDateRangeFromPreset(preset: DatePreset): DateRange {
  const now = new Date();
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (preset) {
    case 'today':
      return { from: new Date(now.getFullYear(), now.getMonth(), now.getDate()), to };
    case 'week': {
      const from = new Date(to);
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case 'month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to };
    }
    case 'quarter': {
      const from = new Date(to);
      from.setMonth(from.getMonth() - 3);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case 'year': {
      const from = new Date(now.getFullYear(), 0, 1);
      return { from, to };
    }
    case 'all':
      return { from: new Date(2020, 0, 1), to };
  }
}

export function getEffectiveDateRange(filters: ReportFilters): DateRange {
  if (filters.customRange) {
    return filters.customRange;
  }
  return getDateRangeFromPreset(filters.preset);
}

export async function fetchReportAlerts(filters: ReportFilters): Promise<AlertData[]> {
  const { from, to } = getEffectiveDateRange(filters);
  const alertsRef = collection(db, 'alerts');
  const q = query(
    alertsRef,
    where('createdAt', '>=', Timestamp.fromDate(from)),
    where('createdAt', '<=', Timestamp.fromDate(to)),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AlertData);
}

function computeSummary(alerts: AlertData[], dateRange: DateRange): ReportSummary {
  const total = alerts.length;
  const resolved = alerts.filter((a) => a.status === 'resolved');
  const resolutionRate = total > 0 ? Math.round((resolved.length / total) * 100) : 0;

  // Tiempo promedio de respuesta (solo alertas resueltas con resolvedAt)
  let avgResponseTimeMinutes = 0;
  const responseTimes: number[] = [];
  for (const alert of resolved) {
    if (alert.resolvedAt && alert.createdAt) {
      const created = (alert.createdAt as { toDate?: () => Date }).toDate
        ? (alert.createdAt as { toDate: () => Date }).toDate()
        : new Date(alert.createdAt as string);
      const resolvedAt = (alert.resolvedAt as { toDate?: () => Date }).toDate
        ? (alert.resolvedAt as { toDate: () => Date }).toDate()
        : new Date(alert.resolvedAt as string);
      const diffMs = resolvedAt.getTime() - created.getTime();
      if (diffMs > 0) {
        responseTimes.push(diffMs / 60000);
      }
    }
  }
  if (responseTimes.length > 0) {
    avgResponseTimeMinutes = Math.round(
      responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length,
    );
  }

  // Alertas por dia
  const diffDays = Math.max(
    1,
    Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const alertsPerDay = Math.round((total / diffDays) * 10) / 10;

  return { totalAlerts: total, resolutionRate, avgResponseTimeMinutes, alertsPerDay };
}

function computeAlertsByType(alerts: AlertData[]): ChartDataItem[] {
  const counts = new Map<string, { name: string; count: number; type: string }>();
  for (const alert of alerts) {
    const key = alert.type || 'other';
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        name: alert.categoryName || key,
        count: 1,
        type: key,
      });
    }
  }
  return Array.from(counts.values())
    .map((item) => ({
      name: item.name,
      value: item.count,
      color: TYPE_COLORS[item.type] || TYPE_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value);
}

function computeAlertsByStatus(alerts: AlertData[]): ChartDataItem[] {
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    const status = alert.status || 'pending';
    counts.set(status, (counts.get(status) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || '#9E9E9E',
    }))
    .sort((a, b) => b.value - a.value);
}

function computeAlertsByUrgency(alerts: AlertData[]): ChartDataItem[] {
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    const urgency = alert.urgency || 'medium';
    counts.set(urgency, (counts.get(urgency) || 0) + 1);
  }
  // Orden fijo: critical, high, medium, low
  const order: string[] = ['critical', 'high', 'medium', 'low'];
  return order
    .filter((u) => counts.has(u))
    .map((urgency) => ({
      name: URGENCY_LABELS[urgency] || urgency,
      value: counts.get(urgency)!,
      color: URGENCY_COLORS[urgency] || '#9E9E9E',
    }));
}

function computeAlertsByInstitution(alerts: AlertData[]): ChartDataItem[] {
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    const name = alert.assignedInstitutionName || 'Sin asignar';
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      value: count,
      color: '#1976D2',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

function toDate(timestamp: unknown): Date {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return (timestamp as { toDate: () => Date }).toDate();
  }
  return new Date(timestamp as string);
}

function computeTrend(alerts: AlertData[], dateRange: DateRange): TrendDataItem[] {
  const diffDays = Math.ceil(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24),
  );
  const byMonth = diffDays > 90;

  // Inicializar buckets vacios
  const buckets = new Map<string, number>();
  if (byMonth) {
    const current = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1);
    const end = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), 1);
    while (current <= end) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, 0);
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    const current = new Date(dateRange.from);
    current.setHours(0, 0, 0, 0);
    while (current <= dateRange.to) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      buckets.set(key, 0);
      current.setDate(current.getDate() + 1);
    }
  }

  // Llenar con datos
  for (const alert of alerts) {
    if (!alert.createdAt) continue;
    const date = toDate(alert.createdAt);
    const key = byMonth
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

function normalizeAddress(address: string): string {
  if (!address) return 'Direccion no especificada';
  const parts = address.split(',').map((p) => p.trim());
  return parts.slice(0, 2).join(', ') || address;
}

function computeTopZones(alerts: AlertData[]): ZoneData[] {
  const total = alerts.length;
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    const zone = normalizeAddress(alert.address);
    counts.set(zone, (counts.get(zone) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([address, count]) => ({
      address,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function processReportData(alerts: AlertData[], dateRange: DateRange): ReportData {
  return {
    summary: computeSummary(alerts, dateRange),
    alertsByType: computeAlertsByType(alerts),
    alertsByStatus: computeAlertsByStatus(alerts),
    alertsByUrgency: computeAlertsByUrgency(alerts),
    alertsByInstitution: computeAlertsByInstitution(alerts),
    trend: computeTrend(alerts, dateRange),
    topZones: computeTopZones(alerts),
    rawAlerts: alerts,
  };
}
