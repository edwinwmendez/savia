'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  exporting: 'pdf' | 'excel' | null;
  disabled?: boolean;
}

export function ExportButtons({
  onExportPDF,
  onExportExcel,
  exporting,
  disabled = false,
}: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={onExportPDF}
        loading={exporting === 'pdf'}
        disabled={disabled || exporting !== null}
      >
        <FileDown className="w-4 h-4" />
        PDF
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onExportExcel}
        loading={exporting === 'excel'}
        disabled={disabled || exporting !== null}
      >
        <FileSpreadsheet className="w-4 h-4" />
        Excel
      </Button>
    </div>
  );
}
