import { Clock, PhoneOff, TrendingUp } from 'lucide-react';
import {
  WeeklyDataItem,
  ChannelPerformanceItem,
  UpdateTypeItem,
  PieDataItem,
  ROIMetric
} from './types';

export const weeklyData: WeeklyDataItem[] = [
  { week: 'Week 1', notifications: 42500, engagement: 68 },
  { week: 'Week 2', notifications: 45200, engagement: 71 },
  { week: 'Week 3', notifications: 48100, engagement: 69 },
  { week: 'Week 4', notifications: 52400, engagement: 74 },
];

export const channelPerformance: ChannelPerformanceItem[] = [
  { channel: 'SMS', delivered: 98.5, opened: 72, clicked: 45, satisfaction: 4.2 },
  { channel: 'Email', delivered: 99.2, opened: 58, clicked: 32, satisfaction: 4.0 },
  { channel: 'Call', delivered: 95.8, opened: 82, clicked: 51, satisfaction: 4.4 },
];

export const updateTypeData: UpdateTypeItem[] = [
  { type: 'Pickup Complete', volume: 12450, engagement: 78, satisfaction: 4.5 },
  { type: 'In Transit', volume: 28340, engagement: 65, satisfaction: 4.2 },
  { type: 'ETA Update', volume: 15670, engagement: 82, satisfaction: 4.6 },
  { type: 'Delivery Complete', volume: 11230, engagement: 88, satisfaction: 4.8 },
  { type: 'Exception Alert', volume: 3420, engagement: 95, satisfaction: 4.1 },
  { type: 'Payment Status', volume: 8760, engagement: 71, satisfaction: 4.0 },
];

export const pieData: PieDataItem[] = [
  { name: 'SMS', value: 45, color: 'hsl(0, 99%, 64%)' },
  { name: 'Email', value: 35, color: 'hsl(20, 95%, 58%)' },
  { name: 'Call', value: 20, color: 'hsl(35, 95%, 55%)' },
];

export const roiMetrics: ROIMetric[] = [
  { label: 'Time Saved', value: '234 hrs', subtext: 'This month', icon: Clock, trend: 15 },
  { label: 'Calls Reduced', value: '78%', subtext: 'Inbound calls', icon: PhoneOff, trend: 8 },
  { label: 'CSAT Improvement', value: '+35%', subtext: 'vs baseline', icon: TrendingUp, trend: 12 },
];
