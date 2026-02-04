import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportFormat } from '../types';
import { exportFormats } from '../data';

interface QuickExportProps {
  dateRange: { start: string; end: string };
  exportFormat: ExportFormat;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onExportFormatChange: (format: ExportFormat) => void;
}

export function QuickExport({
  dateRange,
  exportFormat,
  onDateRangeChange,
  onExportFormatChange
}: QuickExportProps) {
  return (
    <Card variant="glow">
      <CardHeader>
        <CardTitle>Quick Export</CardTitle>
        <p className="text-sm text-muted-foreground">Export data in various formats</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                className="w-full h-10 pl-10 pr-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                className="w-full h-10 pl-10 pr-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <div className="grid grid-cols-2 gap-2">
            {exportFormats.map((format) => {
              const FormatIcon = format.icon;
              return (
                <button
                  key={format.key}
                  onClick={() => onExportFormatChange(format.key as ExportFormat)}
                  className={cn(
                    "p-3 rounded-lg border transition-all flex items-center gap-2",
                    exportFormat === format.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <FormatIcon className="h-4 w-4" />
                  <span className="font-medium">{format.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Button */}
        <Button className="w-full" variant="gradient">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>

        {/* Schedule */}
        <Button variant="outline" className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </CardContent>
    </Card>
  );
}