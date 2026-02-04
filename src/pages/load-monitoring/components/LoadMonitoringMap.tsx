import { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trip, TripStop, tripPhaseColors, statusColors, stopStatusConfig } from '../types';

interface LoadMonitoringMapProps {
  mapboxToken: string;
  tokenInput: string;
  setTokenInput: (value: string) => void;
  onSaveToken: () => void;
  isMapReady: boolean;
  setIsMapReady: (ready: boolean) => void;
  trips: Trip[];
  selectedTrip: Trip | null;
  onTripClick: (trip: Trip) => void;
}

export function LoadMonitoringMap({
  mapboxToken,
  tokenInput,
  setTokenInput,
  onSaveToken,
  isMapReady,
  setIsMapReady,
  trips,
  selectedTrip,
  onTripClick
}: LoadMonitoringMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const stopMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const routeLayersRef = useRef<string[]>([]);

  const createTruckMarkerElement = useCallback((trip: Trip, isSelected: boolean) => {
    const scheduleColor = statusColors[trip.scheduleStatus];

    const el = document.createElement('div');
    el.className = 'trip-marker';
    el.innerHTML = `
      <div style="
        width: ${isSelected ? '48px' : '40px'};
        height: ${isSelected ? '48px' : '40px'};
        background: ${scheduleColor.hex};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 3px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.3)'};
        cursor: pointer;
        transition: all 0.3s ease;
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      </div>
      ${isSelected ? `
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        ">
          <div style="
            width: 60px;
            height: 60px;
            background: ${scheduleColor.hex};
            border-radius: 50%;
            opacity: 0.3;
          "></div>
        </div>
      ` : ''}
    `;
    return el;
  }, []);

  const createStopMarkerElement = useCallback((stop: TripStop, index: number) => {
    const isCompleted = stop.status === 'completed';
    const isCurrent = stop.status === 'in-progress';
    const isPending = stop.status === 'pending';
    const isPickup = stop.type === 'pickup';

    const bgColor = isCompleted ? '#22c55e' : isCurrent ? '#f97316' : '#6b7280';
    const label = isPickup ? 'P' : index.toString();

    const el = document.createElement('div');
    el.className = 'stop-marker';
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: ${bgColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
        color: white;
        font-weight: bold;
        font-size: 12px;
        ${isCurrent ? 'animation: pulse 2s infinite;' : ''}
      ">
        ${isCompleted ? '✓' : label}
      </div>
      <div style="
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        background: rgba(0,0,0,0.75);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
      ">
        ${stop.location.name}
      </div>
    `;
    return el;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98.5795, 39.8283],
        zoom: 3.5,
        pitch: 0
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      map.current.on('load', () => {
        setIsMapReady(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setIsMapReady(false);
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, setIsMapReady]);

  // Update truck markers
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    trips.forEach(trip => {
      // Only show trucks for in-transit trips
      if (trip.status !== 'in-transit') return;

      const el = createTruckMarkerElement(trip, selectedTrip?.id === trip.id);

      el.addEventListener('click', () => {
        onTripClick(trip);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([trip.currentPosition.lng, trip.currentPosition.lat])
        .addTo(map.current!);

      markersRef.current[trip.id] = marker;
    });
  }, [trips, selectedTrip, isMapReady, createTruckMarkerElement, onTripClick]);

  // Draw multi-stop route for selected trip
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    const addRouteLayers = () => {
      if (!map.current) return;

      // Clear existing layers and markers
      routeLayersRef.current.forEach(layerId => {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current?.getSource(layerId)) {
          map.current.removeSource(layerId);
        }
      });
      routeLayersRef.current = [];

      stopMarkersRef.current.forEach(marker => marker.remove());
      stopMarkersRef.current = [];

      if (!selectedTrip) return;

      const stops = selectedTrip.stops;
      const coordinates = stops.map(s => [s.location.lng, s.location.lat]);

      // Draw completed route (solid line)
      const completedStops = stops.filter(s => s.status === 'completed');
      if (completedStops.length > 0) {
        const completedCoords = completedStops.map(s => [s.location.lng, s.location.lat]);
        // Add current position if there's an in-progress stop
        const inProgressStop = stops.find(s => s.status === 'in-progress');
        if (inProgressStop) {
          completedCoords.push([selectedTrip.currentPosition.lng, selectedTrip.currentPosition.lat]);
        }

        const completedRouteId = `completed-route-${selectedTrip.id}`;
        map.current.addSource(completedRouteId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: completedCoords
            }
          }
        });

        map.current.addLayer({
          id: completedRouteId,
          type: 'line',
          source: completedRouteId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#22c55e',
            'line-width': 4,
            'line-opacity': 0.9
          }
        });
        routeLayersRef.current.push(completedRouteId);
      }

      // Draw pending route (dashed line)
      const pendingStops = stops.filter(s => s.status === 'pending' || s.status === 'in-progress');
      if (pendingStops.length > 0) {
        const pendingCoords: number[][] = [];
        
        // Start from current position
        pendingCoords.push([selectedTrip.currentPosition.lng, selectedTrip.currentPosition.lat]);
        
        // Add all pending/in-progress stops
        pendingStops.forEach(s => {
          pendingCoords.push([s.location.lng, s.location.lat]);
        });

        const pendingRouteId = `pending-route-${selectedTrip.id}`;
        map.current.addSource(pendingRouteId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: pendingCoords
            }
          }
        });

        map.current.addLayer({
          id: pendingRouteId,
          type: 'line',
          source: pendingRouteId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#6b7280',
            'line-width': 3,
            'line-opacity': 0.7,
            'line-dasharray': [3, 2]
          }
        });
        routeLayersRef.current.push(pendingRouteId);
      }

      // Add stop markers
      let deliveryIndex = 1;
      stops.forEach((stop) => {
        const el = createStopMarkerElement(stop, stop.type === 'pickup' ? 0 : deliveryIndex);
        if (stop.type === 'delivery') deliveryIndex++;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([stop.location.lng, stop.location.lat])
          .addTo(map.current!);

        stopMarkersRef.current.push(marker);
      });

      // Fit bounds to show all stops
      if (stops.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        stops.forEach(stop => {
          bounds.extend([stop.location.lng, stop.location.lat]);
        });
        bounds.extend([selectedTrip.currentPosition.lng, selectedTrip.currentPosition.lat]);

        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 50, right: 50 },
          maxZoom: 8
        });
      }
    };

    if (map.current.isStyleLoaded()) {
      addRouteLayers();
    } else {
      map.current.once('style.load', addRouteLayers);
    }

    return () => {
      routeLayersRef.current.forEach(layerId => {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current?.getSource(layerId)) {
          map.current.removeSource(layerId);
        }
      });
      stopMarkersRef.current.forEach(marker => marker.remove());
    };
  }, [selectedTrip, isMapReady, createStopMarkerElement]);

  if (!mapboxToken) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/20 gap-4">
        <MapPin className="h-16 w-16 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          To display the live map, please enter your Mapbox public access token.
          You can get one for free at{' '}
          <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            mapbox.com
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-md px-4">
          <Input
            type="text"
            placeholder="Enter your Mapbox public token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={onSaveToken} disabled={!tokenInput.trim()}>
            Save Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 z-10">
        <p className="text-xs font-medium mb-2">Trip Status</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full bg-success" />
            <span className="text-muted-foreground">On Time</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">At Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Late</span>
          </div>
        </div>
        {selectedTrip && (
          <>
            <div className="border-t border-border my-2 pt-2">
              <p className="text-xs font-medium mb-2">Stops</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-muted-foreground">Current</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-muted-foreground">Pending</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
