'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Bell,
  Building2,
  Users,
  Folder,
  ChartLine,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Bell, label: 'Alertas', href: '/alertas' },
  { icon: Building2, label: 'Instituciones', href: '/instituciones' },
  { icon: Users, label: 'Usuarios', href: '/usuarios' },
  { icon: Folder, label: 'Categorias', href: '/categorias' },
  { icon: ChartLine, label: 'Reportes', href: '/reportes' },
];

const footerNav: NavItem[] = [
  { icon: Settings, label: 'Configuracion', href: '/configuracion' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuth((s) => s.logout);

  return (
    <aside className="w-[260px] h-screen flex flex-col bg-surface border-r border-border shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-border">
        <Shield className="w-7 h-7 text-primary" />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary leading-tight">SAVIA</span>
          <span className="text-xs text-text-secondary">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 h-11 px-4 rounded-md text-sm transition-colors
                ${active
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-text-primary font-medium hover:bg-bg'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-text-secondary'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-border mx-3" />

      {/* Footer */}
      <div className="flex flex-col gap-1 p-3">
        {footerNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 h-11 px-4 rounded-md text-sm transition-colors
                ${active
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-text-primary font-medium hover:bg-bg'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-text-secondary'}`} />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="flex items-center gap-3 h-11 px-4 rounded-md text-sm text-text-primary font-medium hover:bg-bg transition-colors"
        >
          <LogOut className="w-5 h-5 text-text-secondary" />
          Cerrar Sesion
        </button>
      </div>
    </aside>
  );
}
