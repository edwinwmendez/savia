'use client';

import { Calendar, ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { MapSection } from '@/components/dashboard/MapSection';
import { AlertsTable } from '@/components/dashboard/AlertsTable';
import { useDashboard } from '@/hooks/useDashboard';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { stats, criticalCount, alerts, loading, error, refresh } = useDashboard();

  const today = formatDate(new Date());

  return (
    <>
      <Header breadcrumb="Inicio / Dashboard" title="Dashboard" />

      <div className="p-8 flex flex-col gap-6">
        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-lg bg-error/10 border border-error/20 flex items-center justify-between">
            <p className="text-sm text-error">{error}</p>
            <button
              onClick={refresh}
              className="text-sm font-medium text-error hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Date row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">
            Alertas hoy
          </span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">{today}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Alertas"
            value={stats?.alerts.total ?? 0}
            icon={ClipboardList}
            iconBgClass="bg-primary/15"
            iconColorClass="text-primary"
            loading={loading}
          />
          <StatCard
            title="Pendientes"
            value={stats?.alerts.pending ?? 0}
            icon={Clock}
            iconBgClass="bg-warning/15"
            iconColorClass="text-warning"
            loading={loading}
          />
          <StatCard
            title="Resueltas"
            value={stats?.alerts.resolved ?? 0}
            icon={CheckCircle}
            iconBgClass="bg-success/15"
            iconColorClass="text-success"
            loading={loading}
          />
          <StatCard
            title="Criticas"
            value={criticalCount}
            icon={AlertTriangle}
            iconBgClass="bg-error/15"
            iconColorClass="text-error"
            loading={loading}
          />
        </div>

        {/* Map */}
        <MapSection />

        {/* Alerts table */}
        <AlertsTable alerts={alerts} loading={loading} />
      </div>
    </>
  );
}
