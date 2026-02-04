import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Driver, loadStatusConfig, phaseColors, scheduleStatusLabels } from '../types';
import { StatusTimeline } from './StatusTimeline';

interface LoadMonitoringDriverDetailProps {
  driver: Driver;
  onClose: () => void;
}

export function LoadMonitoringDriverDetail({ driver, onClose }: LoadMonitoringDriverDetailProps) {
  const navigate = useNavigate();

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
      <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
        {/* Driver Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            "h-16 w-16 rounded-xl flex items-center justify-center flex-shrink-0",
            phaseColors[loadStatusConfig[driver.loadStatus].phase].bg
          )}>
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-lg">{driver.name}</span>
              <Badge variant={
                driver.scheduleStatus === 'late' ? 'destructive' :
                driver.scheduleStatus === 'at-risk' ? 'warning' : 'success'
              }>
                {scheduleStatusLabels[driver.scheduleStatus]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
            <p className="text-xs text-muted-foreground mt-1">{driver.id}</p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="default" size="sm" className="flex-1" onClick={() => navigate('/driver-chat')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>

        {/* Route Info */}
        <div className="bg-secondary/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pickup Location</p>
              <p className="text-sm font-medium">{driver.pickupLocation.address}</p>
            </div>
          </div>
          <div className="w-px h-6 bg-border ml-4 my-1" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery Location</p>
              <p className="text-sm font-medium">{driver.deliveryLocation.address}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium">{driver.eta}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="font-medium ml-1">{driver.scheduledTime}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(driver.progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", phaseColors[loadStatusConfig[driver.loadStatus].phase].bg)}
              style={{ width: `${driver.progress}%` }}
            />
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Status</span>
            <Badge
              variant="outline"
              className={loadStatusConfig[driver.loadStatus].color}
            >
              {loadStatusConfig[driver.loadStatus].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {loadStatusConfig[driver.loadStatus].description}
          </p>
        </div>

        {/* System Update Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-400">
              All statuses after "Assigned to Carrier" are automatically updated by the System
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-4">Status History</p>
          <StatusTimeline
            statusHistory={driver.statusHistory}
            currentStatus={driver.loadStatus}
          />
        </div>
      </div>
    </div>
  );
}
