import { useState } from 'react';
import TransportMap from '@/components/TransportMap';
import AdminDashboard from '@/components/AdminDashboard';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState<'tracking' | 'admin'>('tracking');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentView === 'tracking' ? <TransportMap /> : <AdminDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
