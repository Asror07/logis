import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Trip, TripStatus } from './types';
import { initialTrips } from './data';
import { LoadMonitoringMap } from './components/LoadMonitoringMap';
import { LoadMonitoringTripList } from './components/LoadMonitoringTripList';
import { LoadMonitoringTripDetail } from './components/LoadMonitoringTripDetail';
import { LoadMonitoringFilters } from './components/LoadMonitoringFilters';

// Linear interpolation helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export default function LoadMonitoring() {
  const { collapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('loads');
  const [searchQuery, setSearchQuery] = useState('');

  // Map state
  const [mapboxToken, setMapboxToken] = useState('pk.eyJ1IjoiYXZhemJlazI5MDYiLCJhIjoiY21rMTNjMjlqMDIwazNkc2J5OWY3Y2NsayJ9.zvJFF9Z084UZSwrknkEDxA');
  const [tokenInput, setTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  // Trip state
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Filters
  const [tripStatusFilter, setTripStatusFilter] = useState<string>('all');
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<string>('all');
  const [stopsFilter, setStopsFilter] = useState<string>('all');

  // View mode: 'list' or 'detail'
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);

  // Sort trips by schedule status priority
  const sortedTrips = [...trips].sort((a, b) => {
    const priority = { 'late': 0, 'at-risk': 1, 'on-time': 2 };
    return priority[a.scheduleStatus] - priority[b.scheduleStatus];
  });

  // Filter trips
  const filteredTrips = sortedTrips.filter(trip => {
    const matchesSearch = trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTripStatus = tripStatusFilter === 'all' || trip.status === tripStatusFilter;
    const matchesScheduleStatus = scheduleStatusFilter === 'all' || trip.scheduleStatus === scheduleStatusFilter;
    
    let matchesStops = true;
    if (stopsFilter === '1-3') {
      matchesStops = trip.totalStops >= 1 && trip.totalStops <= 3;
    } else if (stopsFilter === '4-6') {
      matchesStops = trip.totalStops >= 4 && trip.totalStops <= 6;
    } else if (stopsFilter === '7+') {
      matchesStops = trip.totalStops >= 7;
    }
    
    return matchesSearch && matchesTripStatus && matchesScheduleStatus && matchesStops;
  });

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  // Animate trips - move trucks between stops
  useEffect(() => {
    const interval = setInterval(() => {
      setTrips(prevTrips =>
        prevTrips.map(trip => {
          // Only animate in-transit trips
          if (trip.status !== 'in-transit') return trip;
          
          // Find current and next stop
          const currentStopIdx = trip.stops.findIndex(s => s.status === 'in-progress');
          if (currentStopIdx === -1) return trip;
          
          const prevStop = trip.stops[currentStopIdx - 1];
          const currentStop = trip.stops[currentStopIdx];
          
          if (!prevStop || !currentStop) return trip;
          
          // Calculate movement towards current stop
          const dx = currentStop.location.lng - trip.currentPosition.lng;
          const dy = currentStop.location.lat - trip.currentPosition.lat;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If very close to destination, don't move
          if (distance < 0.1) return trip;
          
          // Move 2-5% closer
          const movePercent = 0.02 + Math.random() * 0.03;
          const newLng = lerp(trip.currentPosition.lng, currentStop.location.lng, movePercent);
          const newLat = lerp(trip.currentPosition.lat, currentStop.location.lat, movePercent);
          
          return {
            ...trip,
            currentPosition: { lng: newLng, lat: newLat }
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update selected trip data when trips update
  useEffect(() => {
    if (selectedTrip) {
      const updated = trips.find(t => t.id === selectedTrip.id);
      if (updated) {
        setSelectedTrip(updated);
      }
    }
  }, [trips, selectedTrip]);

  // Update detail trip data when trips update
  useEffect(() => {
    if (detailTrip) {
      const updated = trips.find(t => t.id === detailTrip.id);
      if (updated) {
        setDetailTrip(updated);
      }
    }
  }, [trips, detailTrip]);

  // Handle trip click - open detail view
  const handleTripClick = (trip: Trip) => {
    setDetailTrip(trip);
    setViewMode('detail');
    setSelectedTrip(trip);
  };

  // Handle close detail view
  const handleCloseDetail = () => {
    setViewMode('list');
    setDetailTrip(null);
  };

  // Handle POD completion
  const handleStopComplete = (tripId: string, stopOrder: number, podData: any) => {
    setTrips(prevTrips => prevTrips.map(trip => {
      if (trip.id !== tripId) return trip;

      // Update the stop status to completed
      const updatedStops = trip.stops.map(stop => {
        if (stop.order !== stopOrder) return stop;
        return {
          ...stop,
          status: 'completed' as const,
          actualArrival: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
      });

      // Find next pending stop and mark it in-progress
      const nextPendingIdx = updatedStops.findIndex(s => s.status === 'pending');
      if (nextPendingIdx !== -1) {
        updatedStops[nextPendingIdx] = {
          ...updatedStops[nextPendingIdx],
          status: 'in-progress' as const,
        };
      }

      // Update units status to delivered
      const completedStop = trip.stops.find(s => s.order === stopOrder);
      const updatedUnits = trip.units.map(unit => {
        if (!completedStop?.units.includes(unit.id)) return unit;
        return {
          ...unit,
          status: 'delivered' as const,
          deliveredAt: new Date().toISOString(),
          signedBy: podData.signature?.signedBy,
        };
      });

      // Calculate new progress
      const completedStops = updatedStops.filter(s => s.status === 'completed').length;
      const deliveredUnits = updatedUnits.filter(u => u.status === 'delivered').length;

      // Check if all stops completed
      const allCompleted = updatedStops.every(s => s.status === 'completed' || s.status === 'skipped');

      return {
        ...trip,
        stops: updatedStops,
        units: updatedUnits,
        completedStops,
        deliveredUnits,
        status: allCompleted ? 'completed' as const : trip.status,
        currentStopIndex: nextPendingIdx !== -1 ? nextPendingIdx + 1 : trip.currentStopIndex,
        statusHistory: [
          ...trip.statusHistory,
          {
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            event: 'Delivery Completed',
            description: `Stop #${stopOrder} marked as delivered. ${completedStop?.units.length || 0} unit(s) delivered.`,
            updatedBy: 'Driver',
            stopOrder,
          },
        ],
      };
    }));
  };

  const activeFiltersCount = [tripStatusFilter, scheduleStatusFilter, stopsFilter].filter(f => f !== 'all').length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <Header />

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Map Section - 60% */}
          <div className="flex-1 relative">
            <LoadMonitoringMap
              mapboxToken={mapboxToken}
              tokenInput={tokenInput}
              setTokenInput={setTokenInput}
              onSaveToken={handleSaveToken}
              isMapReady={isMapReady}
              setIsMapReady={setIsMapReady}
              trips={filteredTrips}
              selectedTrip={selectedTrip}
              onTripClick={handleTripClick}
            />
          </div>

          {/* Trip List Section - 40% */}
          <div className="w-[400px] border-l border-border bg-card flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search trips, drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{filteredTrips.length} trips found</span>
                <LoadMonitoringFilters
                  trips={sortedTrips}
                  tripStatusFilter={tripStatusFilter}
                  setTripStatusFilter={setTripStatusFilter}
                  scheduleStatusFilter={scheduleStatusFilter}
                  setScheduleStatusFilter={setScheduleStatusFilter}
                  stopsFilter={stopsFilter}
                  setStopsFilter={setStopsFilter}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </div>

            {/* Trip List / Detail View Toggle */}
            <div className="flex-1 overflow-y-auto">
              {viewMode === 'list' ? (
                <LoadMonitoringTripList
                  trips={filteredTrips}
                  selectedTrip={selectedTrip}
                  onTripClick={handleTripClick}
                />
              ) : (
                detailTrip && (
                  <LoadMonitoringTripDetail
                    trip={detailTrip}
                    onClose={handleCloseDetail}
                    onStopComplete={handleStopComplete}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
