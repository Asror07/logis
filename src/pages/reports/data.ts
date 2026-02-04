import { BarChart3, PieChart, TrendingUp, Clock, File, FileSpreadsheet, FileText, FileJson } from 'lucide-react';
import { ReportTemplate, RecentReport, ReportType, ReportIcon } from './types';

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Daily Summary',
    description: 'All notifications, deliveries, and exceptions from today',
    type: 'daily',
    lastGenerated: 'Today, 6:00 AM',
    scheduled: true,
    icon: 'clock'
  },
  {
    id: '2',
    name: 'Weekly Performance',
    description: 'Engagement rates, delivery success, and time saved',
    type: 'weekly',
    lastGenerated: 'Dec 16, 2024',
    scheduled: true,
    icon: 'chart'
  },
  {
    id: '3',
    name: 'Monthly Executive',
    description: 'High-level ROI metrics and strategic insights',
    type: 'monthly',
    lastGenerated: 'Nov 30, 2024',
    scheduled: true,
    icon: 'trend'
  },
  {
    id: '4',
    name: 'Exception Analysis',
    description: 'Breakdown of exceptions by type, resolution time, and impact',
    type: 'custom',
    lastGenerated: 'Dec 20, 2024',
    scheduled: false,
    icon: 'pie'
  },
];

export const mockRecentReports: RecentReport[] = [
  { name: 'Weekly Performance - Dec 16-22', date: 'Dec 23, 2024', format: 'PDF', size: '2.4 MB' },
  { name: 'Daily Summary - Dec 22', date: 'Dec 22, 2024', format: 'PDF', size: '856 KB' },
  { name: 'Exception Analysis Q4', date: 'Dec 20, 2024', format: 'Excel', size: '1.8 MB' },
  { name: 'Monthly Executive - November', date: 'Nov 30, 2024', format: 'PDF', size: '3.2 MB' },
];

export const iconMap: Record<ReportIcon, typeof BarChart3> = {
  chart: BarChart3,
  pie: PieChart,
  trend: TrendingUp,
  clock: Clock,
};

export const typeColors: Record<ReportType, string> = {
  daily: 'bg-primary/20 text-primary',
  weekly: 'bg-accent/20 text-accent',
  monthly: 'bg-info/20 text-info',
  custom: 'bg-warning/20 text-warning',
};

export const exportFormats = [
  { key: 'pdf', icon: File, label: 'PDF' },
  { key: 'excel', icon: FileSpreadsheet, label: 'Excel' },
  { key: 'csv', icon: FileText, label: 'CSV' },
  { key: 'json', icon: FileJson, label: 'JSON' },
] as const;