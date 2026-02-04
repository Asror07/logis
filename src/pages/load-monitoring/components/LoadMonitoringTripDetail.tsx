import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  User,
  Phone,
  MessageSquare,
  Package,
  MapPin,
  Clock,
  Truck,
  Route
} from 'lucide-react';
import { Trip, tripPhaseColors, scheduleStatusLabels, calculateTripProgress } from '../types';
import { StopsTimeline } from './StopsTimeline';
import { UnitsManifest } from './UnitsManifest';

interface LoadMonitoringTripDetailProps {
  trip: Trip;
  onClose: () => void;
  onStopComplete?: (tripId: string, stopOrder: number, podData: any) => void;
}

export function LoadMonitoringTripDetail({ trip, onClose, onStopComplete }: LoadMonitoringTripDetailProps) {
  const navigate = useNavigate();
  const progress = calculateTripProgress(trip);
  const phaseColor = tripPhaseColors[trip.status];

  const handleStopComplete = (stopOrder: number, podData: any) => {
    if (onStopComplete) {
      onStopComplete(trip.id, stopOrder, podData);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Fixed Back Button */}
      <div className="sticky top-0 bg-card z-10 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="-ml-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to List
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Trip Header */}
        <div className="p-4 border-b border-border animate-fade-in">
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0",
              phaseColor.bg
            )}>
              <Truck className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-lg">Trip #{trip.id}</span>
                <Badge variant={
                  trip.scheduleStatus === 'late' ? 'destructive' :
                  trip.scheduleStatus === 'at-risk' ? 'warning' : 'success'
                }>
                  {scheduleStatusLabels[trip.scheduleStatus]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{trip.driverName}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{trip.vehicle}</p>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="default" size="sm" className="flex-1" onClick={() => navigate('/driver-chat')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Package className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold">{trip.deliveredUnits}/{trip.totalUnits}</div>
              <div className="text-xs text-muted-foreground">Units</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold">{trip.completedStops}/{trip.totalStops}</div>
              <div className="text-xs text-muted-foreground">Stops</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                <Route className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold">{progress}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Trip Progress</span>
              <span className={cn("font-medium", phaseColor.text)}>
                {trip.status === 'completed' ? 'Completed' : `ETA: ${trip.eta}`}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", phaseColor.bg)}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="route" className="flex-1">
          <div className="px-4 pt-2 border-b border-border">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="route" className="text-xs">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                Route
              </TabsTrigger>
              <TabsTrigger value="units" className="text-xs">
                <Package className="h-3.5 w-3.5 mr-1.5" />
                Units
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="route" className="p-4 mt-0">
            <StopsTimeline trip={trip} onStopComplete={handleStopComplete} />
          </TabsContent>

          <TabsContent value="units" className="p-4 mt-0">
            <UnitsManifest trip={trip} />
          </TabsContent>

          <TabsContent value="history" className="p-4 mt-0">
            <div className="space-y-3">
              {trip.statusHistory.slice().reverse().map((item, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.event}</span>
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    {item.updatedBy && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5">by {item.updatedBy}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
