'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { ChartDataItem } from '@/types';

interface ChartAlertsByStatusProps {
  data: ChartDataItem[];
  loading: boolean;
}

const renderLabel = (props: PieLabelRenderProps) => {
  const name = props.name ?? '';
  const percent = typeof props.percent === 'number' ? props.percent : 0;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

export function ChartAlertsByStatus({ data, loading }: ChartAlertsByStatusProps) {
  return (
    <ChartCard title="Alertas por Estado" subtitle="Distribucion segun estado actual">
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-sm text-text-secondary">
          Sin datos para el periodo seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              label={renderLabel}
              labelLine={{ strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color || '#9E9E9E'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
