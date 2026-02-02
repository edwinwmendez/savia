import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { ReportData, DateRange, ChartDataItem, TrendDataItem } from '@/types';

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fileDate(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

export function formatResponseTime(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  }
  const d = Math.floor(minutes / 1440);
  const h = Math.round((minutes % 1440) / 60);
  return `${d}d ${h}h`;
}

function toDateString(timestamp: unknown): string {
  if (!timestamp) return '-';
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    return (timestamp as { toDate: () => Date }).toDate().toLocaleString('es-PE');
  }
  return new Date(timestamp as string).toLocaleString('es-PE');
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

const URGENCY_LABELS: Record<string, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

// ═══════════════════════════════════════════════════════════════════════════════
// Canvas Chart Engine — renders charts as high-quality PNG images
// ═══════════════════════════════════════════════════════════════════════════════

const PX = 8; // 8 canvas pixels per mm for crisp rendering
const FT = 'Helvetica, Arial, sans-serif';
const PALETTE = ['#1976D2', '#D32F2F', '#F57C00', '#4CAF50', '#9C27B0', '#009688', '#FFC107', '#607D8B'];

function clr(item: ChartDataItem, i: number): string {
  return item.color || PALETTE[i % PALETTE.length];
}

function mkCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = Math.round(w * PX);
  c.height = Math.round(h * PX);
  const ctx = c.getContext('2d')!;
  ctx.scale(PX, PX);
  return [c, ctx];
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0) { ctx.rect(x, y, w, h); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function rrTop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function rrRight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * exp;
}

function trunc(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '..').width > maxW) t = t.slice(0, -1);
  return t + '..';
}

function emptyChart(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#FAFAFA';
  rr(ctx, 0, 0, w, h, 2); ctx.fill();
  ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 0.2;
  rr(ctx, 0, 0, w, h, 2); ctx.stroke();
  ctx.fillStyle = '#BDBDBD';
  ctx.font = `3px ${FT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Sin datos', w / 2, h / 2);
}

function chartBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, 0, 0, w, h, 2); ctx.fill();
  ctx.strokeStyle = '#EBEBEB'; ctx.lineWidth = 0.15;
  rr(ctx, 0, 0, w, h, 2); ctx.stroke();
}

// ─── Vertical Bar Chart ─────────────────────────────────────────────────────

function renderBarChart(data: ChartDataItem[], w: number, h: number): string {
  const [canvas, ctx] = mkCanvas(w, h);
  if (!data.length) { emptyChart(ctx, w, h); return canvas.toDataURL('image/png'); }

  const pL = 9, pR = 3, pT = 5, pB = 16;
  const cW = w - pL - pR, cH = h - pT - pB;
  const mx = niceMax(Math.max(...data.map(d => d.value)));

  chartBg(ctx, w, h);

  // Grid
  for (let i = 0; i <= 4; i++) {
    const gy = pT + cH - (cH / 4) * i;
    ctx.strokeStyle = '#EEEEEE'; ctx.lineWidth = 0.15;
    ctx.setLineDash([1, 1]);
    ctx.beginPath(); ctx.moveTo(pL, gy); ctx.lineTo(pL + cW, gy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#9E9E9E'; ctx.font = `2.2px ${FT}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(String(Math.round((mx / 4) * i)), pL - 1.5, gy);
  }

  // Bars
  const gap = Math.max(1.5, cW * 0.04);
  const barW = Math.min(14, (cW - gap * (data.length + 1)) / data.length);
  const totalW = data.length * barW + (data.length - 1) * gap;
  const ox = pL + (cW - totalW) / 2;

  data.forEach((item, i) => {
    const x = ox + i * (barW + gap);
    const bH = Math.max(0.5, (item.value / mx) * cH);
    const y = pT + cH - bH;

    ctx.fillStyle = clr(item, i);
    rrTop(ctx, x, y, barW, bH, 1.2); ctx.fill();

    ctx.fillStyle = '#212121'; ctx.font = `bold 2.5px ${FT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(String(item.value), x + barW / 2, y - 0.8);

    ctx.save();
    ctx.translate(x + barW / 2, pT + cH + 1.5);
    ctx.rotate(-0.35);
    ctx.fillStyle = '#616161'; ctx.font = `2px ${FT}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText(trunc(ctx, item.name, 20), 0, 0);
    ctx.restore();
  });

  return canvas.toDataURL('image/png');
}

// ─── Donut Chart ────────────────────────────────────────────────────────────

function renderDonut(data: ChartDataItem[], w: number, h: number, total: number): string {
  const [canvas, ctx] = mkCanvas(w, h);
  if (!data.length || !total) { emptyChart(ctx, w, h); return canvas.toDataURL('image/png'); }

  chartBg(ctx, w, h);

  const legendH = Math.ceil(data.length / 2) * 5 + 3;
  const cx = w / 2, cy = (h - legendH) / 2 + 1;
  const outerR = Math.min((h - legendH - 6) / 2, w / 2 - 16);
  const innerR = outerR * 0.58;

  // Slices with smooth arcs
  let angle = -Math.PI / 2;
  const mids: { mid: number; pct: number }[] = [];

  data.forEach((item, i) => {
    const sweep = (item.value / total) * Math.PI * 2;
    const end = angle + sweep;
    mids.push({ mid: angle + sweep / 2, pct: (item.value / total) * 100 });

    ctx.fillStyle = clr(item, i);
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, angle, end);
    ctx.arc(cx, cy, innerR, end, angle, true);
    ctx.closePath();
    ctx.fill();
    angle = end;
  });

  // White gaps between slices
  angle = -Math.PI / 2;
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 0.6;
  data.forEach((item) => {
    ctx.beginPath();
    ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
    ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
    ctx.stroke();
    angle += (item.value / total) * Math.PI * 2;
  });

  // Center text
  ctx.fillStyle = '#212121'; ctx.font = `bold 6px ${FT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(total), cx, cy - 1.5);
  ctx.fillStyle = '#757575'; ctx.font = `2.3px ${FT}`;
  ctx.fillText('alertas', cx, cy + 3);

  // Percentage labels outside
  mids.forEach(s => {
    if (s.pct < 5) return;
    const lr = outerR + 4;
    const lx = cx + lr * Math.cos(s.mid);
    const ly = cy + lr * Math.sin(s.mid);
    ctx.fillStyle = '#424242'; ctx.font = `bold 2.2px ${FT}`;
    ctx.textAlign = Math.cos(s.mid) >= 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(s.pct)}%`, lx, ly);
  });

  // Legend
  const ly0 = h - legendH + 1;
  const colW = w / 2;
  data.forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const lx = col * colW + 5, ly = ly0 + row * 5;
    ctx.fillStyle = clr(item, i);
    ctx.beginPath(); ctx.arc(lx + 1.2, ly + 1.2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#424242'; ctx.font = `2.2px ${FT}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(trunc(ctx, `${item.name} (${item.value})`, colW - 10), lx + 3.5, ly + 1.2);
  });

  return canvas.toDataURL('image/png');
}

// ─── Horizontal Bar Chart ───────────────────────────────────────────────────

function renderHBarChart(data: ChartDataItem[], w: number, h: number, total: number): string {
  const [canvas, ctx] = mkCanvas(w, h);
  if (!data.length) { emptyChart(ctx, w, h); return canvas.toDataURL('image/png'); }

  chartBg(ctx, w, h);

  ctx.font = `2.5px ${FT}`;
  let maxLblW = 0;
  data.forEach(d => { const tw = ctx.measureText(d.name).width; if (tw > maxLblW) maxLblW = tw; });
  const labelW = Math.min(maxLblW + 3, w * 0.35);

  const pR = 18, pT = 4, pB = 4;
  const barAreaW = w - labelW - pR;
  const gap = 2.5;
  const barH = Math.max(4, Math.min(7, (h - pT - pB - (data.length - 1) * gap) / data.length));
  const totalH = data.length * barH + (data.length - 1) * gap;
  const startY = pT; // top-aligned, not centered
  const maxVal = Math.max(...data.map(d => d.value), 1);

  data.forEach((item, i) => {
    const y = startY + i * (barH + gap);
    const bW = Math.max(1, (item.value / maxVal) * barAreaW);
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';

    ctx.fillStyle = '#424242'; ctx.font = `2.5px ${FT}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(trunc(ctx, item.name, labelW - 2), labelW - 1.5, y + barH / 2);

    ctx.fillStyle = '#F0F0F0';
    rr(ctx, labelW, y, barAreaW, barH, 1.2); ctx.fill();

    ctx.fillStyle = clr(item, i);
    if (bW > 2.4) { rrRight(ctx, labelW, y, bW, barH, 1.2); } else { ctx.beginPath(); ctx.rect(labelW, y, bW, barH); }
    ctx.fill();

    ctx.fillStyle = '#424242'; ctx.font = `bold 2.2px ${FT}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(`${item.value} (${pct}%)`, labelW + barAreaW + 1.5, y + barH / 2);
  });

  return canvas.toDataURL('image/png');
}

// ─── Line Chart with Area Fill ──────────────────────────────────────────────

function renderLineChart(trend: TrendDataItem[], w: number, h: number): string {
  const [canvas, ctx] = mkCanvas(w, h);
  if (!trend.length) { emptyChart(ctx, w, h); return canvas.toDataURL('image/png'); }

  const pL = 10, pR = 4, pT = 5, pB = 12;
  const cW = w - pL - pR, cH = h - pT - pB;
  const mx = niceMax(Math.max(...trend.map(t => t.count)));

  chartBg(ctx, w, h);

  // Grid
  for (let i = 0; i <= 4; i++) {
    const gy = pT + cH - (cH / 4) * i;
    ctx.strokeStyle = '#EEEEEE'; ctx.lineWidth = 0.15;
    ctx.setLineDash([1, 1]);
    ctx.beginPath(); ctx.moveTo(pL, gy); ctx.lineTo(pL + cW, gy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#9E9E9E'; ctx.font = `2px ${FT}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(String(Math.round((mx / 4) * i)), pL - 1.5, gy);
  }

  // Data points
  const pts = trend.map((t, i) => ({
    x: pL + (trend.length === 1 ? cW / 2 : (i / (trend.length - 1)) * cW),
    y: pT + cH - (t.count / mx) * cH,
  }));

  if (pts.length > 1) {
    // Area gradient fill
    const grad = ctx.createLinearGradient(0, pT, 0, pT + cH);
    grad.addColorStop(0, 'rgba(25, 118, 210, 0.18)');
    grad.addColorStop(1, 'rgba(25, 118, 210, 0.02)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pT + cH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pT + cH);
    ctx.closePath();
    ctx.fill();

    // Line
    ctx.strokeStyle = '#1976D2'; ctx.lineWidth = 0.7;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // Dots
    pts.forEach(p => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1976D2';
      ctx.beginPath(); ctx.arc(p.x, p.y, 0.6, 0, Math.PI * 2); ctx.fill();
    });
  } else {
    ctx.fillStyle = '#1976D2';
    ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 1.2, 0, Math.PI * 2); ctx.fill();
  }

  // X labels
  const maxLabels = Math.min(trend.length, 12);
  const step = Math.max(1, Math.floor(trend.length / maxLabels));
  ctx.fillStyle = '#9E9E9E'; ctx.font = `1.8px ${FT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let i = 0; i < trend.length; i += step) {
    let lbl = trend[i].date;
    if (lbl.length === 10) lbl = lbl.substring(5);
    else if (lbl.length === 7) lbl = lbl.substring(2);
    ctx.fillText(lbl, pts[i].x, pT + cH + 1.5);
  }

  return canvas.toDataURL('image/png');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF Layout Helpers
// ═══════════════════════════════════════════════════════════════════════════════

type RGB = [number, number, number];

const C = {
  navy: [27, 42, 74] as RGB,
  primary: [25, 118, 210] as RGB,
  white: [255, 255, 255] as RGB,
  text: [33, 33, 33] as RGB,
  muted: [117, 117, 117] as RGB,
  border: [224, 224, 224] as RGB,
  success: [76, 175, 80] as RGB,
  warning: [255, 152, 0] as RGB,
  teal: [0, 150, 136] as RGB,
};

const URGENCY_RGB: Record<string, RGB> = {
  critical: [211, 47, 47], high: [245, 124, 0], medium: [251, 192, 45], low: [56, 142, 60],
};
const STATUS_RGB: Record<string, RGB> = {
  pending: [255, 152, 0], assigned: [33, 150, 243], in_progress: [25, 118, 210],
  resolved: [76, 175, 80], cancelled: [158, 158, 158],
};

function pdfHeader(doc: jsPDF, dateRange: DateRange): number {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, pw, 18, 'F');
  doc.setFillColor(...C.primary);
  doc.rect(0, 18, pw, 1.2, 'F');

  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(...C.white);
  doc.text('SAVIA', 12, 8);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.setTextColor(180, 200, 230);
  doc.text('Sistema de Alertas Vecinales — Reporte Estadistico', 12, 14);

  doc.setFontSize(8); doc.setTextColor(...C.white);
  doc.text(`Periodo: ${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`, pw - 12, 8, { align: 'right' });
  doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, pw - 12, 14, { align: 'right' });

  return 19.2;
}

function pdfMiniHeader(doc: jsPDF, subtitle: string): number {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, pw, 12, 'F');
  doc.setFillColor(...C.primary);
  doc.rect(0, 12, pw, 0.8, 'F');

  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...C.white);
  doc.text('SAVIA', 12, 8);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(180, 200, 230);
  doc.text(subtitle, 38, 8);

  return 12.8;
}

function pdfFooter(doc: jsPDF, page: number, total: number) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const y = ph - 7;
  doc.setDrawColor(...C.border); doc.setLineWidth(0.2);
  doc.line(12, y - 1.5, pw - 12, y - 1.5);
  doc.setFontSize(6.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
  doc.text('SAVIA — Sistema de Alertas Vecinales Integrado de Atalaya', 12, y + 1);
  doc.text(`Pagina ${page} de ${total}`, pw - 12, y + 1, { align: 'right' });
}

function pdfSectionTitle(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFillColor(...C.primary);
  doc.rect(x, y - 3.5, 2, 5, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...C.text);
  doc.text(title, x + 4.5, y);
  return y + 3;
}

function pdfKPIs(doc: jsPDF, summary: ReportData['summary'], y: number): number {
  const pw = doc.internal.pageSize.getWidth();
  const m = 12, gap = 5;
  const cardW = (pw - m * 2 - gap * 3) / 4;
  const cardH = 20;

  const items: { label: string; value: string; color: RGB }[] = [
    { label: 'Total Alertas', value: String(summary.totalAlerts), color: C.primary },
    { label: 'Tasa Resolucion', value: `${summary.resolutionRate}%`, color: C.success },
    { label: 'Tiempo Prom. Respuesta', value: formatResponseTime(summary.avgResponseTimeMinutes), color: C.warning },
    { label: 'Alertas / Dia', value: String(summary.alertsPerDay), color: C.teal },
  ];

  items.forEach((kpi, i) => {
    const x = m + i * (cardW + gap);

    // Card bg
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, y, cardW, cardH, 1.5, 1.5, 'F');

    // Top colored bar
    doc.setFillColor(...kpi.color);
    doc.roundedRect(x, y, cardW, 2.5, 1.5, 1.5, 'F');
    doc.rect(x, y + 1.2, cardW, 1.3, 'F');

    // Value
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...kpi.color);
    doc.text(kpi.value, x + cardW / 2, y + 11, { align: 'center' });

    // Label
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...C.muted);
    doc.text(kpi.label, x + cardW / 2, y + 17, { align: 'center' });
  });

  return y + cardH + 4;
}

// ═══════════════════════════════════════════════════════════════════════════════
// exportToPDF — main function
// ═══════════════════════════════════════════════════════════════════════════════

export function exportToPDF(data: ReportData, dateRange: DateRange): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth(); // 297
  const ph = doc.internal.pageSize.getHeight(); // 210
  const m = 12; // margin
  const contentW = pw - m * 2; // 273

  // Pre-render all charts as canvas images with DYNAMIC heights
  const chartW = (contentW - 6) / 2; // ~133.5mm each
  const trendW = contentW;
  const trendH = 65;

  // Row 1 height: bar chart + donut (donut needs legend space)
  const donutLegendH = Math.ceil(data.alertsByStatus.length / 2) * 5 + 3;
  const row1H = Math.max(48, 38 + donutLegendH);

  // Row 2 height: dynamic based on number of h-bar items
  const hbarNatH = (n: number) => n * 9.5 + 10;
  const row2MinH = Math.max(20, hbarNatH(Math.max(data.alertsByUrgency.length, data.alertsByInstitution.length)));

  // Distribute leftover space (capped to avoid over-stretching)
  const fixedH = 19.2 + 4 + 24 + 8 + 3 + row1H + 10 + 3 + row2MinH + 10;
  const spare = Math.max(0, ph - fixedH);
  const row2H = Math.min(row2MinH + spare * 0.35, 55);
  const row1Final = Math.min(row1H + spare * 0.45, 70);

  const imgType = renderBarChart(data.alertsByType, chartW, row1Final);
  const imgStatus = renderDonut(data.alertsByStatus, chartW, row1Final, data.summary.totalAlerts);
  const imgUrgency = renderHBarChart(data.alertsByUrgency, chartW, row2H, data.summary.totalAlerts);
  const imgInstitution = renderHBarChart(data.alertsByInstitution, chartW, row2H, data.summary.totalAlerts);
  const imgTrend = renderLineChart(data.trend, trendW, trendH);

  // ── PAGE 1: Dashboard Overview ──────────────────────────────────────────
  let y = pdfHeader(doc, dateRange);
  y += 4;
  y = pdfKPIs(doc, data.summary, y);
  y += 8; // generous gap before charts

  // Row 1: Type + Status
  const leftX = m, rightX = m + chartW + 6;
  const row1Y = pdfSectionTitle(doc, 'Alertas por Tipo', leftX, y);
  pdfSectionTitle(doc, 'Alertas por Estado', rightX, y);
  doc.addImage(imgType, 'PNG', leftX, row1Y, chartW, row1Final);
  doc.addImage(imgStatus, 'PNG', rightX, row1Y, chartW, row1Final);

  // Row 2: Urgency + Institution — proper gap from row 1
  const row2LabelY = row1Y + row1Final + 10;
  const row2Y = pdfSectionTitle(doc, 'Alertas por Urgencia', leftX, row2LabelY);
  pdfSectionTitle(doc, 'Alertas por Institucion', rightX, row2LabelY);
  doc.addImage(imgUrgency, 'PNG', leftX, row2Y, chartW, row2H);
  doc.addImage(imgInstitution, 'PNG', rightX, row2Y, chartW, row2H);

  // ── PAGE 2: Trend + Zones ──────────────────────────────────────────────
  doc.addPage();
  y = pdfMiniHeader(doc, 'Tendencia y Zonas');
  y += 4;

  y = pdfSectionTitle(doc, 'Tendencia de Alertas', m, y);
  doc.addImage(imgTrend, 'PNG', m, y, trendW, trendH);
  y += trendH + 5;

  y = pdfSectionTitle(doc, 'Top 10 Zonas con Mayor Incidencia', m, y);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Zona', 'Alertas', '% del Total']],
    body: data.topZones.map((zone, i) => [
      String(i + 1), zone.address, String(zone.count), `${zone.percentage}%`,
    ]),
    headStyles: {
      fillColor: [C.navy[0], C.navy[1], C.navy[2]],
      textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 249, 251] },
    theme: 'plain',
    margin: { left: m, right: m },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold', textColor: [C.primary[0], C.primary[1], C.primary[2]] },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 20, halign: 'center' },
    },
  });

  // ── PAGE 3+: Detail Table ──────────────────────────────────────────────
  doc.addPage();
  y = pdfMiniHeader(doc, 'Detalle de Alertas');
  y += 2;
  y = pdfSectionTitle(doc, `Detalle de Alertas (${data.rawAlerts.length} registros)`, m, y);

  autoTable(doc, {
    startY: y,
    head: [['Codigo', 'Tipo', 'Urgencia', 'Estado', 'Direccion', 'Institucion', 'Fecha']],
    body: data.rawAlerts.map((alert) => [
      alert.alertCode || '-',
      alert.categoryName || alert.type,
      URGENCY_LABELS[alert.urgency] || alert.urgency,
      STATUS_LABELS[alert.status] || alert.status,
      alert.address?.substring(0, 45) || '-',
      alert.assignedInstitutionName || 'Sin asignar',
      toDateString(alert.createdAt),
    ]),
    headStyles: {
      fillColor: [C.navy[0], C.navy[1], C.navy[2]],
      textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7 },
    alternateRowStyles: { fillColor: [248, 249, 251] },
    theme: 'plain',
    margin: { left: m, right: m, top: 18 },
    showHead: 'everyPage',
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 28 },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 30 },
      6: { cellWidth: 34 },
    },
    didParseCell(hookData) {
      if (hookData.section !== 'body') return;
      const raw = hookData.cell.raw as string;
      if (hookData.column.index === 2) {
        const key = Object.entries(URGENCY_LABELS).find(([, v]) => v === raw)?.[0];
        if (key && URGENCY_RGB[key]) {
          hookData.cell.styles.textColor = [...URGENCY_RGB[key]];
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
      if (hookData.column.index === 3) {
        const key = Object.entries(STATUS_LABELS).find(([, v]) => v === raw)?.[0];
        if (key && STATUS_RGB[key]) {
          hookData.cell.styles.textColor = [...STATUS_RGB[key]];
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage(hookData) {
      // Mini header on overflow pages
      if (hookData.pageNumber > 1) {
        const dpw = doc.internal.pageSize.getWidth();
        doc.setFillColor(...C.navy); doc.rect(0, 0, dpw, 12, 'F');
        doc.setFillColor(...C.primary); doc.rect(0, 12, dpw, 0.8, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...C.white);
        doc.text('SAVIA', 12, 8);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(180, 200, 230);
        doc.text('Detalle de Alertas (continuacion)', 38, 8);
      }
    },
  });

  // Footers on every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    pdfFooter(doc, p, totalPages);
  }

  doc.save(`SAVIA_Reporte_${fileDate()}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// exportToExcel — unchanged
// ═══════════════════════════════════════════════════════════════════════════════

export function exportToExcel(data: ReportData, dateRange: DateRange): void {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen
  const summaryData = [
    ['SAVIA - Reporte Estadistico'],
    [`Periodo: ${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`],
    [],
    ['Indicador', 'Valor'],
    ['Total Alertas', data.summary.totalAlerts],
    ['Tasa de Resolucion', `${data.summary.resolutionRate}%`],
    ['Tiempo Prom. Respuesta', formatResponseTime(data.summary.avgResponseTimeMinutes)],
    ['Alertas por Dia', data.summary.alertsPerDay],
    [],
    ['Alertas por Tipo'],
    ['Tipo', 'Cantidad', '% del Total'],
    ...data.alertsByType.map((item) => [
      item.name,
      item.value,
      `${data.summary.totalAlerts > 0 ? ((item.value / data.summary.totalAlerts) * 100).toFixed(1) : 0}%`,
    ]),
    [],
    ['Alertas por Estado'],
    ['Estado', 'Cantidad', '% del Total'],
    ...data.alertsByStatus.map((item) => [
      item.name,
      item.value,
      `${data.summary.totalAlerts > 0 ? ((item.value / data.summary.totalAlerts) * 100).toFixed(1) : 0}%`,
    ]),
    [],
    ['Alertas por Urgencia'],
    ['Urgencia', 'Cantidad'],
    ...data.alertsByUrgency.map((item) => [item.name, item.value]),
    [],
    ['Alertas por Institucion'],
    ['Institucion', 'Cantidad'],
    ...data.alertsByInstitution.map((item) => [item.name, item.value]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

  // Hoja 2: Tendencia
  const trendData = [['Fecha', 'Cantidad'], ...data.trend.map((t) => [t.date, t.count])];
  const ws2 = XLSX.utils.aoa_to_sheet(trendData);
  ws2['!cols'] = [{ wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Tendencia');

  // Hoja 3: Zonas
  const zonesData = [
    ['#', 'Zona', 'Alertas', '% del Total'],
    ...data.topZones.map((z, i) => [i + 1, z.address, z.count, `${z.percentage}%`]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(zonesData);
  ws3['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 10 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Zonas');

  // Hoja 4: Detalle Alertas
  const detailData = [
    ['Codigo', 'Tipo', 'Urgencia', 'Estado', 'Direccion', 'Institucion', 'Fecha Creacion', 'Fecha Resolucion'],
    ...data.rawAlerts.map((alert) => [
      alert.alertCode || '-',
      alert.categoryName || alert.type,
      URGENCY_LABELS[alert.urgency] || alert.urgency,
      STATUS_LABELS[alert.status] || alert.status,
      alert.address || '-',
      alert.assignedInstitutionName || 'Sin asignar',
      toDateString(alert.createdAt),
      alert.resolvedAt ? toDateString(alert.resolvedAt) : '-',
    ]),
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(detailData);
  ws4['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 10 },
    { wch: 12 },
    { wch: 40 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, ws4, 'Detalle Alertas');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `SAVIA_Reporte_${fileDate()}.xlsx`);
}
