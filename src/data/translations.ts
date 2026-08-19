import { Language } from '../types';

export interface TranslationSchema {
  appTitle: string;
  appSubtitle: string;
  tabs: {
    map: string;
    list: string;
    pay: string;
    timer: string;
    vehicle: string;
  };
  zones: {
    title: string;
    zone0: string;
    zone1: string;
    zone2: string;
    shortCodeLabel: string;
    pricePerHour: string;
    pricePerDay: string;
  };
  workingHours: {
    label: string;
    activeText: string;
    freeText: string;
  };
  smsPayment: {
    title: string;
    selectZone: string;
    licensePlateLabel: string;
    licensePlatePlaceholder: string;
    recentPlates: string;
    selectDuration: string;
    hourly: string;
    dayTicket: string;
    totalAmount: string;
    sendSmsButton: string;
    copySms: string;
    copied: string;
    timerStarted: string;
    instructions: string;
    smsWarning: string;
  };
  navigation: {
    title: string;
    navigate: string;
    stopNav: string;
    distance: string;
    estTime: string;
    arrived: string;
    offlineMode: string;
    offlineRouteNotice: string;
    stepsHeader: string;
    startPoint: string;
  };
  parkingList: {
    searchPlaceholder: string;
    allZones: string;
    allAreas: string;
    spaces: string;
    garage: string;
    openLot: string;
    noResults: string;
    locateClosest: string;
    closestBadge: string;
    mapButton: string;
    routeButton: string;
    paySmsButton: string;
    dayPrice: string;
    zoneLabel: string;
  };
  timer: {
    title: string;
    noActiveSession: string;
    expiresIn: string;
    extendParking: string;
    vehicle: string;
    zone: string;
    startedAt: string;
    expiresAt: string;
    warning10Min: string;
    cancelSession: string;
    historyTitle?: string;
    dayTotal?: string;
    monthTotal?: string;
    totalPayments?: string;
    totalSpent?: string;
    clearHistory?: string;
    noHistory?: string;
    repaySms?: string;
  };
  pwa: {
    installPrompt: string;
    installButton: string;
    offlineReady: string;
    onlineMode: string;
  };
  common: {
    cancel: string;
    confirm: string;
    close: string;
    details: string;
    features: string;
    address: string;
    area: string;
    priceList?: string;
    zoneNumbers?: string;
  };
  vehicle: {
    title: string;
    subtitle: string;
    add: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  bs: {
    appTitle: 'Gradski Parking Tuzla',
    appSubtitle: 'Pametni parking & navigacija',
    tabs: {
      map: 'Karta',
      list: 'Lista',
      pay: 'Plati SMS',
      timer: 'Tajmer',
      vehicle: 'Vozilo',
    },
    zones: {
      title: 'Parking Zone Tuzla',
      zone0: 'Zona 0 (Crvena - Najuži Centar)',
      zone1: 'Zona 1 (Žuta - Šira Gradstka Zona)',
      zone2: 'Zona 2 (Zelena - Periferija)',
      shortCodeLabel: 'SMS Broj',
      pricePerHour: 'KM/h',
      pricePerDay: 'KM/Dan',
    },
    workingHours: {
      label: 'Radno vrijeme: 07:00h - 22:00h',
      activeText: 'Naplata u toku (07:00 - 22:00)',
      freeText: 'Besplatan parking (Van radnog vremena)',
    },
    smsPayment: {
      title: 'SMS Plaćanje Parkinga',
      selectZone: 'Odaberite Zonu',
      licensePlateLabel: 'Registarska Oznaka',
      licensePlatePlaceholder: 'Npr. E12M345 ili A12-K-345',
      recentPlates: 'Prethodne tablice:',
      selectDuration: 'Trajanje Parkiranja',
      hourly: 'Sati',
      dayTicket: 'Dnevna Karta',
      totalAmount: 'Ukupno za platiti',
      sendSmsButton: 'POŠALJI SMS SADA',
      copySms: 'Kopiraj SMS Tekst',
      copied: 'Kopirano!',
      timerStarted: 'Aktiviran tajmer parkinga!',
      instructions: 'Pritiskom na dugme otvara se vaša SMS aplikacija sa pripremljenim tekstom i brojem.',
      smsWarning: 'Provjerite povratnu SMS poruku potvrde od operatera.',
    },
    navigation: {
      title: 'Navigacija do Parkinga',
      navigate: 'Navigacija',
      stopNav: 'Zaustavi Navigaciju',
      distance: 'Udaljenost',
      estTime: 'Procjena',
      arrived: 'Stigli ste na parking!',
      offlineMode: 'Offline Mapa & Navigacija',
      offlineRouteNotice: 'Prikazan je cached/offline koridor navigacije.',
      stepsHeader: 'Upute skretanja',
      startPoint: 'Vaša Lokacija',
    },
    parkingList: {
      searchPlaceholder: 'Pretraži parking ili adresu...',
      allZones: 'Sve Zone',
      allAreas: 'Sva Područja',
      spaces: 'mjesta',
      garage: 'Garaža',
      openLot: 'Otvoreni Parking',
      noResults: 'Nije pronađen nijedan parking.',
      locateClosest: 'Pronađi Najbliži Parking',
      closestBadge: 'Najbliže',
      mapButton: 'Karta',
      routeButton: 'Ruta',
      paySmsButton: 'Plati SMS',
      dayPrice: 'Dan',
      zoneLabel: 'Zona',
    },
    timer: {
      title: 'Aktivni Parking Tajmer',
      noActiveSession: 'Nemate aktivnih SMS parkiranja.',
      expiresIn: 'Ističe za',
      extendParking: 'Produži Parking (+1h)',
      vehicle: 'Vozilo',
      zone: 'Zona',
      startedAt: 'Započeto',
      expiresAt: 'Ističe u',
      warning10Min: 'PAŽNJA: Parking ističe za manje od 10 minuta!',
      cancelSession: 'Završi Sesiju',
      historyTitle: 'Historija Plaćanja & Statistika',
      dayTotal: 'Danas ukupno',
      monthTotal: 'Ovaj mjesec',
      totalPayments: 'Ukupno plaćanja',
      totalSpent: 'Ukupno potrošeno',
      clearHistory: 'Obriši historiju',
      noHistory: 'Nema zabilježenih prethodnih plaćanja.',
      repaySms: 'Ponovo plati',
    },
    pwa: {
      installPrompt: 'Instalirajte Tuzla Parking aplikaciju za brzi pristup i offline rad.',
      installButton: 'Instaliraj PWA',
      offlineReady: 'Offline Režim Radi',
      onlineMode: 'Mreža Aktivna',
    },
    common: {
      cancel: 'Odustani',
      confirm: 'Potvrdi',
      close: 'Zatvori',
      details: 'Detalji',
      features: 'Karakteristike',
      address: 'Adresa',
      area: 'Područje',
      priceList: 'Cjenovnik',
      zoneNumbers: 'Brojevi Zona',
    },
    vehicle: {
      title: 'Moja vozila/tablice',
      subtitle: 'Pametno upravljanje glasom',
      add: 'Dodaj vozilo',
    },
  },
      

  en: {
    appTitle: 'Gradski Parking Tuzla',
    appSubtitle: 'Smart Parking & Navigation',
    tabs: {
      map: 'Map',
      list: 'Parking List',
      pay: 'Pay SMS',
      timer: 'Timer',
      vehicle: 'Vehicle',
    },
    zones: {
      title: 'Tuzla Parking Zones',
      zone0: 'Zone 0 (Red - City Core)',
      zone1: 'Zone 1 (Yellow - Extended Area)',
      zone2: 'Zone 2 (Green - Outer Belt)',
      shortCodeLabel: 'SMS Code',
      pricePerHour: 'KM/h',
      pricePerDay: 'KM/Day',
    },
    workingHours: {
      label: 'Working Hours: 07:00 - 22:00',
      activeText: 'Tariff Active (07:00 - 22:00)',
      freeText: 'Free Parking (Off-peak hours)',
    },
    smsPayment: {
      title: 'SMS Parking Payment',
      selectZone: 'Select Zone',
      licensePlateLabel: 'License Plate Number',
      licensePlatePlaceholder: 'e.g. E12M345 or A12-K-345',
      recentPlates: 'Recent Plates:',
      selectDuration: 'Select Duration',
      hourly: 'Hours',
      dayTicket: 'Daily Ticket',
      totalAmount: 'Total Payable',
      sendSmsButton: 'SEND SMS NOW',
      copySms: 'Copy SMS Text',
      copied: 'Copied!',
      timerStarted: 'Parking timer started!',
      instructions: 'Tapping button opens your native SMS messaging app with auto-filled number and message.',
      smsWarning: 'Ensure you receive a confirmation SMS reply from the operator.',
    },
    navigation: {
      title: 'Navigate to Parking',
      navigate: 'Navigate',
      stopNav: 'End Route',
      distance: 'Distance',
      estTime: 'Est. Time',
      arrived: 'You arrived at the parking lot!',
      offlineMode: 'Offline Map & Routing',
      offlineRouteNotice: 'Displaying cached offline navigation route.',
      stepsHeader: 'Turn-by-turn Directions',
      startPoint: 'Your Location',
    },
    parkingList: {
      searchPlaceholder: 'Search parking name or address...',
      allZones: 'All Zones',
      allAreas: 'All Areas',
      spaces: 'spaces',
      garage: 'Garage',
      openLot: 'Open Lot',
      noResults: 'No parking lots found matching query.',
      locateClosest: 'Locate Closest Parking',
      closestBadge: 'Closest',
      mapButton: 'Map',
      routeButton: 'Route',
      paySmsButton: 'Pay SMS',
      dayPrice: 'Day',
      zoneLabel: 'Zone',
    },
    timer: {
      title: 'Active Parking Countdown',
      noActiveSession: 'No active SMS parking session right now.',
      expiresIn: 'Expires in',
      extendParking: 'Extend Parking (+1h)',
      vehicle: 'Vehicle',
      zone: 'Zone',
      startedAt: 'Started at',
      expiresAt: 'Expires at',
      warning10Min: 'WARNING: Parking expires in less than 10 minutes!',
      cancelSession: 'Clear Session',
      historyTitle: 'Payment History & Statistics',
      dayTotal: 'Today Total',
      monthTotal: 'This Month',
      totalPayments: 'Total Payments',
      totalSpent: 'Total Spent',
      clearHistory: 'Clear History',
      noHistory: 'No previous payment records stored.',
      repaySms: 'Re-pay SMS',
    },
    pwa: {
      installPrompt: 'Install Tuzla Parking PWA for instant access and full offline navigation.',
      installButton: 'Install App',
      offlineReady: 'Offline Mode Active',
      onlineMode: 'Connected',
    },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      details: 'Details',
      features: 'Features',
      address: 'Address',
      area: 'Area',
    },
    vehicle: {
      title: 'My Vehicles/Plates',
      subtitle: 'Manage your saved vehicle plates',
      add: 'Add Vehicle',
    },
  },
  
de: {
    appTitle: 'Gradski Parking Tuzla',
    appSubtitle: 'Intelligentes Parken & Navigation',
    tabs: {
      map: 'Karte',
      list: 'Parkplätze',
      pay: 'SMS Bezahlen',
      timer: 'Parkuhr',
      vehicle: 'Fahrzeug',
    },
    zones: {
      title: 'Tuzla Parkzonen',
      zone0: 'Zone 0 (Rot - Stadtzentrum)',
      zone1: 'Zone 1 (Gelb - Erweiterte Zone)',
      zone2: 'Zone 2 (Grün - Außenbereich)',
      shortCodeLabel: 'SMS-Nummer',
      pricePerHour: 'KM/Std.',
      pricePerDay: 'KM/Tag',
    },
    workingHours: {
      label: 'Betriebszeiten: 07:00 - 22:00 Uhr',
      activeText: 'Gebührenpflichtig (07:00 - 22:00)',
      freeText: 'Kostenloses Parken (Außerhalb der Zeiten)',
    },
    smsPayment: {
      title: 'SMS-Parkzahlung',
      selectZone: 'Zone Auswählen',
      licensePlateLabel: 'Kennzeichen',
      licensePlatePlaceholder: 'z.B. E12M345 oder A12-K-345',
      recentPlates: 'Bisherige Kennzeichen:',
      selectDuration: 'Dauer Wählen',
      hourly: 'Stunden',
      dayTicket: 'Tageskarte',
      totalAmount: 'Gesamtbetrag',
      sendSmsButton: 'JETZT SMS SENDEN',
      copySms: 'SMS Text Kopieren',
      copied: 'Kopiert!',
      timerStarted: 'Parkuhr gestartet!',
      instructions: 'Beim Tippen wird Ihre SMS-App mit vorausgefüllter Nummer und Nachricht geöffnet.',
      smsWarning: 'Achten Sie auf die Bestätigungs-SMS des Betreibers.',
    },
    navigation: {
      title: 'Navigation zum Parkplatz',
      navigate: 'Navigieren',
      stopNav: 'Beenden',
      distance: 'Entfernung',
      estTime: 'Geschätzte Zeit',
      arrived: 'Sie sind am Parkplatz angekommen!',
      offlineMode: 'Offline-Karte & Navigation',
      offlineRouteNotice: 'Ihnen wird eine zwischengespeicherte Offline-Route angezeigt.',
      stepsHeader: 'Routenanweisungen',
      startPoint: 'Ihr Standort',
    },
    parkingList: {
      searchPlaceholder: 'Parkplatz oder Adresse suchen...',
      allZones: 'Alle Zonen',
      allAreas: 'Alle Bereiche',
      spaces: 'Stellplätze',
      garage: 'Parkgarage',
      openLot: 'Offener Parkplatz',
      noResults: 'Keine Parkplätze gefunden.',
      locateClosest: 'Nächsten Parkplatz finden',
      closestBadge: 'Nächster',
      mapButton: 'Karte',
      routeButton: 'Route',
      paySmsButton: 'SMS Bezahlen',
      dayPrice: 'Tag',
      zoneLabel: 'Zone',
    },
    timer: {
      title: 'Aktive Parkuhr',
      noActiveSession: 'Derzeit kein aktiver Parkschein.',
      expiresIn: 'Endet in',
      extendParking: 'Parkzeit Verlängern (+1 Std.)',
      vehicle: 'Fahrzeug',
      zone: 'Zone',
      startedAt: 'Gestartet um',
      expiresAt: 'Endet um',
      warning10Min: 'ACHTUNG: Ihr Parkschein läuft in unter 10 Minuten ab!',
      cancelSession: 'Sitzung Beenden',
      historyTitle: 'Zahlungshistorie & Statistik',
      dayTotal: 'Heute Gesamt',
      monthTotal: 'Diesen Monat',
      totalPayments: 'Zahlungen Ges.',
      totalSpent: 'Gesamtausgaben',
      clearHistory: 'Historie Löschen',
      noHistory: 'Keine bisherigen Zahlungen gespeichert.',
      repaySms: 'Erneut Zählen',
    },
    pwa: {
      installPrompt: 'Installieren Sie Tuzla Parking als App für schnellen Zugriff und Offline-Nutzung.',
      installButton: 'App Installieren',
      offlineReady: 'Offline-Modus Bereit',
      onlineMode: 'Online',
    },
    common: {
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      close: 'Schließen',
      details: 'Details',
      features: 'Ausstattung',
      address: 'Adresse',
      area: 'Bereich',
    },
    vehicle: {
      title: 'Sprachbefehle',
      subtitle: 'Intelligenter Sprachassistent',
      add: 'Fahrzeug Hinzufügen',},
  },
};
