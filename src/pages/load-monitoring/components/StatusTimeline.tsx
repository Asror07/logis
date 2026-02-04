import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import {
  LoadStatus,
  StatusHistoryItem,
  loadStatusConfig,
  phaseColors,
  getStatusIndex
} from '../types';

interface StatusTimelineProps {
  statusHistory: StatusHistoryItem[];
  currentStatus: LoadStatus;
}

export function StatusTimeline({ statusHistory, currentStatus }: StatusTimelineProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const completedStatuses = statusHistory.map(h => h.status);

  const phases = [
    { name: 'Pre-Dispatch', statuses: ['order-created', 'assigned-to-carrier', 'dispatched'] as LoadStatus[] },
    { name: 'Pickup', statuses: ['at-pickup', 'inspection-in-progress', 'picked-up'] as LoadStatus[] },
    { name: 'In Transit', statuses: ['in-transit', 'on-delay', 'at-storage'] as LoadStatus[] },
    { name: 'Delivery', statuses: ['near-delivery', 'at-delivery', 'unloaded', 'delivery-inspection'] as LoadStatus[] },
    { name: 'Post-Delivery', statuses: ['delivered', 'invoiced', 'paid'] as LoadStatus[] }
  ];

  return (
    <div className="space-y-4">
      {phases.map((phase) => {
        const phaseConfig = phaseColors[phase.name as keyof typeof phaseColors];
        const hasCompletedStatuses = phase.statuses.some(s => completedStatuses.includes(s));
        const hasCurrentStatus = phase.statuses.includes(currentStatus);

        return (
          <div key={phase.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", phaseConfig.bg)} />
              <span className={cn("text-xs font-medium", hasCompletedStatuses || hasCurrentStatus ? phaseConfig.text : 'text-muted-foreground')}>
                {phase.name}
              </span>
            </div>
            <div className="ml-4 space-y-1">
              {phase.statuses.map((status) => {
                const config = loadStatusConfig[status];
                const historyItem = statusHistory.find(h => h.status === status);
                const isCompleted = completedStatuses.includes(status);
                const isCurrent = status === currentStatus;
                const StatusIcon = config.icon;

                const statusIndex = getStatusIndex(status);
                const shouldShow = isCompleted || isCurrent || (statusIndex <= currentIndex + 3 && statusIndex > currentIndex);

                if (!shouldShow && !isCompleted) return null;

                return (
                  <div
                    key={status}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-lg transition-all",
                      isCurrent && "bg-primary/10 border border-primary/20",
                      isCompleted && !isCurrent && "opacity-80"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
                      isCompleted ? "bg-green-500" : isCurrent ? "bg-primary animate-pulse" : "bg-muted"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      ) : isCurrent ? (
                        <Circle className="h-3 w-3 text-white" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("h-3.5 w-3.5", isCompleted || isCurrent ? config.color : "text-muted-foreground")} />
                        <span className={cn(
                          "text-sm font-medium",
                          isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {config.label}
                        </span>
                        {isCurrent && (
                          <Badge variant="default" className="text-[10px] h-4 px-1.5">Current</Badge>
                        )}
                      </div>
                      {historyItem && (
                        <div className="mt-1 space-y-0.5">
                          <p className="text-xs text-muted-foreground">{historyItem.timestamp}</p>
                          {historyItem.updatedBy && (
                            <p className="text-xs text-muted-foreground">by {historyItem.updatedBy}</p>
                          )}
                          {historyItem.notes && (
                            <p className="text-xs text-primary/80 italic">{historyItem.notes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
