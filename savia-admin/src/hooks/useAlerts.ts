'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAlerts, updateAlertAdmin, type AlertFilters, type AlertWithId } from '@/lib/alerts';

const PAGE_SIZE = 10;

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertWithId[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AlertFilters>({});
  const [page, setPage] = useState(1);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { alerts: data, total } = await fetchAlerts(filters, PAGE_SIZE);
      setAlerts(data);
      setTotalCount(total);
    } catch (err) {
      console.error('[useAlerts] Error:', err);
      setError('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
    loadAlerts();
  }, [loadAlerts]);

  async function updateAlert(
    id: string,
    data: Parameters<typeof updateAlertAdmin>[1],
  ) {
    await updateAlertAdmin(id, data);
    await loadAlerts();
  }

  // Client-side pagination
  const paginatedAlerts = alerts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return {
    alerts: paginatedAlerts,
    allAlerts: alerts,
    totalCount,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    updateAlert,
    refresh: loadAlerts,
  };
}
