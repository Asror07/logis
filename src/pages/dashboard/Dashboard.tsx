import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { CommunicationChart } from '@/components/dashboard/CommunicationChart';
import { ExceptionPanel } from '@/components/dashboard/ExceptionPanel';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('admin');
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Hero gradient background */}
          <div className={cn("absolute top-16 right-0 h-64 pointer-events-none overflow-hidden", collapsed ? "left-16" : "left-64")}>
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 99% 64% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* Page title */}
          <div className="relative">
            <h1 className="text-3xl font-bold">Admin Control Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of your communication system</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <StatCard
              title="Active Loads"
              value={847}
              icon={Truck}
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />
            <StatCard
              title="Pending Jobs"
              value={234}
              icon={Clock}
              trend={{ value: 5, isPositive: false }}
              delay={100}
            />
            <StatCard
              title="Exception Jobs"
              value={18}
              icon={AlertTriangle}
              trend={{ value: 3, isPositive: false }}
              delay={200}
            />
            <StatCard
              title="Completed Jobs"
              value={1542}
              icon={CheckCircle}
              trend={{ value: 15, isPositive: true }}
              delay={300}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <CommunicationChart />
            <div className="space-y-6">
              <QuickActions />
              <SystemHealth />
            </div>
          </div>

          {/* Exceptions and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <ExceptionPanel className="lg:col-span-2" expanded />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
