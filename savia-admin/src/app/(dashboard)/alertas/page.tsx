import { Header } from '@/components/layout/Header';
import { Bell } from 'lucide-react';

export default function AlertasPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Alertas" title="Alertas" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <Bell className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          La gestion de alertas estara disponible en el Sprint 6
        </p>
      </div>
    </>
  );
}
