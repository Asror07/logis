import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import {
  weeklyData,
  channelPerformance,
  updateTypeData,
  pieData,
  roiMetrics
} from './data';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { ROIMetricsCards } from './components/ROIMetricsCards';
import { WeeklyTrendsChart } from './components/WeeklyTrendsChart';
import { ChannelDistributionChart } from './components/ChannelDistributionChart';
import { ChannelPerformanceTable } from './components/ChannelPerformanceTable';
import { UpdateTypeChart } from './components/UpdateTypeChart';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeRange, setTimeRange] = useState('month');
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
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(20 95% 58% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* Page Header */}
          <AnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />

          {/* ROI Calculator */}
          <ROIMetricsCards metrics={roiMetrics} />

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WeeklyTrendsChart data={weeklyData} />
            <ChannelDistributionChart data={pieData} />
          </div>

          {/* Channel Performance Table */}
          <ChannelPerformanceTable data={channelPerformance} />

          {/* Update Type Performance */}
          <UpdateTypeChart data={updateTypeData} />
        </div>
      </main>
    </div>
  );
}
