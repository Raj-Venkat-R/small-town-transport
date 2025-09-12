import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bus, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  MapPin,
  BarChart3,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for admin dashboard
  const fleetStats = {
    totalBuses: 45,
    activeBuses: 42,
    onTime: 38,
    delayed: 4,
    averageDelay: 3.2,
    ridership: 1247
  };

  const routes = [
    { id: 'R15', name: 'Route 15', onTimePercentage: 92, averageDelay: 2.1, ridership: 156 },
    { id: 'R8', name: 'Route 8', onTimePercentage: 87, averageDelay: 4.2, ridership: 203 },
    { id: 'R12', name: 'Route 12', onTimePercentage: 95, averageDelay: 1.8, ridership: 134 },
    { id: 'R25', name: 'Route 25', onTimePercentage: 78, averageDelay: 6.1, ridership: 189 },
  ];

  const recentAlerts = [
    { id: 1, type: 'delay', route: 'Route 8', message: 'Bus delayed by 8 minutes due to traffic', time: '2 min ago' },
    { id: 2, type: 'breakdown', route: 'Route 25', message: 'Bus breakdown reported at University Campus', time: '15 min ago' },
    { id: 3, type: 'capacity', route: 'Route 15', message: 'High occupancy (95%) reported', time: '23 min ago' },
  ];

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-warning';
    return 'text-error';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'breakdown':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'capacity':
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Transport Authority Dashboard</h1>
        <p className="text-muted-foreground">Real-time fleet monitoring and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.activeBuses}/{fleetStats.totalBuses}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((fleetStats.activeBuses / fleetStats.totalBuses) * 100)}% operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {Math.round((fleetStats.onTime / fleetStats.activeBuses) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {fleetStats.onTime} of {fleetStats.activeBuses} buses on time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Delay</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {fleetStats.averageDelay} min
            </div>
            <p className="text-xs text-muted-foreground">
              Across all active routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Ridership</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.ridership.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Route Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{route.id}</Badge>
                    <span className="font-medium">{route.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={getPerformanceColor(route.onTimePercentage)}>
                      {route.onTimePercentage}% on-time
                    </span>
                    <span className="text-muted-foreground">
                      {route.averageDelay}min avg delay
                    </span>
                    <span className="text-muted-foreground">
                      {route.ridership} riders
                    </span>
                  </div>
                </div>
                <Progress 
                  value={route.onTimePercentage} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{alert.route}</Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;