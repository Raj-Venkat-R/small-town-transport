import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Shield, Phone } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { languageService } from '@/services/languageService';
import { useToast } from '@/hooks/use-toast';

interface PanicButtonProps {
  busId?: string;
  location?: string;
}

const PanicButton = ({ busId = 'bus_current', location }: PanicButtonProps) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const { toast } = useToast();
  
  const t = (key: string, defaultValue?: string) => languageService.translate(key, defaultValue);

  const handlePanicTrigger = () => {
    setIsTriggered(true);
    
    // Trigger the panic alert
    notificationService.triggerPanicAlert(busId, location);
    
    // Show confirmation toast
    toast({
      title: t('panic.triggered', 'Emergency Alert Sent'),
      description: 'Emergency services have been notified. Help is on the way.',
      variant: 'destructive',
    });

    // Simulate emergency services notification
    setTimeout(() => {
      notificationService.createAlert(
        'safety',
        'Emergency Response',
        'Emergency services are en route. Estimated arrival: 5-7 minutes.',
        { severity: 'critical' }
      );
    }, 2000);

    // Reset after 30 seconds
    setTimeout(() => {
      setIsTriggered(false);
    }, 30000);
  };

  if (isTriggered) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-error text-error-foreground p-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-bold">Emergency Active</span>
          </div>
          <p className="text-sm">Services notified</p>
          <div className="flex items-center gap-1 text-xs mt-2">
            <Phone className="h-3 w-3" />
            <span>108 • Police • Fire</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="lg"
            className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse"
          >
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6" />
              <span className="text-xs font-bold">SOS</span>
            </div>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-error">
              <Shield className="h-5 w-5" />
              {t('panic.button', '🚨 Emergency Alert')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('panic.confirm', 'Are you sure you want to trigger an emergency alert? This will immediately notify:')}
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Emergency Services (108)</li>
                <li>Local Police</li>
                <li>Transport Authority</li>
                <li>Bus Driver & Control Center</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">
                Only use in genuine emergencies.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePanicTrigger}
              className="bg-error hover:bg-error/90 text-error-foreground"
            >
              {t('panic.button', '🚨 Trigger Emergency Alert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PanicButton;