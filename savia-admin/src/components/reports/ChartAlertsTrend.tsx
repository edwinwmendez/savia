'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { TrendDataItem } from '@/types';

interface ChartAlertsTrendProps {
  data: TrendDataItem[];
  loading: boolean;
}

export function ChartAlertsTrend({ data, loading }: ChartAlertsTrendProps) {
  return (
    <ChartCard title="Tendencia de Alertas" subtitle="Evolucion temporal de alertas reportadas">
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-sm text-text-secondary">
          Sin datos para el periodo seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#757575' }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: '#757575' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1976D2"
              strokeWidth={2}
              dot={{ r: 3, fill: '#1976D2' }}
              activeDot={{ r: 5, fill: '#1976D2' }}
              name="Alertas"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
