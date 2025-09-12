import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bus, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  MapPin,
  BarChart3,
  Activity,
  Leaf,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { languageService } from '@/services/languageService';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const t = (key: string, defaultValue?: string) => languageService.translate(key, defaultValue);
  
  useEffect(() => {
    // Ensure language service is initialized
    languageService.initialize();
  }, []);
  
  // Enhanced mock data for comprehensive dashboard
  const fleetStats = {
    totalBuses: 45,
    activeBuses: 42,
    onTime: 38,
    delayed: 4,
    averageDelay: 3.2,
    ridership: 1247,
    ridershipsYesterday: 1112,
    fuelSaved: 2340, // liters
    co2Saved: 5.8, // tons
    costSavings: 156000, // rupees
    predictedRidership: 1380, // tomorrow's prediction
    peakHourUtilization: 87,
    offPeakUtilization: 34
  };

  const routes = [
    { id: 'R15', name: 'Route 15', onTimePercentage: 92, averageDelay: 2.1, ridership: 156, co2Saved: 1.2 },
    { id: 'R8', name: 'Route 8', onTimePercentage: 87, averageDelay: 4.2, ridership: 203, co2Saved: 1.5 },
    { id: 'R12', name: 'Route 12', onTimePercentage: 95, averageDelay: 1.8, ridership: 134, co2Saved: 1.0 },
    { id: 'R25', name: 'Route 25', onTimePercentage: 78, averageDelay: 6.1, ridership: 189, co2Saved: 1.4 },
  ];

  const recentAlerts = [
    { id: 1, type: 'delay', route: 'Route 8', message: 'Bus delayed by 8 minutes due to traffic', time: '2 min ago' },
    { id: 2, type: 'breakdown', route: 'Route 25', message: 'Bus breakdown reported at University Campus', time: '15 min ago' },
    { id: 3, type: 'capacity', route: 'Route 15', message: 'High occupancy (95%) reported', time: '23 min ago' },
  ];

  const predictiveInsights = [
    {
      prediction: 'Route 25 will experience delays during peak hours',
      impact: 'Consider deploying additional buses or adjusting schedules',
      confidence: 87,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      prediction: 'High ridership expected on Route 8 tomorrow morning',
      impact: 'Prepare for increased capacity requirements',
      confidence: 92,
      icon: <Users className="h-4 w-4" />
    },
    {
      prediction: 'Weather conditions may affect Route 12 performance',
      impact: 'Monitor road conditions and adjust ETAs accordingly',
      confidence: 75,
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  const sustainabilityMetrics = {
    totalCO2Saved: 5.8,
    fuelSaved: 2340,
    privateCarsReplaced: 156,
    costSavingsToCommuters: 156000
  };

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
      case 'maintenance':
        return <Target className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('admin.title', 'Transport Authority Dashboard')}</h1>
        <p className="text-muted-foreground">{t('admin.subtitle', 'Real-time fleet monitoring and analytics')}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.activeBuses', 'Active Buses')}</CardTitle>
                <Bus className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fleetStats.activeBuses}/{fleetStats.totalBuses}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((fleetStats.activeBuses / fleetStats.totalBuses) * 100)}% {t('admin.operational')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.onTimePerformance')}</CardTitle>
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
                <CardTitle className="text-sm font-medium">{t('admin.averageDelay')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {fleetStats.averageDelay} min
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('admin.acrossRoutes')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.ridership')}</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fleetStats.ridership.toLocaleString()}
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  +{Math.round(((fleetStats.ridership - fleetStats.ridershipsYesterday) / fleetStats.ridershipsYesterday) * 100)}% {t('admin.fromYesterday')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          {/* Route Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('admin.routePerformance')}
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
                        <span className="text-success">
                          {route.co2Saved}t CO₂ saved
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
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictive Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI-Powered Predictive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-4 rounded-lg bg-accent/50 border">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-primary">
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{insight.prediction}</h4>
                          <Badge variant="outline">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Recommendation:</strong> {insight.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tomorrow's Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tomorrow's Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">
                    {fleetStats.predictedRidership}
                  </div>
                  <p className="text-sm text-muted-foreground">Expected Riders</p>
                  <p className="text-xs text-success">+10% vs today</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <div className="text-2xl font-bold text-warning">
                    4.1 min
                  </div>
                  <p className="text-sm text-muted-foreground">Predicted Avg Delay</p>
                  <p className="text-xs text-error">+0.9 min vs today</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">
                    89%
                  </div>
                  <p className="text-sm text-muted-foreground">Expected On-Time %</p>
                  <p className="text-xs text-success">+2% vs today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          {/* Sustainability Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Saved Today</CardTitle>
                <Leaf className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {sustainabilityMetrics.totalCO2Saved} tons
                </div>
                <p className="text-xs text-muted-foreground">
                  vs private vehicles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sustainabilityMetrics.fuelSaved.toLocaleString()} L
                </div>
                <p className="text-xs text-muted-foreground">
                  Petrol/Diesel equivalent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cars Replaced</CardTitle>
                <Users className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sustainabilityMetrics.privateCarsReplaced}
                </div>
                <p className="text-xs text-muted-foreground">
                  Private vehicles off road
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  ₹{(sustainabilityMetrics.costSavingsToCommuters / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-muted-foreground">
                  Commuter savings today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Impact Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Environmental Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-success/20 to-primary/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Making a Difference</h3>
                  <p className="text-muted-foreground">
                    Your public transport system is actively contributing to a cleaner, more sustainable city.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily CO₂ Reduction</span>
                      <span className="font-medium">{sustainabilityMetrics.totalCO2Saved} tons</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">85% of city target achieved</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Traffic Reduction</span>
                      <span className="font-medium">{sustainabilityMetrics.privateCarsReplaced} cars</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-xs text-muted-foreground">72% of monthly target achieved</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Alerts - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('admin.recentAlerts', 'Recent Alerts')}
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