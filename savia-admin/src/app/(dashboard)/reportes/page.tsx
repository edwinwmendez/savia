'use client';

import { Header } from '@/components/layout/Header';
import { useReports } from '@/hooks/useReports';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ReportSummaryCards } from '@/components/reports/ReportSummaryCards';
import { ExportButtons } from '@/components/reports/ExportButtons';
import { TopZonesTable } from '@/components/reports/TopZonesTable';
import { AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

const ChartAlertsByType = dynamic(
  () => import('@/components/reports/ChartAlertsByType').then((m) => m.ChartAlertsByType),
  { ssr: false },
);
const ChartAlertsByStatus = dynamic(
  () => import('@/components/reports/ChartAlertsByStatus').then((m) => m.ChartAlertsByStatus),
  { ssr: false },
);
const ChartAlertsTrend = dynamic(
  () => import('@/components/reports/ChartAlertsTrend').then((m) => m.ChartAlertsTrend),
  { ssr: false },
);
const ChartAlertsByUrgency = dynamic(
  () => import('@/components/reports/ChartAlertsByUrgency').then((m) => m.ChartAlertsByUrgency),
  { ssr: false },
);
const ChartAlertsByInstitution = dynamic(
  () =>
    import('@/components/reports/ChartAlertsByInstitution').then(
      (m) => m.ChartAlertsByInstitution,
    ),
  { ssr: false },
);

export default function ReportesPage() {
  const {
    data,
    filters,
    loading,
    error,
    exporting,
    setPreset,
    setCustomRange,
    exportPDF,
    exportExcel,
  } = useReports();

  return (
    <>
      <Header
        breadcrumb="Inicio / Reportes"
        title="Reportes"
        actionButton={
          <ExportButtons
            onExportPDF={exportPDF}
            onExportExcel={exportExcel}
            exporting={exporting}
            disabled={loading || !data}
          />
        }
      />
      <div className="p-8 flex flex-col gap-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-error shrink-0" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <ReportFilters
          filters={filters}
          onPresetChange={setPreset}
          onCustomRange={setCustomRange}
          loading={loading}
        />

        <ReportSummaryCards summary={data?.summary ?? null} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartAlertsByType data={data?.alertsByType ?? []} loading={loading} />
          <ChartAlertsByStatus data={data?.alertsByStatus ?? []} loading={loading} />
        </div>

        <ChartAlertsTrend data={data?.trend ?? []} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartAlertsByUrgency data={data?.alertsByUrgency ?? []} loading={loading} />
          <ChartAlertsByInstitution data={data?.alertsByInstitution ?? []} loading={loading} />
        </div>

        <TopZonesTable data={data?.topZones ?? []} loading={loading} />
      </div>
    </>
  );
}
