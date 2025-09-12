import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Bus, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const createBusIcon = (color: string = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 6h14v10H5V6z"/>
        </svg>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Custom stop icon
const createStopIcon = (isSelected: boolean = false) => {
  const color = isSelected ? '#10b981' : '#6b7280';
  return L.divIcon({
    className: 'custom-stop-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ${isSelected ? 'animation: pulse 2s infinite;' : ''}
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface BusStop {
  id: string;
  name: string;
  position: [number, number]; // [lat, lng]
  buses: Bus[];
}

interface Bus {
  id: string;
  route: string;
  currentStop: string;
  nextStop: string;
  eta: number;
  occupancy: number;
  delay: number;
  status: 'on-time' | 'delayed' | 'arriving';
  gpsActive: boolean;
  position?: [number, number]; // Current bus position
}

interface InteractiveMapProps {
  stops: BusStop[];
  selectedStop: BusStop | null;
  onStopSelect: (stop: BusStop) => void;
}

// Component to handle map updates when selectedStop changes
const MapUpdater = ({ selectedStop }: { selectedStop: BusStop | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedStop && selectedStop.position && selectedStop.position.length === 2) {
      map.setView(selectedStop.position, 15);
    }
  }, [selectedStop, map]);
  
  return null;
};

const InteractiveMap = ({ stops, selectedStop, onStopSelect }: InteractiveMapProps) => {
  const [mapCenter] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore coordinates
  const [mapZoom] = useState(13);

  return (
    <Card className="relative">
      <CardContent className="p-0">
        <div className="h-64 w-full">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Bus Stops */}
            {stops.filter(stop => stop.position && stop.position.length === 2).map((stop) => (
              <Marker
                key={stop.id}
                position={stop.position!}
                icon={createStopIcon(selectedStop?.id === stop.id)}
                eventHandlers={{
                  click: () => onStopSelect(stop),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-2">{stop.name}</h3>
                    <div className="space-y-1">
                      {stop.buses.map((bus) => (
                        <div key={bus.id} className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs">
                            {bus.route}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {bus.eta}min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Moving Buses */}
            {stops.flatMap(stop => 
              stop.buses
                .filter(bus => bus.position && bus.position.length === 2 && bus.gpsActive)
                .map(bus => (
                  <Marker
                    key={`bus-${bus.id}`}
                    position={bus.position!}
                    icon={createBusIcon(
                      bus.status === 'delayed' ? '#ef4444' : 
                      bus.status === 'arriving' ? '#10b981' : '#3b82f6'
                    )}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-4 w-4" />
                          <span className="font-semibold text-sm">{bus.route}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ETA: {bus.eta} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Occupancy: {bus.occupancy}%
                          </div>
                          <div className="text-muted-foreground">
                            Status: {bus.status.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
            )}
            
            <MapUpdater selectedStop={selectedStop} />
          </MapContainer>
        </div>
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Interactive Map</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Selected Stop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Bus Position</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
