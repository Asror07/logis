import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Exception } from './types';
import { exceptions } from './data';
import { ExceptionsHeader } from './components/ExceptionsHeader';
import { ExceptionsFilters } from './components/ExceptionsFilters';
import { ExceptionQueue } from './components/ExceptionQueue';
import { ExceptionDetail } from './components/ExceptionDetail';

export default function Exceptions() {
  const [activeTab, setActiveTab] = useState('exceptions');
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { collapsed } = useSidebar();

  const filteredExceptions = exceptions.filter(exc =>
    statusFilter === 'all' || exc.status === statusFilter
  );

  const openCount = exceptions.filter(e => e.status === 'open').length;
  const inProgressCount = exceptions.filter(e => e.status === 'in_progress').length;

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
                background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 84% 60% / 0.3) 0%, transparent 70%)'
              }}
            />
          </div>

          <ExceptionsHeader openCount={openCount} inProgressCount={inProgressCount} />

          <ExceptionsFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExceptionQueue
              exceptions={filteredExceptions}
              selectedExceptionId={selectedException?.id ?? null}
              onSelectException={setSelectedException}
            />
            <ExceptionDetail exception={selectedException} />
          </div>
        </div>
      </main>
    </div>
  );
}
