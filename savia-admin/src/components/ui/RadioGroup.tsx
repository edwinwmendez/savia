'use client';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RadioGroup({ options, value, onChange, label }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      )}
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex items-center gap-2 cursor-pointer select-none"
          >
            <button
              type="button"
              role="radio"
              aria-checked={value === opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt.value
                  ? 'border-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {value === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </button>
            <span className="text-sm text-text-primary">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
