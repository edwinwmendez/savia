'use client';

import { ChevronDown, type LucideIcon } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  icon: Icon,
  error,
  className = '',
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            h-12 w-full rounded-md bg-bg border border-border appearance-none
            text-text-primary transition-colors duration-200
            focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
            ${Icon ? 'pl-12 pr-10' : 'pl-4 pr-10'}
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${value === '' ? 'text-text-secondary' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
