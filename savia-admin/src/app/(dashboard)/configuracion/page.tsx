import { Header } from '@/components/layout/Header';
import { Settings } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Configuracion" title="Configuracion" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <Settings className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          La configuracion del sistema estara disponible proximamente
        </p>
      </div>
    </>
  );
}
