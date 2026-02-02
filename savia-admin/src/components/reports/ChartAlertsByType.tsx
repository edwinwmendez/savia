'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { ChartDataItem } from '@/types';

interface ChartAlertsByTypeProps {
  data: ChartDataItem[];
  loading: boolean;
}

export function ChartAlertsByType({ data, loading }: ChartAlertsByTypeProps) {
  return (
    <ChartCard title="Alertas por Tipo" subtitle="Distribucion segun categoria de alerta">
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-sm text-text-secondary">
          Sin datos para el periodo seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#757575' }}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11, fill: '#757575' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Alertas">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color || '#1976D2'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
