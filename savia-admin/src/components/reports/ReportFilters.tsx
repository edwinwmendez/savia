'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ReportFilters as ReportFiltersType, DatePreset } from '@/types';

interface ReportFiltersProps {
  filters: ReportFiltersType;
  onPresetChange: (preset: DatePreset) => void;
  onCustomRange: (from: Date, to: Date) => void;
  loading?: boolean;
}

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Ano' },
  { value: 'all', label: 'Todo' },
];

export function ReportFilters({
  filters,
  onPresetChange,
  onCustomRange,
  loading = false,
}: ReportFiltersProps) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApplyCustom = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate + 'T00:00:00');
      const to = new Date(toDate + 'T23:59:59');
      if (from <= to) {
        onCustomRange(from, to);
      }
    }
  };

  const isCustomActive = !!filters.customRange;

  return (
    <div className="bg-surface rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center gap-3">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onPresetChange(preset.value)}
              disabled={loading}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 ${
                filters.preset === preset.value && !isCustomActive
                  ? 'bg-primary text-white shadow-[0_2px_8px_rgba(25,118,210,0.3)]'
                  : 'bg-bg text-text-secondary hover:bg-border hover:text-text-primary'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* Custom range */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={loading}
            className="h-9 px-3 text-sm border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
          />
          <span className="text-text-secondary text-sm">a</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={loading}
            className="h-9 px-3 text-sm border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleApplyCustom}
            disabled={loading || !fromDate || !toDate}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
