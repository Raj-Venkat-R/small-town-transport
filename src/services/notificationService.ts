// Notification and Alert Service
export interface TransportAlert {
  id: string;
  type: 'arrival' | 'delay' | 'cancellation' | 'breakdown' | 'capacity' | 'safety';
  title: string;
  message: string;
  route?: string;
  busId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  acknowledged: boolean;
  autoHide?: number; // milliseconds
}

export interface NotificationPreferences {
  enablePush: boolean;
  enableSound: boolean;
  arrivalMinutesBefore: number;
  delayThresholdMinutes: number;
  capacityThreshold: number;
  routes: string[];
}

class NotificationService {
  private alerts: TransportAlert[] = [];
  private subscribers: ((alert: TransportAlert) => void)[] = [];
  private preferences: NotificationPreferences = {
    enablePush: true,
    enableSound: true,
    arrivalMinutesBefore: 5,
    delayThresholdMinutes: 3,
    capacityThreshold: 80,
    routes: []
  };

  subscribe(callback: (alert: TransportAlert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(alert: TransportAlert): void {
    this.subscribers.forEach(callback => callback(alert));
  }

  createAlert(
    type: TransportAlert['type'],
    title: string,
    message: string,
    options: Partial<Pick<TransportAlert, 'route' | 'busId' | 'severity' | 'autoHide'>> = {}
  ): TransportAlert {
    const alert: TransportAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      severity: options.severity || 'medium',
      timestamp: Date.now(),
      acknowledged: false,
      ...options
    };

    this.alerts.unshift(alert);
    this.notifySubscribers(alert);

    // Auto-hide if specified
    if (alert.autoHide) {
      setTimeout(() => {
        this.acknowledgeAlert(alert.id);
      }, alert.autoHide);
    }

    // Browser notification if supported and enabled
    if (this.preferences.enablePush && 'Notification' in window) {
      this.showBrowserNotification(alert);
    }

    return alert;
  }

  private async showBrowserNotification(alert: TransportAlert): Promise<void> {
    if (Notification.permission === 'granted') {
      const notification = new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert.id,
        requireInteraction: alert.severity === 'critical'
      });

      notification.onclick = () => {
        this.acknowledgeAlert(alert.id);
        notification.close();
      };
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(alert);
      }
    }
  }

  acknowledgeAlert(alertId: string): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].acknowledged = true;
    }
  }

  getAlerts(unacknowledgedOnly = false): TransportAlert[] {
    return unacknowledgedOnly 
      ? this.alerts.filter(a => !a.acknowledged)
      : this.alerts;
  }

  clearOldAlerts(olderThanHours = 24): void {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
  }

  // Predefined alert creators
  busArriving(route: string, busId: string, eta: number): TransportAlert {
    return this.createAlert(
      'arrival',
      `Bus Arriving Soon`,
      `${route} will arrive in ${eta} minutes`,
      { route, busId, severity: 'low', autoHide: 30000 }
    );
  }

  busDelayed(route: string, busId: string, delayMinutes: number): TransportAlert {
    const severity = delayMinutes > 10 ? 'high' : 'medium';
    return this.createAlert(
      'delay',
      `Bus Delayed`,
      `${route} is delayed by ${delayMinutes} minutes`,
      { route, busId, severity }
    );
  }

  busCancelled(route: string, busId: string, reason?: string): TransportAlert {
    return this.createAlert(
      'cancellation',
      `Service Cancelled`,
      `${route} service has been cancelled${reason ? `: ${reason}` : ''}`,
      { route, busId, severity: 'high' }
    );
  }

  busBreakdown(route: string, busId: string, location?: string): TransportAlert {
    return this.createAlert(
      'breakdown',
      `Bus Breakdown`,
      `${route} breakdown reported${location ? ` at ${location}` : ''}`,
      { route, busId, severity: 'high' }
    );
  }

  highCapacity(route: string, busId: string, occupancyPercent: number): TransportAlert {
    return this.createAlert(
      'capacity',
      `High Occupancy`,
      `${route} is ${occupancyPercent}% full - consider alternative transport`,
      { route, busId, severity: 'medium', autoHide: 60000 }
    );
  }

  safetyAlert(message: string, location?: string): TransportAlert {
    return this.createAlert(
      'safety',
      `Safety Alert`,
      message,
      { severity: 'critical' }
    );
  }

  // Panic button functionality
  triggerPanicAlert(busId: string, location?: string): TransportAlert {
    // In a real implementation, this would trigger emergency services
    return this.createAlert(
      'safety',
      `🚨 Emergency Alert`,
      `Panic button activated on bus ${busId}${location ? ` at ${location}` : ''}. Emergency services notified.`,
      { busId, severity: 'critical' }
    );
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Auto-generate realistic alerts for demo
  generateDemoAlerts(): void {
    const routes = ['Route 15', 'Route 8', 'Route 12', 'Route 25'];
    
    // Simulate some alerts
    setTimeout(() => {
      this.busArriving('Route 15', 'bus_001', 3);
    }, 2000);
    
    setTimeout(() => {
      this.busDelayed('Route 8', 'bus_003', 5);
    }, 5000);
    
    setTimeout(() => {
      this.highCapacity('Route 25', 'bus_007', 92);
    }, 8000);
  }
}

export const notificationService = new NotificationService();