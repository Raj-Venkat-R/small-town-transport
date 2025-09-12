import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  Bus, 
  Users, 
  Shield,
  X,
  CheckCircle
} from 'lucide-react';
import { notificationService, TransportAlert } from '@/services/notificationService';
import { languageService } from '@/services/languageService';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<TransportAlert[]>([]);
  const [language, setLanguage] = useState(languageService.getCurrentLanguage());
  
  const t = (key: string, defaultValue?: string) => languageService.translate(key, defaultValue);

  useEffect(() => {
    // Ensure language service is initialized
    languageService.initialize();
    
    // Subscribe to new alerts
    const unsubscribe = notificationService.subscribe((newAlert) => {
      setAlerts(current => [newAlert, ...current.slice(0, 9)]);
    });

    // Subscribe to language changes
    const unsubscribeLang = languageService.subscribe(() => {
      setLanguage(languageService.getCurrentLanguage());
    });

    // Load existing alerts
    setAlerts(notificationService.getAlerts().slice(0, 10));
    
    // Generate demo alerts
    notificationService.generateDemoAlerts();

    return () => {
      unsubscribe();
      unsubscribeLang();
    };
  }, []);

  const getAlertIcon = (type: TransportAlert['type']) => {
    switch (type) {
      case 'arrival':
        return <Bus className="h-4 w-4 text-primary" />;
      case 'delay':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancellation':
      case 'breakdown':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'capacity':
        return <Users className="h-4 w-4 text-warning" />;
      case 'safety':
        return <Shield className="h-4 w-4 text-error" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: TransportAlert['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'high':
        return 'bg-error text-error-foreground';
      case 'critical':
        return 'bg-destructive text-destructive-foreground animate-pulse';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    notificationService.acknowledgeAlert(alertId);
    setAlerts(current => 
      current.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.acknowledged) {
        notificationService.acknowledgeAlert(alert.id);
      }
    });
    setAlerts(current => current.map(alert => ({ ...alert, acknowledged: true })));
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
              </span>
            )}
          </div>
          {t('alerts.title')}
        </CardTitle>
        {unacknowledgedCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllAlerts}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('alerts.clear')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('alerts.noAlerts')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.acknowledged 
                      ? 'bg-muted/30 opacity-60' 
                      : 'bg-card shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.route && (
                            <Badge variant="outline" className="text-xs">
                              {alert.route}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;