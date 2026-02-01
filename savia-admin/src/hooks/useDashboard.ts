'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardStats,
  fetchActiveAlerts,
  fetchCriticalActiveCount,
} from '@/lib/dashboard';
import type { DashboardStats, AlertData } from '@/types';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [criticalCount, setCriticalCount] = useState<number>(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, alertsData, critical] = await Promise.all([
        fetchDashboardStats(),
        fetchActiveAlerts(10),
        fetchCriticalActiveCount(),
      ]);

      setStats(statsData);
      setAlerts(alertsData);
      setCriticalCount(critical);
    } catch (err) {
      console.error('[Dashboard] Error cargando datos:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { stats, criticalCount, alerts, loading, error, refresh: loadData };
}
