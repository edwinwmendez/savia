'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface HeatMapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  radius?: number;
  maxOpacity?: number;
}

export function HeatMapLayer({ points, radius = 25, maxOpacity = 0.6 }: HeatMapLayerProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Remove previous overlay
    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
    }

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;

    const overlay = L.DomUtil.create('div', 'leaflet-heatmap-overlay') as HTMLDivElement;

    const CanvasOverlay = L.Layer.extend({
      onAdd(leafletMap: L.Map) {
        const pane = leafletMap.getPane('overlayPane');
        if (pane) {
          pane.appendChild(overlay);
          overlay.appendChild(canvas);
        }
        leafletMap.on('moveend zoomend resize', this._update, this);
        this._update();
      },

      onRemove(leafletMap: L.Map) {
        leafletMap.off('moveend zoomend resize', this._update, this);
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      },

      _update() {
        const size = leafletMap.getSize();
        const topLeft = leafletMap.containerPointToLayerPoint([0, 0]);

        canvas.width = size.x;
        canvas.height = size.y;
        canvas.style.width = `${size.x}px`;
        canvas.style.height = `${size.y}px`;

        L.DomUtil.setPosition(overlay, topLeft);

        drawHeatMap(leafletMap, canvas, points, radius, maxOpacity);
      },
    });

    // Use closure for map reference
    const leafletMap = map;
    const layer = new CanvasOverlay();
    layer.addTo(map);
    overlayRef.current = layer;

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
    };
  }, [map, points, radius, maxOpacity]);

  return null;
}

function drawHeatMap(
  map: L.Map,
  canvas: HTMLCanvasElement,
  points: [number, number, number][],
  radius: number,
  maxOpacity: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw intensity circles
  points.forEach(([lat, lng, intensity]) => {
    const point = map.latLngToContainerPoint([lat, lng]);
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);

    gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * maxOpacity})`);
    gradient.addColorStop(0.4, `rgba(255, 165, 0, ${intensity * maxOpacity * 0.6})`);
    gradient.addColorStop(0.7, `rgba(255, 255, 0, ${intensity * maxOpacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Apply color gradient via imageData for blending
  colorize(ctx, canvas.width, canvas.height);
}

function colorize(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0) continue;

    // Normalize alpha to 0-1
    const ratio = alpha / 255;

    if (ratio < 0.25) {
      // Blue to Cyan
      const t = ratio / 0.25;
      data[i] = 0;
      data[i + 1] = Math.round(t * 255);
      data[i + 2] = 255;
    } else if (ratio < 0.5) {
      // Cyan to Green/Yellow
      const t = (ratio - 0.25) / 0.25;
      data[i] = Math.round(t * 255);
      data[i + 1] = 255;
      data[i + 2] = Math.round((1 - t) * 255);
    } else if (ratio < 0.75) {
      // Yellow to Orange
      const t = (ratio - 0.5) / 0.25;
      data[i] = 255;
      data[i + 1] = Math.round((1 - t * 0.35) * 255);
      data[i + 2] = 0;
    } else {
      // Orange to Red
      const t = (ratio - 0.75) / 0.25;
      data[i] = 255;
      data[i + 1] = Math.round((1 - t) * 165);
      data[i + 2] = 0;
    }

    data[i + 3] = Math.min(alpha * 1.5, 200);
  }

  ctx.putImageData(imageData, 0, 0);
}
