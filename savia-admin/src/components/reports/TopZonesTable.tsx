'use client';

import { MapPin } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { ZoneData } from '@/types';

interface TopZonesTableProps {
  data: ZoneData[];
  loading: boolean;
}

function PercentageBadge({ percentage }: { percentage: number }) {
  let bgClass = 'bg-bg text-text-secondary';
  if (percentage > 15) bgClass = 'bg-error/10 text-error';
  else if (percentage > 8) bgClass = 'bg-warning/10 text-warning';

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${bgClass}`}>
      {percentage}%
    </span>
  );
}

const columns: Column<ZoneData & { rank: number }>[] = [
  {
    key: 'rank',
    header: '#',
    width: '50px',
    render: (item) => (
      <span className="text-text-secondary font-medium">{item.rank}</span>
    ),
  },
  {
    key: 'address',
    header: 'Zona',
    render: (item) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-text-secondary shrink-0" />
        <span className="text-text-primary">{item.address}</span>
      </div>
    ),
  },
  {
    key: 'count',
    header: 'Alertas',
    width: '100px',
    render: (item) => (
      <span className="font-semibold text-text-primary">{item.count}</span>
    ),
  },
  {
    key: 'percentage',
    header: '% del Total',
    width: '120px',
    render: (item) => <PercentageBadge percentage={item.percentage} />,
  },
];

export function TopZonesTable({ data, loading }: TopZonesTableProps) {
  const rankedData = data.map((zone, i) => ({ ...zone, rank: i + 1 }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        Top 10 Zonas con Mas Alertas
      </h3>
      <DataTable
        columns={columns}
        data={rankedData}
        loading={loading}
        loadingRows={5}
        emptyMessage="Sin datos de zonas"
        emptyDescription="No hay alertas con direccion en el periodo seleccionado"
        rowKey={(item) => item.address}
      />
    </div>
  );
}
