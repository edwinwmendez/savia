'use client';

import dynamic from 'next/dynamic';
import { RefreshCw } from 'lucide-react';
import type { AlertData } from '@/types';

const HeatMapContent = dynamic(() => import('./HeatMapContent').then((m) => m.HeatMapContent), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] bg-info/5 flex items-center justify-center">
      <p className="text-sm text-text-secondary">Cargando mapa...</p>
    </div>
  ),
});

interface MapSectionProps {
  alerts: AlertData[];
  onRefresh?: () => void;
  loading?: boolean;
}

export function MapSection({ alerts, onRefresh, loading }: MapSectionProps) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">
          Mapa de Calor - Zonas Criticas
        </span>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Heat Map */}
      <HeatMapContent alerts={alerts} />

      {/* Legend - gradient */}
      <div className="flex items-center justify-center gap-3 px-6 py-3 border-t border-border">
        <span className="text-xs text-text-secondary">Baja</span>
        <div
          className="h-2.5 w-40 rounded-full"
          style={{
            background: 'linear-gradient(to right, #3b82f6, #22d3ee, #22c55e, #eab308, #f97316, #ef4444)',
          }}
        />
        <span className="text-xs text-text-secondary">Alta</span>
      </div>
    </div>
  );
}
