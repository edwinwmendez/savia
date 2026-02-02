'use client';

import { ClipboardList, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatResponseTime } from '@/lib/export';
import type { ReportSummary } from '@/types';

interface ReportSummaryCardsProps {
  summary: ReportSummary | null;
  loading: boolean;
}

export function ReportSummaryCards({ summary, loading }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Alertas"
        value={summary?.totalAlerts ?? 0}
        icon={ClipboardList}
        iconBgClass="bg-primary-light/30"
        iconColorClass="text-primary"
        loading={loading}
      />
      <StatCard
        title="Tasa de Resolucion"
        value={summary?.resolutionRate ?? 0}
        icon={CheckCircle}
        iconBgClass="bg-success/10"
        iconColorClass="text-success"
        loading={loading}
        formatValue={(v) => `${v}%`}
      />
      <StatCard
        title="Tiempo Prom. Respuesta"
        value={summary?.avgResponseTimeMinutes ?? 0}
        icon={Clock}
        iconBgClass="bg-warning/10"
        iconColorClass="text-warning"
        loading={loading}
        formatValue={formatResponseTime}
      />
      <StatCard
        title="Alertas / Dia"
        value={summary?.alertsPerDay ?? 0}
        icon={TrendingUp}
        iconBgClass="bg-info/10"
        iconColorClass="text-info"
        loading={loading}
      />
    </div>
  );
}
