'use client';

import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  timestampToDate,
  timeAgo,
  statusLabels,
  statusColors,
  urgencyLabels,
  urgencyColors,
} from '@/lib/utils';
import type { AlertData } from '@/types';

interface AlertsTableProps {
  alerts: AlertData[];
  loading?: boolean;
}

export function AlertsTable({ alerts, loading = false }: AlertsTableProps) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">
          Alertas Activas
        </span>
        <span className="text-sm font-medium text-primary cursor-default">
          Ver todas &rarr;
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg">
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3 w-20">
                #
              </th>
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3">
                Tipo
              </th>
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3">
                Ubicacion
              </th>
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3 w-32">
                Estado
              </th>
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3 w-24">
                Tiempo
              </th>
              <th className="text-left text-xs font-semibold text-text-secondary px-6 py-3 w-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-bg rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-text-secondary">
                  No hay alertas activas
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-border hover:bg-bg/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {alert.alertCode || alert.id?.slice(0, 6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-primary">
                        {alert.categoryName || alert.type}
                      </span>
                      <Badge variant={urgencyColors[alert.urgency] as 'error' | 'warning' | 'success'}>
                        {urgencyLabels[alert.urgency]}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary max-w-[200px] truncate">
                    {alert.address || 'Sin direccion'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[alert.status] as 'warning' | 'info' | 'primary' | 'success' | 'default'}>
                      {statusLabels[alert.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {timeAgo(timestampToDate(alert.createdAt))}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      disabled
                      className="p-1.5 rounded-md text-text-secondary hover:bg-bg transition-colors disabled:opacity-50"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
