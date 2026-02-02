'use client';

import { Loader2 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, loading = false, children }: ChartCardProps) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
