import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Navigation } from 'lucide-react';

interface Bus {
  id: string;
  route: string;
  currentStop: string;
  nextStop: string;
  eta: number;
  occupancy: number;
  delay: number;
  status: 'on-time' | 'delayed' | 'arriving';
}

interface Stop {
  id: string;
  name: string;
  buses: Bus[];
}

// Mock data for demonstration
const mockStops: Stop[] = [
  {
    id: 'stop1',
    name: 'City Center',
    buses: [
      {
        id: 'bus1',
        route: 'Route 15',
        currentStop: 'Mall Junction',
        nextStop: 'City Center',
        eta: 3,
        occupancy: 75,
        delay: 0,
        status: 'arriving'
      },
      {
        id: 'bus2',
        route: 'Route 8',
        currentStop: 'Railway Station',
        nextStop: 'City Center',
        eta: 8,
        occupancy: 45,
        delay: 2,
        status: 'delayed'
      }
    ]
  },
  {
    id: 'stop2',
    name: 'Railway Station',
    buses: [
      {
        id: 'bus3',
        route: 'Route 12',
        currentStop: 'Hospital',
        nextStop: 'Railway Station',
        eta: 5,
        occupancy: 60,
        delay: 0,
        status: 'on-time'
      }
    ]
  },
  {
    id: 'stop3',
    name: 'University Campus',
    buses: [
      {
        id: 'bus4',
        route: 'Route 25',
        currentStop: 'Tech Park',
        nextStop: 'University Campus',
        eta: 12,
        occupancy: 80,
        delay: 5,
        status: 'delayed'
      }
    ]
  }
];

const TransportMap = () => {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(mockStops[0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'bg-success text-success-foreground';
      case 'delayed':
        return 'bg-warning text-warning-foreground';
      case 'arriving':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return 'text-error';
    if (occupancy >= 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Live Bus Tracking</h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleTimeString()} • Real-time updates
        </p>
      </div>

      {/* Map Area - Simulated */}
      <Card className="relative">
        <CardContent className="p-0">
          <div className="h-64 bg-accent rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80" />
            
            {/* Simulated bus positions */}
            {mockStops.map((stop, index) => (
              <Button
                key={stop.id}
                variant="ghost"
                className={`absolute p-2 rounded-full ${
                  selectedStop?.id === stop.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card shadow-md hover:bg-card/90'
                }`}
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + (index % 2) * 30}%`,
                }}
                onClick={() => setSelectedStop(stop)}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            ))}
            
            {/* Map overlay */}
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
              Interactive Map • Tap stops for details
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stop Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mockStops.map((stop) => (
          <Button
            key={stop.id}
            variant={selectedStop?.id === stop.id ? "default" : "outline"}
            onClick={() => setSelectedStop(stop)}
            className="whitespace-nowrap"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {stop.name}
          </Button>
        ))}
      </div>

      {/* Bus Information */}
      {selectedStop && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Buses arriving at {selectedStop.name}
          </h2>
          
          {selectedStop.buses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No buses currently scheduled for this stop.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedStop.buses.map((bus) => (
                <Card key={bus.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-semibold">
                            {bus.route}
                          </Badge>
                          <Badge className={getStatusColor(bus.status)}>
                            {bus.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          From: {bus.currentStop}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 text-lg font-bold">
                          <Clock className="h-4 w-4" />
                          {bus.eta} min
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`flex items-center gap-1 ${getOccupancyColor(bus.occupancy)}`}>
                            <Users className="h-3 w-3" />
                            {bus.occupancy}%
                          </span>
                          
                          {bus.delay > 0 && (
                            <span className="text-warning">
                              +{bus.delay}min delay
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransportMap;