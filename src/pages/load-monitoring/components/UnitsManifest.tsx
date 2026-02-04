import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Truck, MapPin } from 'lucide-react';
import { Trip, Unit, unitStatusConfig } from '../types';

interface UnitsManifestProps {
  trip: Trip;
}

export function UnitsManifest({ trip }: UnitsManifestProps) {
  // Group units by destination
  const unitsByDestination: Record<number, { stop: typeof trip.stops[0]; units: Unit[] }> = {};
  
  trip.stops.forEach(stop => {
    if (stop.type === 'delivery') {
      unitsByDestination[stop.order] = {
        stop,
        units: trip.units.filter(u => u.destinationStopOrder === stop.order)
      };
    }
  });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-secondary/30 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Units</span>
          <span className="font-medium">{trip.totalUnits}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Delivered</span>
          <span className="font-medium text-green-400">{trip.deliveredUnits}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">In Transit</span>
          <span className="font-medium text-yellow-400">{trip.totalUnits - trip.deliveredUnits}</span>
        </div>
      </div>

      {/* Units grouped by destination */}
      {Object.entries(unitsByDestination).map(([order, { stop, units }]) => (
        <div key={order} className="border border-border rounded-lg overflow-hidden">
          {/* Destination Header */}
          <div className={cn(
            "px-3 py-2 flex items-center gap-2",
            stop.status === 'completed' ? "bg-green-500/10" :
            stop.status === 'in-progress' ? "bg-orange-500/10" : "bg-muted/50"
          )}>
            <MapPin className={cn(
              "h-4 w-4",
              stop.status === 'completed' ? "text-green-400" :
              stop.status === 'in-progress' ? "text-orange-400" : "text-muted-foreground"
            )} />
            <span className="font-medium text-sm">{stop.location.name}</span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              Stop {order}
            </Badge>
          </div>

          {/* Units List */}
          <div className="divide-y divide-border">
            {units.map(unit => {
              const statusConfig = unitStatusConfig[unit.status];
              const isDelivered = unit.status === 'delivered';

              return (
                <div key={unit.id} className="px-3 py-2.5 flex items-center gap-3">
                  {/* Status Icon */}
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    isDelivered ? "bg-green-500/20" : "bg-secondary"
                  )}>
                    {isDelivered ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {unit.year} {unit.make} {unit.model}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", unit.color === 'White' ? '' : '', statusConfig.color)}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>VIN: {unit.id}</span>
                      <span>•</span>
                      <span>{unit.color}</span>
                    </div>
                    {isDelivered && unit.deliveredAt && (
                      <div className="text-xs text-green-400 mt-1">
                        Delivered at {unit.deliveredAt}
                        {unit.signedBy && ` • Signed by ${unit.signedBy}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
