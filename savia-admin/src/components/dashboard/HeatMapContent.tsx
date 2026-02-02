'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatMapLayer } from './HeatMapLayer';
import type { AlertData } from '@/types';

interface HeatMapContentProps {
  alerts: AlertData[];
}

const ATALAYA_CENTER: [number, number] = [-10.7291, -73.7538];
const DEFAULT_ZOOM = 13;

export function HeatMapContent({ alerts }: HeatMapContentProps) {
  const points = alertsToHeatPoints(alerts);

  return (
    <MapContainer
      center={ATALAYA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '320px', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 0 && <HeatMapLayer points={points} />}
    </MapContainer>
  );
}

function alertsToHeatPoints(alerts: AlertData[]): [number, number, number][] {
  return alerts
    .filter((a) => a.location?.latitude && a.location?.longitude)
    .map((a) => {
      const intensity = urgencyToIntensity(a.urgency);
      return [a.location.latitude, a.location.longitude, intensity] as [number, number, number];
    });
}

function urgencyToIntensity(urgency: string): number {
  switch (urgency) {
    case 'critical':
      return 1.0;
    case 'high':
      return 0.75;
    case 'medium':
      return 0.5;
    case 'low':
      return 0.3;
    default:
      return 0.3;
  }
}
