'use client';

import { User, Shield, Clock, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { timestampToDate, formatDateTime, statusLabels } from '@/lib/utils';
import type { StatusHistoryEntry } from '@/types';

interface PersonInfo {
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  email: string;
}

interface ReporterCardProps {
  reporter: PersonInfo | null;
  createdAt: unknown;
  loading?: boolean;
}

export function ReporterCard({ reporter, createdAt, loading }: ReporterCardProps) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Reportado por
        </h4>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="h-4 bg-bg rounded animate-pulse w-3/4" />
            <div className="h-3 bg-bg rounded animate-pulse w-1/2" />
            <div className="h-3 bg-bg rounded animate-pulse w-2/3" />
          </div>
        ) : reporter ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
                {reporter.firstName.charAt(0)}{reporter.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {reporter.firstName} {reporter.lastName}
                </p>
                <p className="text-xs text-text-secondary">DNI: {reporter.dni}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{reporter.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDateTime(timestampToDate(createdAt))}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Información no disponible</p>
        )}
      </div>
    </div>
  );
}

interface ResponderCardProps {
  agentName?: string;
  institutionName?: string;
  onReassign: () => void;
}

export function ResponderCard({ agentName, institutionName, onReassign }: ResponderCardProps) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Agente Asignado
        </h4>
      </div>
      <div className="p-6">
        {agentName ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/15 flex items-center justify-center text-sm font-semibold text-info">
                {agentName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-text-primary">{agentName}</p>
                {institutionName && (
                  <p className="text-xs text-text-secondary">{institutionName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onReassign}
              className="text-sm text-primary hover:underline text-left"
            >
              Reasignar a otro agente
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-text-secondary">Sin agente asignado</p>
            <button
              onClick={onReassign}
              className="text-sm text-primary hover:underline text-left"
            >
              Asignar agente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineCardProps {
  statusHistory?: StatusHistoryEntry[];
}

export function TimelineCard({ statusHistory }: TimelineCardProps) {
  const history = statusHistory || [];

  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Historial
        </h4>
      </div>
      <div className="p-6">
        {history.length === 0 ? (
          <p className="text-sm text-text-secondary">Sin historial</p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

            <div className="flex flex-col gap-4">
              {[...history].reverse().map((entry, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 border-surface z-10 mt-0.5 ${
                      i === 0 ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          i === 0 ? 'primary' : 'default'
                        }
                      >
                        {statusLabels[entry.status] || entry.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {formatDateTime(timestampToDate(entry.timestamp))}
                    </p>
                    {entry.agentName && (
                      <p className="text-xs text-text-secondary">
                        Por: {entry.agentName}
                      </p>
                    )}
                    {entry.note && (
                      <p className="text-xs text-text-secondary italic mt-0.5">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
