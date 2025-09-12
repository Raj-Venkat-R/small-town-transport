import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, BarChart3, Settings, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: 'tracking' | 'admin';
  onViewChange: (view: 'tracking' | 'admin') => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: MapPin,
      description: 'Track buses in real-time'
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: BarChart3,
      description: 'Fleet monitoring & analytics'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden">
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-primary">CityTransit</h1>
              <p className="text-sm text-muted-foreground">Real-time tracking system</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onViewChange(item.id as 'tracking' | 'admin');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">CityTransit</h1>
              <p className="text-muted-foreground">Real-time public transport tracking</p>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <Button
                      variant={currentView === item.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => onViewChange(item.id as 'tracking' | 'admin')}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Navigation;