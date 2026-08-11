import { ParkingLotData, ParkingZone, ZoneDetails } from '../types';

export const SMS_NUMBERS = {
  hourly: { '0': '0833510', '1': '0833511', '2': '0833512' },
  daily: { '0': '0833513', '1': '0833514', '2': '0833515' },
};

export function getSmsNumber(zone: ParkingZone, isDayTicket: boolean): string {
  return isDayTicket ? SMS_NUMBERS.daily[zone] : SMS_NUMBERS.hourly[zone];
}

export const ZONE_DETAILS: Record<ParkingZone, ZoneDetails> = {
  '0': {
    zone: '0',
    name: 'Zona 0 (Centar)',
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
    shortCode: '0833510',
    hourlyShortCode: '0833510',
    dailyShortCode: '0833513',
    color: '#EF4444',
    badgeBg: 'bg-red-500/20 border-red-500/50 text-red-300',
    badgeText: 'ZONA 0 • 2.0 KM/h',
  },
  '1': {
    zone: '1',
    name: 'Zona 1 (Šira Zona)',
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    shortCode: '0833511',
    hourlyShortCode: '0833511',
    dailyShortCode: '0833514',
    color: '#0284C7',
    badgeBg: 'bg-sky-500/20 border-sky-500/50 text-sky-300',
    badgeText: 'ZONA 1 • 1.0 KM/h',
  },
  '2': {
    zone: '2',
    name: 'Zona 2 (Periferija)',
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    shortCode: '0833512',
    hourlyShortCode: '0833512',
    dailyShortCode: '0833515',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    badgeText: 'ZONA 2 • 0.5 KM/h',
  }
};


export const TUZLA_PARKING_ZONE_POLYGON = {
  color: "#ef4444",
  fillColor: "#ef444433",
  polygons: [
    [18.672552, 44.538657],
    [18.6719213, 44.5378351],
    [18.6727642, 44.5378501],
    [18.6730873, 44.5378301],
    [18.6733999, 44.5377505],
    [18.6741517, 44.5375125],
    [18.6749314, 44.5372772],
    [18.6757012, 44.5369905],
    [18.6760981, 44.5367417],
    [18.6766986, 44.5362831],
    [18.6771921, 44.5367395],
    [18.6783546, 44.5361562],
    [18.6788604, 44.5359134],
    [18.6790395, 44.5358358],
    [18.6792502, 44.5357832],
    [18.6794644, 44.5358283],
    [18.6796014, 44.5359184],
    [18.6807597, 44.5353402],
    [18.6818387, 44.5348844],
    [18.6821133, 44.5351351],
    [18.6806638, 44.5357771],
    [18.6798537, 44.5361646],
    [18.6802055, 44.5365568],
    [18.68015, 44.5367987],
    [18.6820396, 44.5368312],
    [18.6832267, 44.5368388],
    [18.6837852, 44.5368362],
    [18.683894, 44.5368813],
    [18.6839327, 44.5370165],
    [18.6838133, 44.5371367],
    [18.6835498, 44.5372669],
    [18.6829633, 44.5375673],
    [18.6814917, 44.5374897],
    [18.6814811, 44.5378577],
    [18.6810477, 44.5378945],
    [18.6804254, 44.5380586],
    [18.6797962, 44.5382798],
    [18.6801285, 44.5385833],
    [18.678404, 44.5394445],
    [18.6770412, 44.540128],
    [18.6761843, 44.5405711],
    [18.6755626, 44.5407888],
    [18.6751552, 44.5408614],
    [18.6747302, 44.540869],
    [18.6736911, 44.540685],
    [18.673496, 44.541318],
    [18.673067, 44.541219],
    [18.6728556, 44.5406295],
    [18.6726984, 44.5404445],
    [18.6727371, 44.5401791],
    [18.672359, 44.539865],
    [18.672702, 44.538971],
    [18.672715, 44.5388601],
    [18.672552, 44.538657]
  ]
};

// Zona 1 Polygons (Light Blue)
export const ZONA_1_POLYGONS = {
  color: "#0284c7",
  fillColor: "#38bdf8",
  fillOpacity: 0.35,
  polygons: [
    // Parking Zona 1
    [
      [18.679322, 44.535292], [18.681049, 44.534413], [18.681951, 44.534971], [18.682455, 44.535522], [18.6815, 44.535881], [18.681103, 44.535254], [18.680663, 44.535392], [18.680309, 44.535024], [18.679504, 44.535384], [18.679322, 44.535292]
    ],
    // Zona 1 - Posta
    [
      [18.692508, 44.532929], [18.693033, 44.532898], [18.69298, 44.532677], [18.692465, 44.532684], [18.692508, 44.532929]
    ],
    // Zona 1 - Slatina
    [
      [18.665417, 44.540167], [18.665428, 44.541521], [18.66523, 44.541517], [18.665257, 44.542079], [18.665165, 44.542068], [18.665144, 44.540561], [18.665235, 44.540561], [18.665267, 44.540393], [18.665294, 44.540248], [18.665417, 44.540167]
    ],
    // Zona 1 - Tenis
    [
      [18.685169, 44.538126], [18.684558, 44.537579], [18.684343, 44.537713], [18.684268, 44.537648], [18.68452, 44.537472], [18.684209, 44.537242], [18.684354, 44.537154], [18.685314, 44.538018], [18.685169, 44.538126]
    ],
    // blue 5
    [
      [18.683764, 44.534872], [18.683206, 44.53504], [18.683115, 44.534803], [18.682771, 44.534891], [18.682648, 44.534646], [18.683544, 44.534455], [18.683764, 44.534872]
    ],
    // Zona 1 - Merkator
    [
      [18.681763, 44.533805], [18.681564, 44.533721], [18.68187, 44.533525], [18.682052, 44.533395], [18.682095, 44.533319], [18.682128, 44.533017], [18.683571, 44.532111], [18.684483, 44.531912], [18.684644, 44.53388], [18.683957, 44.533273], [18.683335, 44.533135], [18.682948, 44.533204], [18.683034, 44.533376], [18.682251, 44.533591], [18.681983, 44.533858], [18.681763, 44.533805]
    ],
    // Zona 1 - Dom Armije
    [
      [18.688018, 44.532367], [18.688039, 44.532745], [18.687771, 44.532757], [18.687685, 44.532466], [18.687401, 44.532531], [18.687428, 44.532791], [18.687197, 44.532807], [18.68717, 44.532497], [18.687009, 44.532497], [18.686805, 44.532527], [18.686585, 44.532673], [18.686194, 44.532906], [18.686167, 44.533059], [18.686178, 44.533288], [18.685743, 44.533296], [18.685679, 44.533204], [18.686247, 44.532726], [18.686607, 44.532474], [18.686891, 44.532352], [18.68717, 44.532332], [18.687637, 44.532302], [18.688012, 44.532302], [18.688018, 44.532367]
    ]
  ]
};

// Zona 2 Polygons (Green)
export const ZONA_2_POLYGONS = {
  color: "#059669",
  fillColor: "#10b981",
  fillOpacity: 0.35,
  polygons: [
    // Zona 2 - Kajmak stanica
    [
      [18.681704, 44.538068], [18.681479, 44.537808], [18.680738, 44.537816], [18.679816, 44.538198], [18.680062, 44.538435], [18.681704, 44.538068]
    ],
    // Zona 2 - Panonica
    [
      [18.676039, 44.541318], [18.676618, 44.540959], [18.676211, 44.540561], [18.676758, 44.540309], [18.677595, 44.541074], [18.676929, 44.541311], [18.676447, 44.541448], [18.6762, 44.541418], [18.676039, 44.541318]
    ],
    // Zona 2 - Gradina
    [
      [18.686736, 44.540718], [18.686902, 44.540745], [18.687004, 44.540752], [18.687176, 44.540749], [18.687358, 44.540714], [18.687304, 44.540592], [18.687192, 44.540619], [18.687057, 44.540638], [18.686596, 44.540584], [18.686564, 44.540695], [18.686736, 44.540718]
    ],
    // Zona 2 - Gradina 2
    [
      [18.691054, 44.539211], [18.691569, 44.539246], [18.691585, 44.538936], [18.691462, 44.538948], [18.691462, 44.538734], [18.69107, 44.53873], [18.691054, 44.539211]
    ],
    // Zona 2 - Gradina 3
    [
      [18.691649, 44.537678], [18.692513, 44.53764], [18.692524, 44.537418], [18.691859, 44.537453], [18.691639, 44.537575], [18.691649, 44.537678]
    ],
    // Zona 2 - Gradina 4
    [
      [18.691435, 44.537433], [18.691006, 44.537747], [18.690737, 44.537537], [18.690571, 44.537644], [18.690737, 44.537938], [18.69121, 44.537816], [18.692062, 44.537193], [18.691939, 44.537108], [18.691435, 44.537433]
    ],
    // Zona 2 - Dom Zdravlja
    [
      [18.667923, 44.540924], [18.668427, 44.540913], [18.668422, 44.540492], [18.668196, 44.540389], [18.66605, 44.540393], [18.666008, 44.540183], [18.665723, 44.540186], [18.665761, 44.54084], [18.666104, 44.540844], [18.666115, 44.540496], [18.66722, 44.540504], [18.667912, 44.5405], [18.667923, 44.540924]
    ],
    // Zona 2 - Panonica 2
    [
      [18.683077, 44.538053], [18.682675, 44.538382], [18.682787, 44.53847], [18.683147, 44.538443], [18.683458, 44.538275], [18.683077, 44.538053]
    ],
    // Zona 2 - Mikrostanica
    [
      [18.687615, 44.534072], [18.687857, 44.534069], [18.687878, 44.534283], [18.688136, 44.534275], [18.688184, 44.534516], [18.687884, 44.53452], [18.687862, 44.534382], [18.687819, 44.534271], [18.687631, 44.53426], [18.687615, 44.534072]
    ],
    // Zona 2 - Jupiter - NLB
    [
      [18.683839, 44.533403], [18.683496, 44.533495], [18.68385, 44.534053], [18.685073, 44.533625], [18.685201, 44.533755], [18.685577, 44.533686], [18.685856, 44.533808], [18.687401, 44.533457], [18.68739, 44.53325], [18.68621, 44.533311], [18.685781, 44.533334], [18.685663, 44.533346], [18.685598, 44.533288], [18.685502, 44.533189], [18.685309, 44.533334], [18.684976, 44.533464], [18.684204, 44.533678], [18.684043, 44.53374], [18.683839, 44.533403]
    ]
  ]
};

export const TUZLA_PARKING_DATA: ParkingLotData[] = [
  {
    id: "bcc-main",
    name: "Bingo City Center",
    area: "Parking Centar",
    address: "Mitra Trifunovića Uče 2",
    coordinates: [18.653272, 44.532753],
    features: ["Shopping mall access", "Surface parking"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 450,
  },
  {
    id: "skver",
    name: "Skver parking - Kojšino",
    area: "Skver/Kojšino",
    address: "Mije Keroševića Guje 24",
    coordinates: [18.673362, 44.540963],
    features: ["Open surface lot", "24/7 access"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
  },

  {
    id: "slatina-main",
    name: "Dom Zdravlja",
    area: "Slatina",
    address: "Alana Forda (Behind Health Center)",
    coordinates: [18.667960, 44.540829],
    features: ["Zone 2", "Public lot", "Close to Dom Zdravlja clinic"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 220,
  },
  {
    id: "slatina",
    name: "SodaSo Parking Slatina",
    area: "Slatina",
    address: "Slatina, Tuzla",
    coordinates: [18.665482, 44.540615],
    features: ["Zone 1", "Public lot", "Parking Slatina"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 150,
  },
  {
    id: "gradski-kulina-bana",
    name: "Gradski Parking Centar",
    area: "Centar",
    address: "Kulina bana 8",
    coordinates: [18.675910, 44.539877],
    features: ["Municipal managed", "Zone 0", "Near pedestrian walk"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
    capacity: 160,
  },
  {
    id: "turalibegova",
    name: "Parking Turalibegova",
    area: "Centar",
    address: "Turalibegova 59",
    coordinates: [18.6792208, 44.536256],
    features: ["Automated ticketing", "High-turnover commercial area"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
    capacity: 90,
  },
  {
    id: "cipelici",
    name: "Parking Cipelići",
    area: "Centar / Cipelići",
    address: "Junction of Turalibegova & Klosterska",
    coordinates: [18.680749, 44.535120],
    features: ["Zone 1 dynamic pricing", "Automated entry ramp"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 60,
  },
  {
    id: "velika-pijaca",
    name: "Velika Pijaca",
    area: "Zona 0",
    address: "Malkočeva",
    coordinates: [18.674722, 44.537975],
    features: ["Zona 0"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
  },
  {
    id: "Klošterska",
    name: "Katolički Školski Centar",
    area: "Centar",
    address: "Klošterska(KŠC)",
    coordinates: [18.6812748, 44.5368328],
    features: ["Zona 0", "Pekara Kabil - Telex"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
    capacity: 50,
  },
  {
    id: "pannonica-west",
    name: "Parkiralište Jezero Zapad",
    area: "Pannonica",
    address: "Džindić mahala",
    coordinates: [18.676887, 44.540989],
    features: ["JKP Saobraćaj i komunikacije", "Direct lake gate entry"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 250,
  },
  {
    id: "kajmak-stanica",
    name: "Parking Kajmak Stanica",
    area: "Centar / Sjever",
    address: "Kulina bana (Old bus station layout)",
    coordinates: [18.681108, 44.538007],
    features: ["Automated ramp gates", "High capacity (~200 spaces)"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 200,
  },
  {
    id: "pannonica-east",
    name: "Parking Pannonica Istok",
    area: "Pannonica",
    address: "Ulica Džamala Bijedića area",
    coordinates: [18.683109, 44.538344],
    features: ["Large surface capacity", "Automated pay terminals"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 320,
  },
  {
    id: "gradina-hospital",
    name: "Parking Gradina (UKC Tuzla)",
    area: "Gradina",
    address: "Put Gradina",
    coordinates: [18.691902, 44.537556],
    features: ["Independent medical campus tariff", "Incline surface terrain"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 280,
  },

  {
    id: "stupine-main",
    name: "Parking Stupine",
    area: "Stupine",
    address: "Mehmedalije Maka Dizdara",
    coordinates: [18.691612, 44.529851],
    features: ["Zone 1 public parking", "Open-air surface spaces"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 170,
  },
  {
    id: "stupine-maka-dizdara-z1",
    name: "Parking Mehmedalije Maka Dizdara",
    area: "Stupine",
    address: "Mehmedalije Maka Dizdara (Blok B/C)",
    coordinates: [18.693150, 44.530650],
    features: ["Zona 1", "Public street parking", "Working hours: 07:00 - 22:00"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 120,
  },
  {
    id: "15-maja",
    name: "Parking 15. maja",
    area: "Brčanska Malta",
    address: "15. maja 2",
    coordinates: [18.697177, 44.530279],
    features: ["Broad parking bays", "Low congestion area"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 140,
  },
  {
    id: "bulevar-BHTelecom",
    name: "Parking BHTelecom",
    area: "bhtelecom",
    address: "Bulevar 2. korpusa",
    coordinates: [18.691429, 44.533269],
    features: ["zone 1 payment 1.00KM/h, 5.00KM/day"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 5.0,
    capacity: 100,
  },
  {
    id: "sjenjak-fringes",
    name: "Parking Sjenjak Zapad",
    area: "Sjenjak",
    address: "Ismeta Mujezinovica B-blok",
    coordinates: [18.699787, 44.533239],
    features: ["Open public bay", "Feeder lanes to high-rise zones"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 130,
  },
  {
    id: "sjenjak-main",
    name: "Gradski Parking Sjenjak",
    area: "Sjenjak",
    address: "GMMX+3CH block",
    coordinates: [18.699862, 44.532244],
    features: ["Large neighborhood lot", "Easy connection to eastern bypass"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    capacity: 210,
  },
  {
    id: "albina-herljevica",
    name: "Albina Herljevića",
    area: "Zona 2",
    address: "Albina Herljevića",
    coordinates: [18.667510, 44.542083],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "franjevacka-socijalno",
    name: "Franjevačka (Socijalno)",
    area: "Zona 2",
    address: "Franjevačka",
    coordinates: [18.669993, 44.537837],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "muzicka-skola",
    name: "Muzička škola",
    area: "Zona 2",
    address: "Muzička škola",
    coordinates: [18.675663, 44.541395],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "kula-fg",
    name: "Kula F i G",
    area: "Zona 2",
    address: "Kula F i G",
    coordinates: [18.696188, 44.532608],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "ulica-pazar",
    name: "Ulica Pazar",
    area: "Zona 2",
    address: "Ulica Pazar škola - Medicinska škola",
    coordinates: [18.669945, 44.539261],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "mikrostanica",
    name: "Ispred Mikrostanice",
    area: "Zona 2",
    address: "Ispred Mikrostanice",
    coordinates: [18.687948, 44.534420],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "dom-mladih",
    name: "Dom Mladih",
    area: "Zona 1",
    address: "2. Tuzlanske brigade do Galerije",
    coordinates: [18.6867703, 44.5357379],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "banka",
    name: "Banka veliki i mali parking",
    area: "Zona 2",
    address: "Maršala Tita",
    coordinates: [18.683892, 44.533541],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "ulica-15-maja-buvlja",
    name: "Ulica 15. Maja (kod Buvlje pijace)",
    area: "Zona 2",
    address: "Ulica 15. Maja",
    coordinates: [18.6962634, 44.5332071],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "stari grad",
    name: "stari grad - limenka",
    area: "Zona 0",
    address: "Patriotske Lige - Limenka",
    coordinates: [18.6782330, 44.5388893],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
  },
  {

    id: "gradina-1",
    name: "Gradina 1",
    area: "Zona 2",
    address: "Gradina",
    coordinates: [18.69150, 44.53751],
    features: ["Working hours: 07:00 - 18:00"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "gradina-2",
    name: "Gradina 2 - Trnovac",
    area: "Zona 2",
    address: "Trnovac Prof. dr. Ibre Pašalića",
    coordinates: [18.68697, 44.54068],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "kralja-tvrtka",
    name: "Kralja Tvrtka",
    area: "Zona 2",
    address: "Kralja Tvrtka I",
    coordinates: [18.685620, 44.535537],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "jupiter",
    name: "Jupiter (ulica Aleja Alije Izetbegovića)",
    area: "Zona 2",
    address: "Aleja Alije Izetbegovića",
    coordinates: [18.686918, 44.533619],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "fra-grge-martica",
    name: "Fra Grge Martića",
    area: "Zona 2",
    address: "Fra Grge Martića",
    coordinates: [18.6810, 44.5360],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "tenis",
    name: "Tenis",
    area: "Zona 1",
    address: "Šetalište Slana Banja",
    coordinates: [18.684949, 44.537911],
    features: ["Zona 1"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "tc-merkator",
    name: "Parking zona 1 TC Merkator",
    area: "Zona 1",
    address: "TC Merkator",
    coordinates: [18.68797, 44.53249],
    features: ["Zona 1"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "bulevar",
    name: "Zona 1 Bulevar",
    area: "Zona 1",
    address: "Džemala Bijedića",
    coordinates: [18.69139, 44.53395],
    features: ["Zona 1"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  }
];

// Offline Tuzla Road Network graph waypoints for fallback navigation
export const TUZLA_OFFLINE_ROAD_NODES: [number, number][] = [
  [44.5328, 18.6533], // BCC Main

  [44.5405, 18.6655], // SodaSo Slatina
  [44.5406, 18.6680], // Slatina Main / Dom Zdravlja
  [44.5409, 18.6733], // Skver / Kojšino
  [44.5408, 18.6768], // Pannonica West / Jezero
  [44.5398, 18.6759], // Kulina bana / Centar
  [44.5380, 18.6811], // Kajmak Stanica / Sjever
  [44.5382, 18.6830], // Pannonica Istok
  [44.5362, 18.6792], // Turalibegova Centar
  [44.5351, 18.6807], // Čipelići / Klosterska
  [44.5338, 18.6872], // Jupiter / Aleja Alije Izetbegovića
  [44.5375, 18.6919], // UKC Gradina
  [44.5332, 18.6914], // BHTelecom Bulevar
  [44.5298, 18.6916], // Stupine
  [44.5302, 18.6971], // 15. Maja / Brčanska Malta
  [44.5332, 18.6997], // Sjenjak Zapad
  [44.5322, 18.6998], // Sjenjak Main
];
