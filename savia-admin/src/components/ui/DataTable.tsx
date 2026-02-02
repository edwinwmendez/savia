'use client';

import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index?: number) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (item: T) => void;
  rowKey?: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  loadingRows = 5,
  emptyMessage = 'No hay datos disponibles',
  emptyDescription,
  emptyIcon,
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-semibold text-text-secondary px-6 py-3"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-bg rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    {emptyIcon || (
                      <Inbox className="w-12 h-12 text-text-secondary/40" />
                    )}
                    <p className="text-sm text-text-secondary">{emptyMessage}</p>
                    {emptyDescription && (
                      <p className="text-xs text-text-secondary/70">{emptyDescription}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item) : index}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-border hover:bg-bg/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {col.render
                        ? col.render(item, index)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
