import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  loading?: boolean;
  formatValue?: (value: number) => string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  trend,
  loading = false,
  formatValue,
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-text-secondary">{title}</span>
          {loading ? (
            <div className="h-9 w-16 bg-bg rounded-md animate-pulse mt-2" />
          ) : (
            <span className="text-4xl font-bold text-text-primary mt-2">
              {formatValue ? formatValue(value) : value}
            </span>
          )}
          {trend && !loading && (
            <span
              className={`text-xs font-medium mt-1 ${
                trend.positive ? 'text-success' : 'text-error'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass}`}
        >
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
    </div>
  );
}
