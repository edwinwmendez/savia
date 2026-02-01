import { Header } from '@/components/layout/Header';
import { ChartLine } from 'lucide-react';

export default function ReportesPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Reportes" title="Reportes" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <ChartLine className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          Los reportes estadisticos estaran disponibles en el Sprint 8
        </p>
      </div>
    </>
  );
}
