import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Clock, Users, Navigation, Wifi, WifiOff, Brain } from 'lucide-react';
import { etaService, ETAPrediction, BusPosition } from '@/services/etaService';
import { languageService } from '@/services/languageService';
import { notificationService } from '@/services/notificationService';
import { lazy, Suspense } from 'react';

const InteractiveMap = lazy(() => import('@/components/InteractiveMap'));

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
  etaPrediction?: ETAPrediction;
  lastGpsUpdate: number;
  position?: [number, number]; // GPS coordinates [lat, lng]
}

interface Stop {
  id: string;
  name: string;
  buses: Bus[];
}

// Enhanced mock data with GPS coordinates and AI predictions
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
        status: 'arriving',
        gpsActive: true,
        lastGpsUpdate: Date.now() - 30000,
        position: [12.9716, 77.5946] // Current bus position
      },
      {
        id: 'bus2',
        route: 'Route 8',
        currentStop: 'Railway Station',
        nextStop: 'City Center',
        eta: 8,
        occupancy: 45,
        delay: 2,
        status: 'delayed',
        gpsActive: false,
        lastGpsUpdate: Date.now() - 300000, // 5 minutes ago
        position: [12.9750, 77.6100] // Estimated position
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
        status: 'on-time',
        gpsActive: true,
        lastGpsUpdate: Date.now() - 15000,
        position: [12.9780, 77.6200] // Current bus position
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
        status: 'delayed',
        gpsActive: false,
        lastGpsUpdate: Date.now() - 600000, // 10 minutes ago
        position: [12.9650, 77.5800] // Estimated position
      }
    ]
  }
];

// Map stop data for the interactive map
const mapStops = mockStops.map(stop => ({
  id: stop.id,
  name: stop.name,
  position: (
    // Convert stop names to approximate coordinates
    stop.id === 'stop1' ? [12.9716, 77.5946] : // City Center
    stop.id === 'stop2' ? [12.9750, 77.6100] : // Railway Station
    [12.9650, 77.5800] // University Campus
  ) as [number, number],
  buses: stop.buses
}));

const TransportMap = () => {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(mockStops[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState(languageService.getCurrentLanguage());
  const [busesWithPredictions, setBusesWithPredictions] = useState<Stop[]>(mockStops);

  const t = (key: string, defaultValue?: string) => languageService.translate(key, defaultValue);

  useEffect(() => {
    // Ensure language service is initialized
    languageService.initialize();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateETAPredictions();
    }, 2000); // Update every 2 seconds

    const unsubscribeLang = languageService.subscribe(() => {
      setLanguage(languageService.getCurrentLanguage());
    });

    return () => {
      clearInterval(timer);
      unsubscribeLang();
    };
  }, []);

  const updateETAPredictions = () => {
    setBusesWithPredictions(current => 
      current.map(stop => ({
        ...stop,
        buses: stop.buses.map(bus => {
          const busPosition: BusPosition = {
            busId: bus.id,
            route: bus.route,
            lastKnownStop: bus.currentStop,
            timestamp: bus.lastGpsUpdate,
            gpsAvailable: bus.gpsActive
          };

          const etaPrediction = etaService.predictETA(busPosition, stop.id, []);
          
          return {
            ...bus,
            eta: etaPrediction.eta,
            etaPrediction,
            occupancy: etaService.predictOccupancy(bus.route)
          };
        })
      }))
    );
  };

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
        <h1 className="text-2xl font-bold text-foreground">{t('tracking.title', 'Live Bus Tracking')}</h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleTimeString()} • {t('tracking.realtime', 'Real-time updates')}
        </p>
      </div>

      {/* Interactive Map */}
      <Suspense fallback={
        <Card className="relative">
          <CardContent className="p-0">
            <div className="h-64 bg-accent rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground text-sm">Loading map...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      }>
        <InteractiveMap
          stops={mapStops}
          selectedStop={selectedStop ? mapStops.find(s => s.id === selectedStop.id) || null : null}
          onStopSelect={(stop) => {
            const originalStop = mockStops.find(s => s.id === stop.id);
            if (originalStop) setSelectedStop(originalStop);
          }}
        />
      </Suspense>

      {/* Stop Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {busesWithPredictions.map((stop) => (
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
            {t('tracking.arrivingAt', 'Buses arriving at')} {selectedStop.name}
          </h2>
          
          {selectedStop.buses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t('tracking.noBuses', 'No buses currently scheduled for this stop')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedStop.buses.map((bus) => (
                <Card key={bus.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-semibold">
                            {bus.route}
                          </Badge>
                          <Badge className={getStatusColor(bus.status)}>
                            {t(`status.${bus.status.replace('-', '')}`).toUpperCase()}
                          </Badge>
                          {!bus.gpsActive && (
                            <Badge variant="outline" className="text-warning">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Predicted
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {t('tracking.from')}: {bus.currentStop}
                        </div>
                        
                        {bus.etaPrediction && !bus.gpsActive && (
                          <div className="text-xs text-warning flex items-center gap-1">
                            <WifiOff className="h-3 w-3" />
                            {t('eta.predicted')} • {Math.round(bus.etaPrediction.confidence * 100)}% confidence
                          </div>
                        )}
                        
                        {bus.gpsActive && (
                          <div className="text-xs text-success flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            {t('eta.gps')}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-1 text-lg font-bold">
                          <Clock className="h-4 w-4" />
                          {bus.eta} {t('tracking.minutes')}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-1 ${getOccupancyColor(bus.occupancy)}`}>
                              <Users className="h-3 w-3" />
                              {Math.round(bus.occupancy)}%
                            </span>
                            
                            {bus.delay > 0 && (
                              <span className="text-warning">
                                +{bus.delay}min {t('tracking.delay')}
                              </span>
                            )}
                          </div>
                          
                          {/* Occupancy Progress Bar */}
                          <div className="w-20">
                            <Progress 
                              value={bus.occupancy} 
                              className="h-2"
                            />
                          </div>
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