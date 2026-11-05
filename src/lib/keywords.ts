import { SITE_URL } from './site-config';

export interface KeywordEntry {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  category: 'Tactics' | 'Match Analysis' | 'Gear Reviews' | 'Scouting' | 'Training';
  searchIntent: 'Informational' | 'Commercial' | 'Investigative';
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  lastModified: string;
  faqs: { question: string; answer: string }[];
  summary: string;
  keyTakeaways: string[];
  relatedGuideSlug?: string;
  targetQueries: string[];
}

export const TARGET_KEYWORDS: KeywordEntry[] = [
  {
    slug: 'best-formation-against-low-block',
    keyword: 'best formation against low block',
    title: 'Best Formation Against a Low Block: 3-2-5 Positional Tactics & Overload Guide',
    description:
      'Learn how elite coaches break down 5-4-1 and 4-5-1 compact defenses using 3-2-5 box midfields, five-channel pinning, and cutback mechanics.',
    category: 'Tactics',
    searchIntent: 'Informational',
    priority: 0.95,
    changeFrequency: 'weekly',
    lastModified: '2026-11-05T00:00:00.000Z',
    relatedGuideSlug: 'best-formation-against-low-block-tactical-guide',
    targetQueries: [
      'best formation against low block',
      'how to beat 541 low block',
      '3-2-5 in possession tactical breakdown',
      'half space underlap low block',
    ],
    summary:
      'A low block aims to choke central passing corridors inside 30 meters of goal. Countering it requires occupying all 5 vertical channels simultaneously with dual #10 playmakers and inverted wingers to force defensive collapse.',
    keyTakeaways: [
      'Pin the back 5 with touchline-wide wingers to prevent wing-backs from tucking inside.',
      'Maintain a 3-2 rest-defense structure to immediately counter-press and recycle clearances.',
      'Prioritize low byline cutbacks over high crosses to convert in high-xG shooting zones.',
    ],
    faqs: [
      {
        question: 'What is the most effective formation against a 5-4-1 low block?',
        answer:
          'A flexible 3-2-5 or 2-3-5 in possession shape is the most effective. It matches or overloads the opponent’s five defenders while keeping a rest-defense box to stop counter-attacks.',
      },
      {
        question: 'Why do traditional crosses fail against compact low blocks?',
        answer:
          'Low blocks pack 4 to 5 central aerial defenders. Crossing from deep positions results in less than 4% conversion, whereas low cutbacks into Zone 14 carry an xG exceeding 0.25 per shot.',
      },
    ],
  },
  {
    slug: 'best-football-boots-2026-under-150',
    keyword: 'best football boots 2026 under $150',
    title: 'Top 5 Best Football Boots in 2026 Under $150: Pro Takedown & Value Guide',
    description:
      'Comprehensive buyer guide testing the best football boots under $150 in 2026. Detailed comparisons of Adidas Predator Pro, Nike Mercurial Vapor 16 Pro & Puma Future.',
    category: 'Gear Reviews',
    searchIntent: 'Commercial',
    priority: 0.9,
    changeFrequency: 'weekly',
    lastModified: '2026-11-04T00:00:00.000Z',
    targetQueries: [
      'best football boots 2026 under 150',
      'affordable pro football boots',
      'nike vapor 16 pro review',
      'adidas predator strikeskin takedown',
    ],
    summary:
      'You do not need to spend $280 to get elite grip, lockdown, and responsiveness. Modern "Pro" takedown tiers from Adidas, Nike, and Puma deliver over 90% of flagship performance at half the price.',
    keyTakeaways: [
      'Adidas Predator Pro features actual Strikeskin rubber grip elements for precision curling passes.',
      'Nike Mercurial Vapor 16 Pro includes the responsive 3/4 Air Zoom forefoot unit.',
      'Puma Future 8 Pro provides unmatched comfort and dual FG/AG safety for mixed pitches.',
    ],
    faqs: [
      {
        question: 'Are takedown football boots worth buying in 2026?',
        answer:
          'Yes. The $130–$150 "Pro" tier features modern lightweight outsoles and tactile upper textures that rival $280 elite boots with significantly better durability for amateur and academy players.',
      },
      {
        question: 'Which boot under $150 is best for wide feet?',
        answer:
          'The Puma Future 8 Pro with FUZIONFIT360 adaptive knit is the top recommendation for wide-footed players due to its forgiving stretch upper.',
      },
    ],
  },
  {
    slug: 'arsenal-vs-liverpool-tactical-preview',
    keyword: 'Arsenal vs Liverpool preview tactical analysis',
    title: 'Arsenal vs Liverpool Tactical Preview: 3-2-5 Buildup vs High-Speed Transition xG',
    description:
      'Tactical preview and data breakdown for Arsenal vs Liverpool. Analysis of Declan Rice, Mohamed Salah, rest-defense matchups, and dead-ball set piece xG.',
    category: 'Match Analysis',
    searchIntent: 'Informational',
    priority: 0.9,
    changeFrequency: 'daily',
    lastModified: '2026-11-05T00:00:00.000Z',
    relatedGuideSlug: 'arsenal-vs-liverpool-preview-tactical-analysis',
    targetQueries: [
      'arsenal vs liverpool preview tactical analysis',
      'arteta vs slot tactics',
      'arsenal liverpool key battles xg',
      'premier league title race preview',
    ],
    summary:
      'A matchup pitting Mikel Arteta’s calculated rest-defense against Arne Slot’s direct transition speed. Discover the right-sided overload dynamics and set-piece advantages.',
    keyTakeaways: [
      'Saka and White form a 46% expected threat triangle on Arsenal’s right channel.',
      'Liverpool drop Gravenberch between center-backs to bypass opposing double-striker screens.',
      'Arsenal lead European leagues with 0.44 set-piece expected goals per 90 minutes.',
    ],
    faqs: [
      {
        question: 'Where will Arsenal vs Liverpool be tactically decided?',
        answer:
          'The primary battleground is Arsenal’s right half-space against Liverpool’s left flank, combined with transition recovery times in minutes 60–80.',
      },
    ],
  },
  {
    slug: 'real-madrid-vs-barcelona-tactics',
    keyword: 'Real Madrid vs Barcelona post match analysis',
    title: 'El Clásico Tactical Analysis: Hansi Flick High Offside Trap vs Galáctico Counter',
    description:
      'In-depth tactical breakdown of Barcelona’s 45-meter defensive line against Real Madrid’s counter-attacking speed. Offside line data and midfield duel metrics.',
    category: 'Match Analysis',
    searchIntent: 'Informational',
    priority: 0.9,
    changeFrequency: 'daily',
    lastModified: '2026-11-04T00:00:00.000Z',
    relatedGuideSlug: 'real-madrid-barcelona-post-match-tactical-review',
    targetQueries: [
      'real madrid vs barcelona post match analysis',
      'hansi flick high line tactics',
      'el clasico tactical review',
      'how barcelona beat real madrid counter',
    ],
    summary:
      'Barcelona compressed the pitch to just 22 meters between defense and attack, catching Real Madrid offside repeatedly while dominating second-ball recoveries.',
    keyTakeaways: [
      'Cubarsí and Martínez synchronized step-ups precisely when Madrid midfielders prepared vertical passes.',
      'Pedri and Casadó achieved 91% pass completion under aggressive counter-presses.',
    ],
    faqs: [
      {
        question: 'Why did Barcelona keep such a high defensive line against Mbappé?',
        answer:
          'By compressing midfield space, Barcelona choked off the passing angles required for Madrid playmakers to deliver accurate through balls, turning pace into offside infractions.',
      },
    ],
  },
  {
    slug: 'football-set-piece-tactics-guide',
    keyword: 'football set piece tactics guide',
    title: 'Football Set Piece Tactics Guide: Near-Post Blockers & Six-Yard Box Overloads',
    description:
      'Master modern dead-ball routines. Why in-swingers generate 0.35+ xG, how to disrupt hybrid zonal-man defenses, and how elite clubs score from corners.',
    category: 'Tactics',
    searchIntent: 'Informational',
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: '2026-11-03T00:00:00.000Z',
    relatedGuideSlug: 'modern-corner-kick-tactics-blocker-routines-xg',
    targetQueries: [
      'football set piece tactics guide',
      'corner kick routines xg',
      'near post blocker corner kick tactics',
      'how to defend set pieces in football',
    ],
    summary:
      'Over 28% of all goals in top European football originate from dead-ball scenarios. Modern set-piece coaches treat every corner as an engineered high-percentage play.',
    keyTakeaways: [
      'In-swinging trajectories curve into the six-yard box, paralyzing goalkeeper decision-making.',
      'Back-post starting runs pull zonal markers out of their primary deflection zones.',
      'Two edge-of-the-box guards lock down second-phase loose balls to sustain territory.',
    ],
    faqs: [
      {
        question: 'Why are in-swinging corners more effective than out-swingers?',
        answer:
          'In-swingers move toward the goal line with pace, requiring only a slight touch from an attacker to produce a goal, while making it risky for goalkeepers to come off their line.',
      },
    ],
  },
  {
    slug: 'best-young-football-players-2026',
    keyword: 'best young football players 2026',
    title: 'Best U-21 Wonderkids in Europe 2026: Scouting Telemetry & xG Form Guide',
    description:
      'Scouting Europe’s top 10 under-21 wonderkids using advanced per-90 metrics, progressive carries, press resistance, and non-penalty expected goals + assists.',
    category: 'Scouting',
    searchIntent: 'Informational',
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: '2026-11-02T00:00:00.000Z',
    relatedGuideSlug: 'best-u21-young-players-europe-2026-scouting-list',
    targetQueries: [
      'best young football players 2026',
      'top u21 wonderkids europe',
      'best teenage footballers scouting report',
      'future ballon dor candidates 2026',
    ],
    summary:
      'A data-driven scouting dossier ranking Europe’s top teenage prodigies by progressive actions, duel efficiency, and senior minute impact.',
    keyTakeaways: [
      'Lamine Yamal leads all European U-21 wingers with 0.89 non-penalty xG + xAG per 90.',
      'Pau Cubarsí ranks in the 98th percentile for central progressive passing precision.',
      'Scanning frequency (6+ shoulder checks every 10 seconds) defines modern midfield wonderkids.',
    ],
    faqs: [
      {
        question: 'Who is the highest rated U-21 player in Europe in 2026?',
        answer:
          'Lamine Yamal leads both qualitative and quantitative telemetry with unmatched shot-creation and progressive carrying numbers.',
      },
    ],
  },
  {
    slug: 'football-pressing-training-drills',
    keyword: 'football pressing training drills',
    title: 'Football Pressing Training Drills: 3 High-Intensity Rondos & Cover Shadow Blueprints',
    description:
      'Coaching blueprints for high pressing. Learn how to train curved running paths, cover shadows, and 6-second counter-pressing transition triggers.',
    category: 'Training',
    searchIntent: 'Informational',
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: '2026-11-01T00:00:00.000Z',
    relatedGuideSlug: 'coaching-drills-high-press-rondo-transition',
    targetQueries: [
      'football pressing training drills',
      'how to teach cover shadow pressing',
      'gegenpressing training session plans',
      'transition rondo drills for coaches',
    ],
    summary:
      'Effective pressing is about geometry, not wild running. Learn how to curve pressing runs at a 30-degree angle to cut off passing lanes while suffocating the ball carrier.',
    keyTakeaways: [
      'Curved runs make a single presser eliminate two passing options simultaneously.',
      'Pressing triggers: backward passes, heavy touches, and body shapes facing the defender’s own goal.',
      '6v3 transition grids train players to score or shoot within 5 seconds of regaining possession.',
    ],
    faqs: [
      {
        question: 'What is a cover shadow in football?',
        answer:
          'A cover shadow is the imaginary blind zone directly behind a pressing player. By positioning their body correctly, the presser prevents passes into that corridor.',
      },
    ],
  },
  {
    slug: 'expected-goals-xg-guide-football',
    keyword: 'expected goals xG stats explained football',
    title: 'What is xG in Football? Expected Goals, xGOT & Shot Quality Explained',
    description:
      'A clear, tactical breakdown of Expected Goals (xG), post-shot xGOT, and expected threat (xT). How modern analysts evaluate match performance beyond final scores.',
    category: 'Tactics',
    searchIntent: 'Informational',
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: '2026-11-03T00:00:00.000Z',
    targetQueries: [
      'expected goals xg stats explained football',
      'what is xg in soccer',
      'difference between xg and xgot',
      'how expected goals is calculated',
    ],
    summary:
      'Expected goals (xG) measures the probability of a shot resulting in a goal based on distance, angle, defender pressure, and type of assist.',
    keyTakeaways: [
      'Penalties carry a fixed benchmark of 0.79 xG.',
      'xGOT (Expected Goals on Target) factors in placement speed and height after the shot is taken.',
      'Teams that consistently win the xG battle over a 38-game season have an 88% correlation with top-4 finishes.',
    ],
    faqs: [
      {
        question: 'Can a team win a game but have lower xG?',
        answer:
          'Yes. Football has high variance. A team can score from low-probability long-range shots (low xG) while the opponent misses multiple high-xG tap-ins.',
      },
    ],
  },
  {
    slug: 'inverted-full-backs-tactics-325',
    keyword: 'inverted full backs tactical guide 325',
    title: 'The Inverted Full-Back Tactical Guide: How Pep & Arteta Redefined Rest-Defense',
    description:
      'Why inverted full-backs form the backbone of modern positional play. Step-by-step tactical diagrams on how full-backs create central numerical superiorities.',
    category: 'Tactics',
    searchIntent: 'Informational',
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: '2026-11-02T00:00:00.000Z',
    targetQueries: [
      'inverted full backs tactical guide 325',
      'why full backs play in midfield',
      'rest defense inverted full backs',
      'pep guardiola inverted fullback role',
    ],
    summary:
      'Rather than running overlapping lanes along the touchline, inverted full-backs step into the pivot line beside the #6 to control counter-attacks and overload central midfields.',
    keyTakeaways: [
      'Inverting a full-back gives your team a 3v2 or 4v3 central overload against two-man midfield blocks.',
      'Shorter distance to sprint back during defensive transitions prevents counter-attacks.',
      'Frees creative #8s and #10s to push higher into the penalty box half-spaces.',
    ],
    faqs: [
      {
        question: 'Who invented the inverted full-back role?',
        answer:
          'While Johan Cruyff and early total football pioneers explored inside movements, Pep Guardiola modernized the tactical role with Philipp Lahm at Bayern Munich and later Oleksandr Zinchenko, John Stones, and Rico Lewis at Man City.',
      },
    ],
  },
  {
    slug: 'wide-fit-football-boots-guide',
    keyword: 'best wide fit football boots 2026',
    title: 'Best Wide-Fit Football Boots 2026: Comfort, Leather & AG Stud Guide',
    description:
      'Finding boots that do not pinch wide feet. Top-rated wide-fit boots including Puma Future 8 Pro, Mizuno Morelia Neo, and Nike Tiempo Legend.',
    category: 'Gear Reviews',
    searchIntent: 'Commercial',
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: '2026-11-01T00:00:00.000Z',
    targetQueries: [
      'best wide fit football boots 2026',
      'football boots for wide feet blisters',
      'puma future vs tiempo wide feet',
      'comfortable soccer cleats wide toe box',
    ],
    summary:
      'Most football boots are designed with narrow aerodynamic toe boxes. We test boots built with anatomical lasts and stretchy adaptive knits that provide blister-free comfort.',
    keyTakeaways: [
      'K-leather and adaptive stretch knits naturally mold to wider foot profiles.',
      'Avoid ultra-stiff synthetic speed boots that do not break in along the midfoot.',
      'Conical studs reduce rotational joint strain on both FG and artificial AG pitches.',
    ],
    faqs: [
      {
        question: 'Is leather better than synthetic for wide feet?',
        answer:
          'Yes. Premium leather stretches and contours to the unique width of your foot after 1–2 training sessions, whereas synthetic materials retain their original factory mold.',
      },
    ],
  },
];

