// Multi-language Support Service
export interface Translation {
  [key: string]: string | Translation;
}

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn';

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    'nav.tracking': 'Live Tracking',
    'nav.admin': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.alerts': 'Alerts',
    
    // Bus Tracking
    'tracking.title': 'Live Bus Tracking',
    'tracking.realtime': 'Real-time updates',
    'tracking.selectStop': 'Select a stop',
    'tracking.noBuses': 'No buses currently scheduled for this stop',
    'tracking.arrivingAt': 'Buses arriving at',
    'tracking.from': 'From',
    'tracking.minutes': 'min',
    'tracking.delay': 'delay',
    'tracking.capacity': 'Capacity',
    
    // Status
    'status.onTime': 'ON TIME',
    'status.delayed': 'DELAYED',
    'status.arriving': 'ARRIVING',
    'status.cancelled': 'CANCELLED',
    
    // Admin Dashboard
    'admin.title': 'Transport Authority Dashboard',
    'admin.subtitle': 'Real-time fleet monitoring and analytics',
    'admin.activeBuses': 'Active Buses',
    'admin.operational': 'operational',
    'admin.onTimePerformance': 'On-Time Performance',
    'admin.averageDelay': 'Average Delay',
    'admin.ridership': 'Today\'s Ridership',
    'admin.routePerformance': 'Route Performance Analysis',
    'admin.recentAlerts': 'Recent Alerts',
    'admin.fromYesterday': 'from yesterday',
    'admin.acrossRoutes': 'Across all active routes',
    
    // Alerts
    'alerts.title': 'Notifications',
    'alerts.noAlerts': 'No new alerts',
    'alerts.acknowledge': 'Acknowledge',
    'alerts.clear': 'Clear All',
    'alerts.busArriving': 'Bus Arriving Soon',
    'alerts.busDelayed': 'Bus Delayed',
    'alerts.busCancelled': 'Service Cancelled',
    'alerts.breakdown': 'Bus Breakdown',
    'alerts.highCapacity': 'High Occupancy',
    'alerts.safety': 'Safety Alert',
    'alerts.emergency': '🚨 Emergency Alert',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.enablePush': 'Enable Push Notifications',
    'settings.enableSound': 'Enable Sound',
    'settings.arrivalAlert': 'Alert before arrival',
    'settings.delayThreshold': 'Delay alert threshold',
    'settings.capacityThreshold': 'Capacity alert threshold',
    
    // ETA Predictions
    'eta.predicted': 'Predicted ETA (AI-estimated)',
    'eta.gps': 'Live GPS Tracking',
    'eta.confidence': 'Confidence',
    
    // Panic Button
    'panic.button': '🚨 Emergency',
    'panic.confirm': 'Are you sure you want to trigger emergency alert?',
    'panic.triggered': 'Emergency services have been notified',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.ok': 'OK',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
  },
  
  hi: {
    // Hindi translations
    'nav.tracking': 'लाइव ट्रैकिंग',
    'nav.admin': 'डैशबोर्ड',
    'nav.settings': 'सेटिंग्स',
    'nav.alerts': 'अलर्ट',
    
    'tracking.title': 'लाइव बस ट्रैकिंग',
    'tracking.realtime': 'रियल-टाइम अपडेट',
    'tracking.selectStop': 'एक स्टॉप चुनें',
    'tracking.noBuses': 'इस स्टॉप के लिए कोई बस उपलब्ध नहीं',
    'tracking.arrivingAt': 'बसें आ रही हैं',
    'tracking.from': 'से',
    'tracking.minutes': 'मिनट',
    'tracking.delay': 'देरी',
    'tracking.capacity': 'क्षमता',
    
    'status.onTime': 'समय पर',
    'status.delayed': 'देरी से',
    'status.arriving': 'आ रही है',
    'status.cancelled': 'रद्द',
    
    'admin.title': 'परिवहन प्राधिकरण डैशबोर्ड',
    'admin.subtitle': 'रियल-टाइम फ्लीट मॉनिटरिंग और एनालिटिक्स',
    'admin.activeBuses': 'सक्रिय बसें',
    'admin.operational': 'परिचालन में',
    
    'panic.button': '🚨 आपातकाल',
    'panic.confirm': 'क्या आप वाकई आपातकालीन अलर्ट ट्रिगर करना चाहते हैं?',
    
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.ok': 'ठीक है',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
  },
  
  te: {
    // Telugu translations
    'nav.tracking': 'లైవ్ ట్రాకింగ్',
    'nav.admin': 'డ్యాష్‌బోర్డ్',
    'nav.settings': 'సెట్టింగ్స్',
    'nav.alerts': 'అలర్ట్స్',
    
    'tracking.title': 'లైవ్ బస్ ట్రాకింగ్',
    'tracking.realtime': 'రియల్-టైమ్ అప్‌డేట్స్',
    'tracking.arrivingAt': 'బస్సులు వస్తున్నాయి',
    'tracking.minutes': 'నిమిషాలు',
    
    'status.onTime': 'సమయానికి',
    'status.delayed': 'ఆలస్యం',
    'status.arriving': 'వస్తోంది',
    
    'panic.button': '🚨 అత్యవసరం',
    'common.ok': 'సరే',
  },
  
  ta: {
    // Tamil translations
    'nav.tracking': 'நேரடி கண்காணிப்பு',
    'nav.admin': 'டாஷ்போர்டு',
    'nav.settings': 'அமைப்புகள்',
    
    'tracking.title': 'நேரடி பேருந்து கண்காணிப்பு',
    'tracking.realtime': 'நிகழ்நேர புதுப்பிப்புகள்',
    'tracking.minutes': 'நிமிடங்கள்',
    
    'status.onTime': 'நேரத்தில்',
    'status.delayed': 'தாமதம்',
    
    'panic.button': '🚨 அவசரம்',
    'common.ok': 'சரி',
  },
  
  kn: {
    // Kannada translations
    'nav.tracking': 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'nav.admin': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    
    'tracking.title': 'ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'tracking.realtime': 'ನೈಜ ಸಮಯ ಅಪ್‌ಡೇಟ್‌ಗಳು',
    'tracking.minutes': 'ನಿಮಿಷಗಳು',
    
    'status.onTime': 'ಸಮಯಕ್ಕೆ',
    'status.delayed': 'ತಡವಾಗಿ',
    
    'panic.button': '🚨 ತುರ್ತು',
    'common.ok': 'ಸರಿ',
  }
};

class LanguageService {
  private currentLanguage: Language = 'en';
  private subscribers: (() => void)[] = [];

  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    this.notifySubscribers();
    localStorage.setItem('transport_app_language', lang);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  getAvailableLanguages(): { code: Language; name: string; nativeName: string }[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    ];
  }

  translate(key: string, defaultValue?: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    // Fallback to English if translation not found
    if (!value && this.currentLanguage !== 'en') {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
    }
    
    return value || defaultValue || key;
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  initialize(): void {
    const savedLang = localStorage.getItem('transport_app_language') as Language;
    if (savedLang && this.getAvailableLanguages().find(l => l.code === savedLang)) {
      this.currentLanguage = savedLang;
    }
  }
}

export const languageService = new LanguageService();