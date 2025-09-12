// ETA Prediction Service with Fallback Algorithm
export interface StopData {
  stopId: string;
  name: string;
  lat: number;
  lng: number;
}

export interface HistoricalData {
  route: string;
  fromStop: string;
  toStop: string;
  averageTime: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayType: 'weekday' | 'weekend';
  confidence: number;
}

export interface BusPosition {
  busId: string;
  route: string;
  lastKnownStop: string;
  timestamp: number;
  gpsAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
}

export interface ETAPrediction {
  stopId: string;
  eta: number;
  confidence: number;
  isAIPredicted: boolean;
  method: 'gps' | 'historical' | 'ml_hybrid';
}

class ETAService {
  private historicalData: HistoricalData[] = [
    // Mock historical data - Route 15
    { route: 'Route 15', fromStop: 'mall_junction', toStop: 'city_center', averageTime: 3, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.92 },
    { route: 'Route 15', fromStop: 'city_center', toStop: 'railway_station', averageTime: 5, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.88 },
    { route: 'Route 15', fromStop: 'railway_station', toStop: 'university', averageTime: 7, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.85 },
    
    // Route 8
    { route: 'Route 8', fromStop: 'railway_station', toStop: 'city_center', averageTime: 4, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.90 },
    { route: 'Route 8', fromStop: 'city_center', toStop: 'tech_park', averageTime: 6, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.87 },
    
    // Route 12
    { route: 'Route 12', fromStop: 'hospital', toStop: 'railway_station', averageTime: 5, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.93 },
    { route: 'Route 12', fromStop: 'railway_station', toStop: 'city_center', averageTime: 4, timeOfDay: 'morning', dayType: 'weekday', confidence: 0.91 },
  ];

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private getDayType(): 'weekday' | 'weekend' {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 'weekend' : 'weekday';
  }

  private getTrafficFactor(): number {
    const hour = new Date().getHours();
    const timeOfDay = this.getTimeOfDay();
    
    // Peak hours adjustment
    if (timeOfDay === 'morning' && hour >= 7 && hour <= 9) return 1.3;
    if (timeOfDay === 'afternoon' && hour >= 17 && hour <= 19) return 1.25;
    if (timeOfDay === 'night') return 0.8;
    
    return 1.0;
  }

  /**
   * Main ETA prediction function
   * Implements fallback algorithm when GPS is unavailable
   */
  predictETA(busPosition: BusPosition, targetStopId: string, routeStops: StopData[]): ETAPrediction {
    const currentTime = Date.now();
    const timeSinceLastUpdate = (currentTime - busPosition.timestamp) / 1000 / 60; // minutes
    
    if (busPosition.gpsAvailable && timeSinceLastUpdate < 2) {
      // GPS is available and recent - use real-time calculation
      return this.calculateGPSBasedETA(busPosition, targetStopId, routeStops);
    }
    
    // GPS unavailable or stale - use fallback algorithm
    return this.calculateFallbackETA(busPosition, targetStopId, timeSinceLastUpdate);
  }

  private calculateGPSBasedETA(busPosition: BusPosition, targetStopId: string, routeStops: StopData[]): ETAPrediction {
    // Simulated GPS-based calculation
    const baseTime = Math.random() * 5 + 2; // 2-7 minutes
    const trafficFactor = this.getTrafficFactor();
    
    return {
      stopId: targetStopId,
      eta: Math.round(baseTime * trafficFactor),
      confidence: 0.95,
      isAIPredicted: false,
      method: 'gps'
    };
  }

  private calculateFallbackETA(busPosition: BusPosition, targetStopId: string, timeSinceLastUpdate: number): ETAPrediction {
    const timeOfDay = this.getTimeOfDay();
    const dayType = this.getDayType();
    const trafficFactor = this.getTrafficFactor();
    
    // Find historical data for the route segment
    const historicalSegment = this.historicalData.find(h => 
      h.route === busPosition.route &&
      h.fromStop === busPosition.lastKnownStop &&
      h.timeOfDay === timeOfDay &&
      h.dayType === dayType
    );
    
    let baseETA = 8; // Default fallback
    let confidence = 0.6; // Lower confidence for AI prediction
    
    if (historicalSegment) {
      baseETA = historicalSegment.averageTime;
      confidence = historicalSegment.confidence * 0.8; // Reduce confidence for AI prediction
    }
    
    // Account for time elapsed since last GPS update
    const adjustedETA = Math.max(1, baseETA - timeSinceLastUpdate);
    
    // Apply traffic and ML adjustments
    const finalETA = Math.round(adjustedETA * trafficFactor);
    
    return {
      stopId: targetStopId,
      eta: finalETA,
      confidence,
      isAIPredicted: true,
      method: 'historical'
    };
  }

  /**
   * Simulates ML model improvement over time
   */
  updateHistoricalData(route: string, fromStop: string, toStop: string, actualTime: number): void {
    const timeOfDay = this.getTimeOfDay();
    const dayType = this.getDayType();
    
    const existing = this.historicalData.find(h =>
      h.route === route &&
      h.fromStop === fromStop &&
      h.toStop === toStop &&
      h.timeOfDay === timeOfDay &&
      h.dayType === dayType
    );
    
    if (existing) {
      // Update with weighted average (ML learning simulation)
      existing.averageTime = (existing.averageTime * 0.8) + (actualTime * 0.2);
      existing.confidence = Math.min(0.98, existing.confidence + 0.01);
    } else {
      // Create new historical entry
      this.historicalData.push({
        route,
        fromStop,
        toStop,
        averageTime: actualTime,
        timeOfDay,
        dayType,
        confidence: 0.7
      });
    }
  }

  /**
   * Get occupancy prediction based on historical patterns
   */
  predictOccupancy(route: string, timeOfDay?: string): number {
    const currentTimeOfDay = timeOfDay || this.getTimeOfDay();
    
    // Mock occupancy patterns
    const occupancyPatterns: Record<string, Record<string, number>> = {
      'Route 15': { morning: 80, afternoon: 65, evening: 75, night: 30 },
      'Route 8': { morning: 70, afternoon: 55, evening: 65, night: 25 },
      'Route 12': { morning: 60, afternoon: 70, evening: 55, night: 20 },
      'Route 25': { morning: 85, afternoon: 75, evening: 90, night: 35 }
    };
    
    return occupancyPatterns[route]?.[currentTimeOfDay] || 50;
  }
}

export const etaService = new ETAService();