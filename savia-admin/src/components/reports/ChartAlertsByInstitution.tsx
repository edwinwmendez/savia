'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { ChartDataItem } from '@/types';

interface ChartAlertsByInstitutionProps {
  data: ChartDataItem[];
  loading: boolean;
}

export function ChartAlertsByInstitution({ data, loading }: ChartAlertsByInstitutionProps) {
  return (
    <ChartCard
      title="Alertas por Institucion"
      subtitle="Top 10 instituciones con mas alertas asignadas"
    >
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-sm text-text-secondary">
          Sin datos para el periodo seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(250, data.length * 35)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#757575' }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#757575' }}
              width={95}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" fill="#1976D2" radius={[0, 4, 4, 0]} name="Alertas" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
