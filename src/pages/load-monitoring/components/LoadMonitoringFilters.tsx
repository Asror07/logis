import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { Trip, statusColors, tripStatusConfig } from '../types';

interface LoadMonitoringFiltersProps {
  trips: Trip[];
  tripStatusFilter: string;
  setTripStatusFilter: (value: string) => void;
  scheduleStatusFilter: string;
  setScheduleStatusFilter: (value: string) => void;
  stopsFilter: string;
  setStopsFilter: (value: string) => void;
  activeFiltersCount: number;
}

export function LoadMonitoringFilters({
  trips,
  tripStatusFilter,
  setTripStatusFilter,
  scheduleStatusFilter,
  setScheduleStatusFilter,
  stopsFilter,
  setStopsFilter,
  activeFiltersCount
}: LoadMonitoringFiltersProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Filter Trips</h4>

          {/* Trip Status Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">By Trip Status</label>
            <Select value={tripStatusFilter} onValueChange={setTripStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Scheduled
                  </div>
                </SelectItem>
                <SelectItem value="in-transit">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    In Transit
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Status Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">By Schedule Status</label>
            <Select value={scheduleStatusFilter} onValueChange={setScheduleStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-time">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    On Time
                  </div>
                </SelectItem>
                <SelectItem value="at-risk">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    At Risk
                  </div>
                </SelectItem>
                <SelectItem value="late">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Late
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stops Count Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">By Stops Count</label>
            <Select value={stopsFilter} onValueChange={setStopsFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Stops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stops</SelectItem>
                <SelectItem value="1-3">1-3 Stops</SelectItem>
                <SelectItem value="4-6">4-6 Stops</SelectItem>
                <SelectItem value="7+">7+ Stops</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setTripStatusFilter('all');
                setScheduleStatusFilter('all');
                setStopsFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
