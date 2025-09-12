import { useState, useEffect } from 'react';
import TransportMap from '@/components/TransportMap';
import AdminDashboard from '@/components/AdminDashboard';
import Navigation from '@/components/Navigation';
import AlertsPanel from '@/components/AlertsPanel';
import PanicButton from '@/components/PanicButton';
import LanguageSelector from '@/components/LanguageSelector';
import { languageService } from '@/services/languageService';

const Index = () => {
  const [currentView, setCurrentView] = useState<'tracking' | 'admin' | 'alerts'>('tracking');

  useEffect(() => {
    // Initialize language service
    languageService.initialize();
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tracking':
        return <TransportMap />;
      case 'admin':
        return <AdminDashboard />;
      case 'alerts':
        return <AlertsPanel />;
      default:
        return <TransportMap />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Top Bar with Language Selector */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderCurrentView()}
          </div>
        </div>
      </div>
      
      {/* Floating Panic Button - Only show on tracking view */}
      {currentView === 'tracking' && <PanicButton />}
    </div>
  );
};

export default Index;
