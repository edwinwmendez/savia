'use client';

import { MapPin, Image, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  urgencyLabels,
  urgencyColors,
  statusLabels,
  statusColors,
  alertTypeEmojis,
} from '@/lib/utils';
import type { AlertWithId } from '@/lib/alerts';

const urgencyBorderColors: Record<string, string> = {
  critical: 'border-l-urgency-critical',
  high: 'border-l-urgency-high',
  medium: 'border-l-urgency-medium',
  low: 'border-l-urgency-low',
};

interface AlertHeaderCardProps {
  alert: AlertWithId;
}

export function AlertHeaderCard({ alert }: AlertHeaderCardProps) {
  return (
    <div
      className={`bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 border-l-[6px] ${
        urgencyBorderColors[alert.urgency]
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {alertTypeEmojis[alert.type] || '📋'}
          </span>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              {alert.categoryName || alert.type}
            </h3>
            <p className="text-sm text-text-secondary font-mono">
              {alert.alertCode || alert.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={urgencyColors[alert.urgency] as 'error' | 'warning' | 'success'}>
            {urgencyLabels[alert.urgency]}
          </Badge>
          <Badge variant={statusColors[alert.status] as 'warning' | 'info' | 'primary' | 'success' | 'default'}>
            {statusLabels[alert.status]}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">
        {alert.description}
      </p>
    </div>
  );
}

interface MapCardProps {
  alert: AlertWithId;
}

export function MapCard({ alert }: MapCardProps) {
  const { latitude, longitude } = alert.location;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=16`
    : null;

  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Ubicación
        </h4>
      </div>
      <div className="p-6">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-[350px] rounded-lg border-0 mb-4"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="h-[350px] bg-bg rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
              <p className="text-xs text-text-secondary">
                Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para ver el mapa
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{alert.address || 'Dirección no disponible'}</p>
          <p className="text-xs text-text-secondary font-mono">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver en Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

interface EvidenceCardProps {
  imageUrls: string[];
}

export function EvidenceCard({ imageUrls }: EvidenceCardProps) {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Image className="w-4 h-4 text-primary" />
            Evidencia
          </h4>
        </div>
        <div className="p-6">
          <p className="text-sm text-text-secondary text-center py-4">
            No hay evidencia fotográfica
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Image className="w-4 h-4 text-primary" />
          Evidencia ({imageUrls.length})
        </h4>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-[4/3] rounded-lg bg-bg overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                src={url}
                alt={`Evidencia ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
