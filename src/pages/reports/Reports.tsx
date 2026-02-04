import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

import { ReportTemplate, ExportFormat } from './types';
import { mockReportTemplates, mockRecentReports } from './data';
import { ReportsHeader } from './components/ReportsHeader';
import { ReportTemplates } from './components/ReportTemplates';
import { QuickExport } from './components/QuickExport';
import { RecentReports } from './components/RecentReports';
import { ApiEndpoints } from './components/ApiEndpoints';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState({ start: '2024-12-01', end: '2024-12-23' });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <Header />

        <div className="p-6 space-y-6">
          {/* Hero gradient */}
          <div className={cn("absolute top-16 right-0 h-64 pointer-events-none overflow-hidden", collapsed ? "left-16" : "left-64")}>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(200 80% 55% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          <ReportsHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ReportTemplates
              templates={mockReportTemplates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />

            <QuickExport
              dateRange={dateRange}
              exportFormat={exportFormat}
              onDateRangeChange={setDateRange}
              onExportFormatChange={setExportFormat}
            />
          </div>

          <RecentReports reports={mockRecentReports} />

          <ApiEndpoints />
        </div>
      </main>
    </div>
  );
}
