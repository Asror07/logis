import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight, Package, MapPin, Clock, Truck } from 'lucide-react';
import { Trip, tripPhaseColors, scheduleStatusLabels, calculateTripProgress } from '../types';

interface LoadMonitoringTripListProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onTripClick: (trip: Trip) => void;
}

export function LoadMonitoringTripList({
  trips,
  selectedTrip,
  onTripClick
}: LoadMonitoringTripListProps) {
  return (
    <>
      {trips.map((trip, index) => {
        const progress = calculateTripProgress(trip);
        const phaseColor = tripPhaseColors[trip.status];
        const remainingUnits = trip.totalUnits - trip.deliveredUnits;
        const remainingStops = trip.totalStops - trip.completedStops;

        // Get route preview (stop names)
        const routePreview = trip.stops.map(s => s.location.name.split(' ')[0]).join(' → ');

        return (
          <button
            key={trip.id}
            onClick={() => onTripClick(trip)}
            className={cn(
              "w-full p-4 border-b border-border/50 text-left hover:bg-secondary/30 transition-all animate-fade-in",
              selectedTrip?.id === trip.id && "bg-primary/10 border-l-4 border-l-primary"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full", phaseColor.bg)} />
                <span className="font-bold text-sm">Trip #{trip.id}</span>
                <Badge variant={
                  trip.scheduleStatus === 'late' ? 'destructive' :
                  trip.scheduleStatus === 'at-risk' ? 'warning' : 'success'
                } className="text-[10px] px-1.5 py-0">
                  {scheduleStatusLabels[trip.scheduleStatus]}
                </Badge>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Driver & Vehicle */}
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{trip.driverName}</span>
              <span className="text-xs text-muted-foreground/60">•</span>
              <span className="text-xs text-muted-foreground/80">{trip.vehicle}</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground font-medium">{trip.totalUnits}</span>
                <span className="text-muted-foreground">Units</span>
                {remainingUnits > 0 && (
                  <span className="text-muted-foreground">({remainingUnits} left)</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-foreground font-medium">{trip.completedStops}/{trip.totalStops}</span>
                <span className="text-muted-foreground">Stops</span>
              </div>
            </div>

            {/* Route Preview */}
            <div className="text-xs text-muted-foreground mb-3 truncate">
              {routePreview}
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", phaseColor.bg)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {trip.status === 'completed' ? 'Completed' : `ETA: ${trip.eta}`}
                </span>
              </div>
              <span className={cn("font-medium", phaseColor.text)}>
                {progress}% Complete
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}
