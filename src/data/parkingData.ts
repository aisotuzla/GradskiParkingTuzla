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
    name: 'Zona 0 (Centar - Crvena)',
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
    name: 'Zona 1 (Šira Zona - Plava)',
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
    name: 'Zona 2 (Periferija - Zelena)',
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
    shortCode: '0833512',
    hourlyShortCode: '0833512',
    dailyShortCode: '0833515',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    badgeText: 'ZONA 2 • 0.5 KM/h',
  },
};

export const TUZLA_PARKING_ZONE_POLYGON = {
  color: "#ef4444",
  fillColor: "#ef444433",
  polygons: [
    [
      [18.672885, 44.540179],
      [18.673389, 44.540454],
      [18.674526, 44.540668],
      [18.675492, 44.540546],
      [18.676339, 44.53998],
      [18.676178, 44.539735],
      [18.677874, 44.538741],
      [18.677766, 44.538114],
      [18.677241, 44.538022],
      [18.677638, 44.537525],
      [18.677927, 44.537617],
      [18.678281, 44.537418],
      [18.678614, 44.537502],
      [18.678871, 44.537411],
      [18.678539, 44.536952],
      [18.679934, 44.535858],
      [18.679365, 44.53533],
      [18.676908, 44.536126],
      [18.675889, 44.536868],
      [18.674451, 44.537433],
      [18.673164, 44.538022],
      [18.674355, 44.539116],
      [18.672885, 44.540179]
    ]
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
    // Zona 1 - Hotel Tuzla
    [
      [18.688661, 44.530248], [18.688683, 44.530424], [18.688179, 44.53042], [18.688157, 44.530627], [18.687664, 44.53065], [18.687701, 44.530455], [18.688077, 44.530459], [18.688211, 44.530252], [18.688661, 44.530248]
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
    coordinates: [44.532753, 18.653272],
    features: ["Shopping mall access", "Surface parking"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 450,
  },
  {
    id: "bcc-garage",
    name: "Bingo City Center - Parking Garaža",
    area: "Zapad / Miladije",
    address: "Mitra Trifunovića Uče 2",
    coordinates: [44.532072, 18.650794],
    features: ["Underground garage", "EV Charging (15 kW)"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    isGarage: true,
  },
  {
    id: "skver",
    name: "Skver parking - Kojšino",
    area: "Skver/Kojšino",
    address: "Mije Keroševića Guje 24",
    coordinates: [44.540963, 18.673362],
    features: ["Open surface lot", "24/7 access"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
  },
  {
    id: "omega-tuzlanka",
    name: "Parking Omega (TC Tuzlanka)",
    area: "Parking Omega",
    address: "Univerzitetska",
    coordinates: [44.538282, 18.663186],
    features: ["Commercial surface lot", "Free"],
    zone: "1",
    hourlyPrice: 0.0,
    dailyPrice: 0.0,
    capacity: 180,
  },
  {
    id: "slatina-main",
    name: "Dom Zdravlja",
    area: "Slatina",
    address: "Alana Forda (Behind Health Center)",
    coordinates: [44.540829, 18.667960],
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
    coordinates: [44.540615, 18.665482],
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
    coordinates: [44.539877, 18.675910],
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
    name: "Parking Čipelići",
    area: "Centar / Čipelići",
    address: "Junction of Turalibegova & Klosterska",
    coordinates: [44.535120, 18.680749],
    features: ["Zone 1 dynamic pricing", "Automated entry ramp"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 110,
  },
  {
    id: "pannonica-west",
    name: "Parkiralište Jezero Zapad",
    area: "Pannonica",
    address: "Džindić mahala",
    coordinates: [44.540989, 18.676887],
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
    coordinates: [44.538007, 18.681108],
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
    coordinates: [44.538344, 18.683109],
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
    coordinates: [44.537556, 18.691902],
    features: ["Independent medical campus tariff", "Incline surface terrain"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 280,
  },
  {
    id: "mellain-complex",
    name: "Mellain Garaža",
    area: "Centar / Istok",
    address: "Aleja Alije Izetbegovića 3",
    coordinates: [44.533881, 18.687208],
    features: ["Multi-level underground", "24/7 security & video"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    isGarage: true,
    capacity: 400,
  },
  {
    id: "stupine-main",
    name: "Parking Stupine",
    area: "Stupine",
    address: "Mehmedalije Maka Dizdara",
    coordinates: [44.529851, 18.691612],
    features: ["Zone 1 public parking", "Open-air surface spaces"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
    capacity: 170,
  },
  {
    id: "15-maja",
    name: "Parking 15. maja",
    area: "Brčanska Malta",
    address: "15. maja 2",
    coordinates: [44.530279, 18.697177],
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
    coordinates: [44.533269, 18.691429],
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
    coordinates: [44.533239, 18.699787],
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
    coordinates: [44.532244, 18.699862],
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
    coordinates: [44.542083, 18.667510],
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
    coordinates: [44.537837, 18.669993],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "kojisno",
    name: "Kojišno",
    area: "Zona 2",
    address: "Kojišno",
    coordinates: [44.5310, 18.6710],
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
    coordinates: [44.541395, 18.675663],
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
    coordinates: [44.532608, 18.696188],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "ulica-pazar",
    name: "Ulica Pazar",
    area: "Zona 2",
    address: "Ulica Pazar",
    coordinates: [44.539261, 18.669945],
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
    coordinates: [44.534420, 18.687948],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "dom-penzionera",
    name: "Dom penzionera",
    area: "Zona 2",
    address: "Dom penzionera",
    coordinates: [44.534130, 18.679716],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "banka",
    name: "Banka veliki i mali parking",
    area: "Zona 2",
    address: "Maršala Tita",
    coordinates: [44.533541, 18.683892],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "ulica-15-maja-buvlja",
    name: "Ulica 15. Maja (kod Buvlje pijace)",
    area: "Zona 2",
    address: "Ulica 15. Maja",
    coordinates: [44.5332071, 18.6962634],
    features: ["Working hours: 07:00 - 22:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "gradina-1",
    name: "Gradina 1",
    area: "Zona 2",
    address: "Gradina",
    coordinates: [44.53751, 18.69150],
    features: ["Working hours: 07:00 - 18:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "gradina-2",
    name: "Gradina 2",
    area: "Zona 2",
    address: "Trnovac Prof. dr. Ibre Pašalića",
    coordinates: [44.54068, 18.68697],
    features: ["Working hours: 07:00 - 18:00"],
    zone: "2",
    hourlyPrice: 0.5,
    dailyPrice: 3.0,
  },
  {
    id: "kralja-tvrtka",
    name: "Kralja Tvrtka",
    area: "Zona 2",
    address: "Kralja Tvrtka I",
    coordinates: [44.5347051, 18.6853058],
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
    coordinates: [44.533619, 18.686918],
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
    coordinates: [44.5360, 18.6810],
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
    coordinates: [44.537911, 18.684949],
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
    coordinates: [44.53249, 18.68797],
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
    coordinates: [44.53395, 18.69139],
    features: ["Zona 1"],
    zone: "1",
    hourlyPrice: 1.0,
    dailyPrice: 4.0,
  },
  {
    id: "velika-pijaca",
    name: "Velika Pijaca",
    area: "Zona 0",
    address: "Malkočeva",
    coordinates: [44.537975, 18.674722],
    features: ["Zona 0"],
    zone: "0",
    hourlyPrice: 2.0,
    dailyPrice: 6.0,
  }
];

// Offline Tuzla Road Network graph waypoints for fallback navigation
export const TUZLA_OFFLINE_ROAD_NODES: [number, number][] = [
  [44.532072, 18.650794], // BCC West (Garage)
  [44.532753, 18.653272], // BCC Main
  [44.535000, 18.658000], // Miladije Raskrsnica
  [44.538282, 18.663186], // Omega Tuzlanka / Rudarska
  [44.540615, 18.665482], // SodaSo Slatina
  [44.540829, 18.667960], // Slatina Main / Dom Zdravlja
  [44.540963, 18.673362], // Skver / Kojšino
  [44.540989, 18.676887], // Pannonica West / Jezero
  [44.539877, 18.675910], // Kulina bana / Centar
  [44.538007, 18.681108], // Kajmak Stanica / Sjever
  [44.538344, 18.683109], // Pannonica Istok
  [44.536256, 18.679220], // Turalibegova Centar
  [44.535120, 18.680749], // Čipelići / Klosterska
  [44.533881, 18.687208], // Mellain / Aleja Alije Izetbegovića
  [44.537556, 18.691902], // UKC Gradina
  [44.533269, 18.691429], // BHTelecom Bulevar
  [44.529851, 18.691612], // Stupine
  [44.530279, 18.697177], // 15. Maja / Brčanska Malta
  [44.533239, 18.699787], // Sjenjak Zapad
  [44.532244, 18.699862], // Sjenjak Main
  [44.533619, 18.686918], // Jupiter
  [44.534705, 18.685305], // Kralja Tvrtka I
];
