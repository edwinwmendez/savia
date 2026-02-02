'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchReportAlerts, getEffectiveDateRange, processReportData } from '@/lib/reports';
import { exportToPDF, exportToExcel } from '@/lib/export';
import type { ReportFilters, ReportData, DateRange, DatePreset } from '@/types';

export function useReports() {
  const [filters, setFilters] = useState<ReportFilters>({ preset: 'month' });
  const [data, setData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getEffectiveDateRange({ preset: 'month' }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const range = getEffectiveDateRange(filters);
      setDateRange(range);

      const alerts = await fetchReportAlerts(filters);
      const reportData = processReportData(alerts, range);
      setData(reportData);
    } catch (err) {
      console.error('[Reports] Error cargando datos:', err);
      setError('Error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setPreset = (preset: DatePreset) => {
    setFilters({ preset });
  };

  const setCustomRange = (from: Date, to: Date) => {
    setFilters({ preset: 'all', customRange: { from, to } });
  };

  const handleExportPDF = async () => {
    if (!data) return;
    try {
      setExporting('pdf');
      exportToPDF(data, dateRange);
    } catch (err) {
      console.error('[Reports] Error exportando PDF:', err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    if (!data) return;
    try {
      setExporting('excel');
      exportToExcel(data, dateRange);
    } catch (err) {
      console.error('[Reports] Error exportando Excel:', err);
    } finally {
      setExporting(null);
    }
  };

  return {
    data,
    filters,
    dateRange,
    loading,
    error,
    exporting,
    setPreset,
    setCustomRange,
    refresh: loadData,
    exportPDF: handleExportPDF,
    exportExcel: handleExportExcel,
  };
}
