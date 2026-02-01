import { MapPin, RefreshCw } from 'lucide-react';

export function MapSection() {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">
          Mapa en Tiempo Real
        </span>
        <button
          disabled
          className="flex items-center gap-1.5 text-xs text-text-secondary cursor-not-allowed opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualizar
        </button>
      </div>

      {/* Map placeholder */}
      <div className="h-[320px] bg-info/5 flex flex-col items-center justify-center gap-3">
        <MapPin className="w-12 h-12 text-border" />
        <p className="text-sm text-text-secondary">
          Mapa interactivo disponible proximamente
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 px-6 py-3 border-t border-border">
        <LegendItem color="bg-urgency-critical" label="Critica" />
        <LegendItem color="bg-urgency-high" label="Alta" />
        <LegendItem color="bg-urgency-medium" label="Media" />
        <LegendItem color="bg-urgency-low" label="Baja" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  );
}
