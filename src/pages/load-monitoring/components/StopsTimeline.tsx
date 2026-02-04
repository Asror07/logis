import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, MapPin, Package, Clock, AlertTriangle, FileCheck } from 'lucide-react';
import { Trip, TripStop, stopStatusConfig, getUnitsForStop } from '../types';
import { ProofOfDelivery } from './ProofOfDelivery';

interface StopsTimelineProps {
  trip: Trip;
  onStopComplete?: (stopOrder: number, podData: any) => void;
}

export function StopsTimeline({ trip, onStopComplete }: StopsTimelineProps) {
  const [podOpen, setPodOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);

  const handleOpenPOD = (stop: TripStop) => {
    setSelectedStop(stop);
    setPodOpen(true);
  };

  const handleCompletePOD = (stopOrder: number, podData: any) => {
    if (onStopComplete) {
      onStopComplete(stopOrder, podData);
    }
  };

  return (
    <>
      <div className="space-y-1">
        {trip.stops.map((stop, index) => {
          const isCompleted = stop.status === 'completed';
          const isCurrent = stop.status === 'in-progress';
          const isPending = stop.status === 'pending';
          const isLast = index === trip.stops.length - 1;
          const units = getUnitsForStop(trip, stop.order);
          const statusConfig = stopStatusConfig[stop.status];
          const isDeliveryStop = stop.type === 'delivery';

          return (
            <div key={stop.order} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[14px] top-[32px] w-0.5 h-[calc(100%-16px)]",
                    isCompleted ? "bg-green-500" : "bg-border"
                  )}
                />
              )}

              <div
                className={cn(
                  "flex gap-3 p-3 rounded-lg transition-all",
                  isCurrent && "bg-primary/10 border border-primary/20",
                  isCompleted && "opacity-90"
                )}
              >
                {/* Status Indicator */}
                <div className="flex-shrink-0 pt-0.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold",
                      isCompleted ? "bg-green-500" : isCurrent ? "bg-orange-500 animate-pulse" : "bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : stop.type === 'pickup' ? (
                      'P'
                    ) : (
                      index
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm",
                          isPending && "text-muted-foreground"
                        )}>
                          {stop.location.name}
                        </span>
                        {isCurrent && (
                          <Badge variant="default" className="text-[10px] h-4 px-1.5">Current</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        <span>{stop.location.address}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] flex-shrink-0", statusConfig.color)}
                    >
                      {stop.type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </Badge>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {isCompleted && stop.actualArrival
                          ? `Arrived: ${stop.actualArrival}`
                          : `Scheduled: ${stop.scheduledTime}`}
                      </span>
                    </div>
                    {isCompleted && stop.actualDeparture && (
                      <span className="text-muted-foreground">
                        Departed: {stop.actualDeparture}
                      </span>
                    )}
                  </div>

                  {/* Units */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Package className="h-3 w-3" />
                      <span>
                        {units.length} unit{units.length !== 1 ? 's' : ''} to {stop.type === 'pickup' ? 'load' : 'deliver'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {units.slice(0, 3).map(unit => (
                        <Badge key={unit.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {unit.year} {unit.make} {unit.model}
                        </Badge>
                      ))}
                      {units.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          +{units.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {stop.notes && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-orange-400">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{stop.notes}</span>
                    </div>
                  )}

                  {/* Complete Delivery Button - Only for in-progress delivery stops */}
                  {isCurrent && isDeliveryStop && (
                    <Button
                      variant="gradient"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => handleOpenPOD(stop)}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Complete Delivery
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POD Modal */}
      {selectedStop && (
        <ProofOfDelivery
          open={podOpen}
          onOpenChange={setPodOpen}
          trip={trip}
          stop={selectedStop}
          onComplete={handleCompletePOD}
        />
      )}
    </>
  );
}
