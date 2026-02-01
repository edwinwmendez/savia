import { Header } from '@/components/layout/Header';
import { Building2 } from 'lucide-react';

export default function InstitucionesPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Instituciones" title="Instituciones" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <Building2 className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          La gestion de instituciones estara disponible en el Sprint 6
        </p>
      </div>
    </>
  );
}
