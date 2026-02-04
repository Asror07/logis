import { LucideIcon } from 'lucide-react';

export interface WeeklyDataItem {
  week: string;
  notifications: number;
  engagement: number;
}

export interface ChannelPerformanceItem {
  channel: string;
  delivered: number;
  opened: number;
  clicked: number;
  satisfaction: number;
}

export interface UpdateTypeItem {
  type: string;
  volume: number;
  engagement: number;
  satisfaction: number;
}

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export interface ROIMetric {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend: number;
}
