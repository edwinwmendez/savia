import { Header } from '@/components/layout/Header';
import { Users } from 'lucide-react';

export default function UsuariosPage() {
  return (
    <>
      <Header breadcrumb="Inicio / Usuarios" title="Usuarios" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] gap-4">
        <Users className="w-16 h-16 text-border" />
        <p className="text-lg text-text-secondary">Proximamente</p>
        <p className="text-sm text-text-secondary">
          La gestion de usuarios estara disponible en el Sprint 6
        </p>
      </div>
    </>
  );
}
