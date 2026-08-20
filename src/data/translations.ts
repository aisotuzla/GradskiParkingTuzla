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
  header: {
    workingHoursUntil: string;
    offWorkingHours: string;
    live: string;
    offline: string;
    installApp: string;
  };
  zones: {
    title: string;
    all: string;
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
    openSmsPay: string;
    invalidPlateAlert: string;
  };
  navigation: {
    title: string;
    navigate: string;
    stopNav: string;
    distance: string;
    estTime: string;
    arrived: string;
    arrivedSms: string;
    offlineMode: string;
    offlineRouteNotice: string;
    stepsHeader: string;
    startPoint: string;
    turnLeft: string;
    turnRight: string;
    goStraight: string;
    continueDriving: string;
    headTowardsMainRoad: string;
    followCorridorTowards: string;
    turnTowards: string;
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
    historyTitle: string;
    historySubtitle: string;
    recordedPayments: string;
    dayTotal: string;
    monthTotal: string;
    totalPayments: string;
    totalSpent: string;
    clearHistory: string;
    clearHistoryConfirm: string;
    noHistory: string;
    repaySms: string;
    expiryNotifications: string;
    autoAlert10Min: string;
    enablePush: string;
    enable: string;
    active: string;
    hourShort: string;
  };
  vehicle: {
    title: string;
    subtitle: string;
    add: string;
    inputPlaceholder: string;
    noSavedPlates: string;
    delete: string;
    priceListTitle: string;
    priceListSubtitle: string;
    hour: string;
    day: string;
    smsNumber: string;
  };
  pwa: {
    installTitle: string;
    installPrompt: string;
    installButton: string;
    downloadApp: string;
    offlineReady: string;
    onlineMode: string;
    howToInstall: string;
    iosInstructionsTitle: string;
    iosInstructionsStep1: string;
    iosInstructionsStep2: string;
    androidInstructionsTitle: string;
    androidInstructionsStep1: string;
    desktopInstructionsTitle: string;
    desktopInstructionsStep1: string;
    close: string;
  };
  common: {
    cancel: string;
    confirm: string;
    close: string;
    details: string;
    features: string;
    address: string;
    area: string;
    priceList: string;
    zoneNumbers: string;
    total: string;
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
      vehicle: 'Vozila',
    },
    header: {
      workingHoursUntil: 'Radno vrijeme do 22:00h',
      offWorkingHours: 'Van radnog vremena',
      live: 'UŽIVO',
      offline: 'OFFLINE',
      installApp: 'Preuzmi / Instaliraj aplikaciju',
    },
    zones: {
      title: 'Parking Zone Tuzla',
      all: 'SVE',
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
      licensePlatePlaceholder: 'Npr. E12-M-345 ili A12-K-345',
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
      openSmsPay: 'Otvori SMS Plaćanje',
      invalidPlateAlert: 'Molimo unesite ispravnu registarsku oznaku (npr. E12-M-345)',
    },
    navigation: {
      title: 'Navigacija do Parkinga',
      navigate: 'Navigacija',
      stopNav: 'Zaustavi Navigaciju',
      distance: 'Udaljenost',
      estTime: 'Procjena',
      arrived: 'Stigli ste na parking!',
      arrivedSms: 'Stigao sam - SMS',
      offlineMode: 'Offline Mapa & Navigacija',
      offlineRouteNotice: 'Prikazan je cached/offline koridor navigacije.',
      stepsHeader: 'Upute skretanja',
      startPoint: 'Vaša Lokacija',
      turnLeft: 'Skrenite lijevo',
      turnRight: 'Skrenite desno',
      goStraight: 'Nastavite pravo',
      continueDriving: 'Nastavite vožnju',
      headTowardsMainRoad: 'Krenite od trenutne lokacije prema glavnoj saobraćajnici.',
      followCorridorTowards: 'Pratite koridor saobraćajnice prema području',
      turnTowards: 'Skrenite prema',
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
      historySubtitle: 'Pregled potrošnje i evidencija SMS kartica',
      recordedPayments: 'Zabilježena Plaćanja',
      dayTotal: 'Danas ukupno',
      monthTotal: 'Ovaj mjesec',
      totalPayments: 'Transakcije',
      totalSpent: 'Ukupno potrošeno',
      clearHistory: 'Obriši historiju',
      clearHistoryConfirm: 'Sigurno želite obrisati historiju plaćanja?',
      noHistory: 'Nema zabilježenih prethodnih plaćanja.',
      repaySms: 'Ponovo plati',
      expiryNotifications: 'Obavještenja o isteku',
      autoAlert10Min: 'Automatsko upozorenje 10 min prije isteka',
      enablePush: 'Uključi push notifikacije kad parking ističe',
      enable: 'Omogući',
      active: 'Aktivno',
      hourShort: 'h',
    },
    vehicle: {
      title: 'Moja Vozila / Tablice',
      subtitle: 'Spremljene registarske oznake za brže SMS plaćanje',
      add: 'Dodaj',
      inputPlaceholder: 'Npr. A12-K-345',
      noSavedPlates: 'Nema spremljenih tablica.',
      delete: 'Obriši',
      priceListTitle: 'Cjenovnik & Brojevi Zona',
      priceListSubtitle: 'Javni Gradski Parking Tuzla',
      hour: 'Sat',
      day: 'Dan',
      smsNumber: 'SMS Broj',
    },
    pwa: {
      installTitle: 'Instalirajte Tuzla Parking App',
      installPrompt: 'Instalirajte Tuzla Parking aplikaciju na vaš telefon ili računara za brzi pristup i rad bez interneta.',
      installButton: 'Instaliraj PWA Aplikaciju',
      downloadApp: 'Preuzmi Aplikaciju',
      offlineReady: 'Offline Režim Radi',
      onlineMode: 'Mreža Aktivna',
      howToInstall: 'Kako instalirati aplikaciju na uređaj:',
      iosInstructionsTitle: 'iPhone / iPad (iOS Safari)',
      iosInstructionsStep1: 'Dodirnite dugme za dijeljenje ⎘ pri dnu ekrana u Safari pregledniku.',
      iosInstructionsStep2: 'Izaberite opciju "Dodaj na početni ekran ➕" (Add to Home Screen).',
      androidInstructionsTitle: 'Android (Chrome / Edge)',
      androidInstructionsStep1: 'Dodirnite meni (⋮) u gornjem desnom uglu i izaberite "Dodaj na početni ekran" ili "Instaliraj aplikaciju".',
      desktopInstructionsTitle: 'Računar (Desktop Chrome / Edge)',
      desktopInstructionsStep1: 'Kliknite na ikonu za instalaciju ⊕ u traci za adrese na vrhu preglednika.',
      close: 'Zatvori',
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
      total: 'UKUPNO',
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
      vehicle: 'Vehicles',
    },
    header: {
      workingHoursUntil: 'Working Hours until 22:00h',
      offWorkingHours: 'Off Working Hours',
      live: 'LIVE',
      offline: 'OFFLINE',
      installApp: 'Download / Install App',
    },
    zones: {
      title: 'Tuzla Parking Zones',
      all: 'ALL',
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
      licensePlatePlaceholder: 'e.g. E12-M-345 or A12-K-345',
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
      openSmsPay: 'Open SMS Payment',
      invalidPlateAlert: 'Please enter a valid license plate (e.g. E12-M-345)',
    },
    navigation: {
      title: 'Navigate to Parking',
      navigate: 'Navigate',
      stopNav: 'End Route',
      distance: 'Distance',
      estTime: 'Est. Time',
      arrived: 'You arrived at the parking lot!',
      arrivedSms: 'Arrived - SMS',
      offlineMode: 'Offline Map & Routing',
      offlineRouteNotice: 'Displaying cached offline navigation route.',
      stepsHeader: 'Turn-by-turn Directions',
      startPoint: 'Your Location',
      turnLeft: 'Turn left',
      turnRight: 'Turn right',
      goStraight: 'Go straight',
      continueDriving: 'Continue driving',
      headTowardsMainRoad: 'Drive from current location towards main road.',
      followCorridorTowards: 'Follow road corridor towards area',
      turnTowards: 'Turn towards',
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
      historySubtitle: 'Overview of spending and SMS ticket records',
      recordedPayments: 'Recorded Payments',
      dayTotal: 'Today Total',
      monthTotal: 'This Month',
      totalPayments: 'Transactions',
      totalSpent: 'Total Spent',
      clearHistory: 'Clear History',
      clearHistoryConfirm: 'Are you sure you want to clear payment history?',
      noHistory: 'No previous payment records stored.',
      repaySms: 'Re-pay SMS',
      expiryNotifications: 'Expiration Notifications',
      autoAlert10Min: 'Automatic warning 10 mins before expiry',
      enablePush: 'Turn on push notifications when parking expires',
      enable: 'Enable',
      active: 'Active',
      hourShort: 'h',
    },
    vehicle: {
      title: 'My Vehicles / Plates',
      subtitle: 'Saved license plates for faster SMS payment',
      add: 'Add',
      inputPlaceholder: 'e.g. A12-K-345',
      noSavedPlates: 'No saved plates.',
      delete: 'Delete',
      priceListTitle: 'Price List & Zone Numbers',
      priceListSubtitle: 'Public City Parking Tuzla',
      hour: 'Hour',
      day: 'Day',
      smsNumber: 'SMS Number',
    },
    pwa: {
      installTitle: 'Install Tuzla Parking App',
      installPrompt: 'Install Tuzla Parking app on your smartphone or desktop for quick access and full offline support.',
      installButton: 'Install PWA App',
      downloadApp: 'Download App',
      offlineReady: 'Offline Mode Active',
      onlineMode: 'Connected',
      howToInstall: 'How to install app on your device:',
      iosInstructionsTitle: 'iPhone / iPad (iOS Safari)',
      iosInstructionsStep1: 'Tap the Share button ⎘ at the bottom of the screen in Safari.',
      iosInstructionsStep2: 'Select "Add to Home Screen ➕".',
      androidInstructionsTitle: 'Android (Chrome / Edge)',
      androidInstructionsStep1: 'Tap the menu button (⋮) in top right corner and select "Add to Home screen" or "Install app".',
      desktopInstructionsTitle: 'Desktop (Chrome / Edge)',
      desktopInstructionsStep1: 'Click the install icon ⊕ in your browser address bar at top.',
      close: 'Close',
    },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      details: 'Details',
      features: 'Features',
      address: 'Address',
      area: 'Area',
      priceList: 'Price List',
      zoneNumbers: 'Zone Numbers',
      total: 'TOTAL',
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
      vehicle: 'Fahrzeuge',
    },
    header: {
      workingHoursUntil: 'Betriebszeiten bis 22:00 Uhr',
      offWorkingHours: 'Außerhalb der Zeiten',
      live: 'LIVE',
      offline: 'OFFLINE',
      installApp: 'App Herunterladen / Installieren',
    },
    zones: {
      title: 'Tuzla Parkzonen',
      all: 'ALLE',
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
      licensePlatePlaceholder: 'z.B. E12-M-345 oder A12-K-345',
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
      openSmsPay: 'SMS-Zahlung Öffnen',
      invalidPlateAlert: 'Bitte geben Sie ein gültiges Kennzeichen ein (z.B. E12-M-345)',
    },
    navigation: {
      title: 'Navigation zum Parkplatz',
      navigate: 'Navigieren',
      stopNav: 'Beenden',
      distance: 'Entfernung',
      estTime: 'Geschätzte Zeit',
      arrived: 'Sie sind am Parkplatz angekommen!',
      arrivedSms: 'Angekommen - SMS',
      offlineMode: 'Offline-Karte & Navigation',
      offlineRouteNotice: 'Ihnen wird eine zwischengespeicherte Offline-Route angezeigt.',
      stepsHeader: 'Routenanweisungen',
      startPoint: 'Ihr Standort',
      turnLeft: 'Biegen Sie links ab',
      turnRight: 'Biegen Sie rechts ab',
      goStraight: 'Fahren Sie geradeaus',
      continueDriving: 'Fahrt fortsetzen',
      headTowardsMainRoad: 'Fahren Sie vom aktuellen Standort zur Hauptstraße.',
      followCorridorTowards: 'Folgen Sie der Straße in Richtung Bereich',
      turnTowards: 'Biegen Sie ab Richtung',
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
      historySubtitle: 'Übersicht der Ausgaben und SMS-Tickets',
      recordedPayments: 'Erfasste Zahlungen',
      dayTotal: 'Heute Gesamt',
      monthTotal: 'Diesen Monat',
      totalPayments: 'Transaktionen',
      totalSpent: 'Gesamtausgaben',
      clearHistory: 'Historie Löschen',
      clearHistoryConfirm: 'Möchten Sie die Zahlungshistorie wirklich löschen?',
      noHistory: 'Keine bisherigen Zahlungen gespeichert.',
      repaySms: 'Erneut Bezahlen',
      expiryNotifications: 'Ablaufbenachrichtigungen',
      autoAlert10Min: 'Automatische Warnung 10 Min. vor Ablauf',
      enablePush: 'Push-Benachrichtigung bei Ablauf aktivieren',
      enable: 'Aktivieren',
      active: 'Aktiv',
      hourShort: 'Std.',
    },
    vehicle: {
      title: 'Meine Fahrzeuge / Kennzeichen',
      subtitle: 'Gespeicherte Kennzeichen für schnellere SMS-Zahlung',
      add: 'Hinzufügen',
      inputPlaceholder: 'z.B. A12-K-345',
      noSavedPlates: 'Keine gespeicherten Kennzeichen.',
      delete: 'Löschen',
      priceListTitle: 'Preisliste & Zonen-Nummern',
      priceListSubtitle: 'Öffentlicher Stadtparkplatz Tuzla',
      hour: 'Stunde',
      day: 'Tag',
      smsNumber: 'SMS-Nummer',
    },
    pwa: {
      installTitle: 'Tuzla Parking App Installieren',
      installPrompt: 'Installieren Sie Tuzla Parking für schnellen Zugriff und vollständige Offline-Navigation auf Ihrem Gerät.',
      installButton: 'App Installieren',
      downloadApp: 'App Herunterladen',
      offlineReady: 'Offline-Modus Bereit',
      onlineMode: 'Online',
      howToInstall: 'So installieren Sie die App auf Ihrem Gerät:',
      iosInstructionsTitle: 'iPhone / iPad (iOS Safari)',
      iosInstructionsStep1: 'Tippen Sie unten auf die Teilen-Taste ⎘ in Safari.',
      iosInstructionsStep2: 'Wählen Sie "Zum Home-Bildschirm ➕".',
      androidInstructionsTitle: 'Android (Chrome / Edge)',
      androidInstructionsStep1: 'Tippen Sie oben rechts auf das Menü (⋮) und wählen Sie "Zum Startbildschirm hinzufügen" oder "App installieren".',
      desktopInstructionsTitle: 'Desktop (Chrome / Edge)',
      desktopInstructionsStep1: 'Klicken Sie oben in der Adressleiste auf das Install-Symbol ⊕.',
      close: 'Schließen',
    },
    common: {
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      close: 'Schließen',
      details: 'Details',
      features: 'Ausstattung',
      address: 'Adresse',
      area: 'Bereich',
      priceList: 'Preisliste',
      zoneNumbers: 'Zonen-Nummern',
      total: 'GESAMT',
    },
  },
};
