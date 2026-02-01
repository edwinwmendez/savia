'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { useAlerts } from '@/hooks/useAlerts';
import {
  timestampToDate,
  formatDateTime,
  statusLabels,
  statusColors,
  urgencyLabels,
  urgencyColors,
  alertTypeEmojis,
} from '@/lib/utils';
import type { AlertWithId } from '@/lib/alerts';
import type { AlertStatus, UrgencyLevel } from '@/types';

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'cancelled', label: 'Cancelado' },
];

const urgencyOptions = [
  { value: 'critical', label: 'Critica' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

const dateOptions = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Última semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'all', label: 'Todas' },
];

export default function AlertsPage() {
  const router = useRouter();
  const {
    alerts,
    totalCount,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    refresh,
  } = useAlerts();

  const hasFilters = filters.search || filters.status || filters.urgency || (filters.dateRange && filters.dateRange !== 'all');

  const columns: Column<AlertWithId>[] = [
    {
      key: 'alertCode',
      header: 'ID',
      width: '130px',
      render: (alert) => (
        <span className="font-mono text-xs font-medium text-text-primary">
          {alert.alertCode || alert.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (alert) => (
        <div className="flex items-center gap-2">
          <span>{alertTypeEmojis[alert.type] || '📋'}</span>
          <span className="text-text-primary">{alert.categoryName || alert.type}</span>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Ubicación',
      render: (alert) => (
        <span className="text-text-secondary max-w-[180px] truncate block">
          {alert.address || 'Sin dirección'}
        </span>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgencia',
      width: '100px',
      render: (alert) => (
        <Badge variant={urgencyColors[alert.urgency] as 'error' | 'warning' | 'success'}>
          {urgencyLabels[alert.urgency]}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (alert) => (
        <Badge variant={statusColors[alert.status] as 'warning' | 'info' | 'primary' | 'success' | 'default'}>
          {statusLabels[alert.status]}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '160px',
      render: (alert) => (
        <span className="text-text-secondary text-xs">
          {formatDateTime(timestampToDate(alert.createdAt))}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '80px',
      render: (alert) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/alertas/${alert.id}`);
          }}
          className="p-1.5 rounded-md text-text-secondary hover:bg-bg hover:text-primary transition-colors"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <>
      <Header breadcrumb="Inicio / Alertas" title="Gestión de Alertas" />

      <div className="p-8 flex flex-col gap-6">
        {error && (
          <div className="p-4 rounded-lg bg-error/10 border border-error/20 flex items-center justify-between">
            <p className="text-sm text-error">{error}</p>
            <button onClick={refresh} className="text-sm font-medium text-error hover:underline">
              Reintentar
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            value={filters.search || ''}
            onChange={(v) => setFilters({ ...filters, search: v })}
            placeholder="Buscar por código, tipo, ubicación..."
            className="w-[300px]"
          />
          <Select
            options={statusOptions}
            value={filters.status || ''}
            onChange={(v) => setFilters({ ...filters, status: v as AlertStatus | '' })}
            placeholder="Todos los estados"
            className="w-[170px]"
          />
          <Select
            options={urgencyOptions}
            value={filters.urgency || ''}
            onChange={(v) => setFilters({ ...filters, urgency: v as UrgencyLevel | '' })}
            placeholder="Toda urgencia"
            className="w-[160px]"
          />
          <Select
            options={dateOptions}
            value={filters.dateRange || ''}
            onChange={(v) => setFilters({ ...filters, dateRange: v as AlertFilters['dateRange'] })}
            placeholder="Cualquier fecha"
            className="w-[170px]"
          />
          {hasFilters && (
            <button
              onClick={() => setFilters({})}
              className="text-sm text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Mostrando {alerts.length} de {totalCount} alertas
          </span>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={alerts}
          loading={loading}
          rowKey={(alert) => alert.id}
          emptyMessage="No se encontraron alertas"
          onRowClick={(alert) => router.push(`/alertas/${alert.id}`)}
        />

        {/* Pagination */}
        {totalCount > pageSize && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}

type AlertFilters = {
  dateRange?: 'today' | 'week' | 'month' | 'all';
};
