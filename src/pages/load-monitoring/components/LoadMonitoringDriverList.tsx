import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight, Navigation, Clock } from 'lucide-react';
import { Driver, loadStatusConfig, phaseColors, scheduleStatusLabels } from '../types';

interface LoadMonitoringDriverListProps {
  drivers: Driver[];
  selectedDriver: Driver | null;
  onDriverClick: (driver: Driver) => void;
}

export function LoadMonitoringDriverList({
  drivers,
  selectedDriver,
  onDriverClick
}: LoadMonitoringDriverListProps) {
  return (
    <>
      {drivers.map((driver, index) => {
        const statusConfig = loadStatusConfig[driver.loadStatus];
        const phaseColor = phaseColors[statusConfig.phase];

        return (
          <button
            key={driver.id}
            onClick={() => onDriverClick(driver)}
            className={cn(
              "w-full p-4 border-b border-border/50 text-left hover:bg-secondary/30 transition-all animate-fade-in",
              selectedDriver?.id === driver.id && "bg-primary/10 border-l-4 border-l-primary"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full", phaseColor.bg)} />
                <span className="font-bold">{driver.name}</span>
                <Badge variant={
                  driver.scheduleStatus === 'late' ? 'destructive' :
                  driver.scheduleStatus === 'at-risk' ? 'warning' : 'success'
                }>
                  {scheduleStatusLabels[driver.scheduleStatus]}
                </Badge>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">{driver.vehicle}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Navigation className="h-3 w-3" />
              <span>{driver.pickupLocation.address} → {driver.deliveryLocation.address}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>ETA: {driver.eta}</span>
              </div>
              <Badge variant="outline" className={cn("text-xs", statusConfig.color)}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", phaseColor.bg)}
                style={{ width: `${driver.progress}%` }}
              />
            </div>
          </button>
        );
      })}
    </>
  );
}
