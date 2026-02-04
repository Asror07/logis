export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReportIcon = 'chart' | 'pie' | 'trend' | 'clock';
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  lastGenerated: string;
  scheduled: boolean;
  icon: ReportIcon;
}

export interface RecentReport {
  name: string;
  date: string;
  format: string;
  size: string;
}