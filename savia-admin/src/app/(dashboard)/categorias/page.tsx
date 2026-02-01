import { Header } from '@/components/layout/Header';
import { Folder } from 'lucide-react';

export default function CategoriasPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Categorias" title="Categorias" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <Folder className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          La gestion de categorias estara disponible en el Sprint 6
        </p>
      </div>
    </>
  );
}
