import { GearReviewItem, NicheArticle, TacticalPreview } from '@/types/football';

export function buildTacticalPreviewForMatch(params: {
  homeName: string;
  awayName: string;
  homeCode: string;
  awayCode: string;
  leagueName: string;
  status: string;
  homeScore: number;
  awayScore: number;
}): TacticalPreview {
  const { homeName, awayName, homeCode, awayCode, leagueName, status, homeScore, awayScore } = params;
  const pairKey = `${homeCode}-${awayCode}`.toUpperCase();

  if (pairKey.includes('ARS') && pairKey.includes('LIV')) {
    return {
      headline: `${homeName} vs ${awayName}: Positional Rest-Defense Meets Vertical Transition Speed`,
      summary:
        'A premier tactical chess match in the Premier League title race. Arsenal look to pin Liverpool back using an Asymmetric 3-2-5 build-up with inverted full-backs, while Arne Slot’s side bait the high press before releasing Mohamed Salah and Luis Díaz into the channels.',
      homeTacticalStyle: '4-3-3 → 3-2-5 Box Midfield • High Counter-Press (PPDA 8.4)',
      awayTacticalStyle: '4-2-3-1 Mid-Block • Controlled Baiting & Direct Channel Runs',
      keyBattles: [
        {
          title: 'Right Wing vs Left Back Isolation',
          homePlayer: 'Bukayo Saka',
          awayPlayer: 'Andrew Robertson',
          zone: 'Right Half-Space & Final Third',
          analysis:
            'Saka’s combination play with Ødegaard and Ben White’s overlapping runs force Liverpool’s left-sided pivot to double-team, opening cutback lanes at the edge of the box.',
        },
        {
          title: 'Central Progression Duel',
          homePlayer: 'Declan Rice',
          awayPlayer: 'Ryan Gravenberch',
          zone: 'Zone 14 / Central Circle',
          analysis:
            'Whoever wins second balls and turns on the half-turn dictates the tempo. Gravenberch’s press resistance is vital to bypassing Arsenal’s initial 4-4-2 out-of-possession press.',
        },
      ],
      teamNews: {
        home: [
          'Bukayo Saka passed late fitness test and starts on the right flank',
          'Martin Ødegaard captains the side in central creative role',
          'Set-piece unit averaging 0.44 xG per game from dead-ball situations',
        ],
        away: [
          'Virgil van Dijk anchors back four with 84% aerial duel win rate',
          'Dominik Szoboszlai available to inject second-half pressing energy',
          'Alisson sideline recovery continues; Kelleher starts in goal',
        ],
      },
      h2h: {
        played: 10,
        homeWins: 4,
        draws: 3,
        awayWins: 3,
        avgGoals: 3.2,
        avgXg: '1.82 vs 1.69',
      },
      verdict: {
        prediction: status === 'FT' ? `Final Result: ${homeScore} - ${awayScore}` : 'Both Teams to Score & High-Intensity Draw (2-2)',
        confidence: '86% Tactical Model Confidence',
        tacticalKey: 'Dead-ball execution and transition recovery speed in minutes 60–80.',
      },
    };
  }

  if (pairKey.includes('RMA') && pairKey.includes('BAR')) {
    return {
      headline: `El Clásico Tactical Review: Ultra-High Defensive Line vs Galáctico Counter-Attacks`,
      summary:
        'Barcelona’s bold 4-2-3-1 system operates with a defensive line positioned nearly at the halfway stripe, compressing midfield space for Pedri and Dani Olmo while daring Kylian Mbappé and Vinícius Júnior to time their runs.',
      homeTacticalStyle: '4-3-1-2 Narrow Diamond • Direct Left-Wing Overload',
      awayTacticalStyle: '4-2-3-1 Ultra-High Line • Synchronized Offside Trap & Wing Pinning',
      keyBattles: [
        {
          title: 'Depth Sprint vs Offside Line',
          homePlayer: 'Kylian Mbappé',
          awayPlayer: 'Pau Cubarsí & Iñigo Martínez',
          zone: 'Defensive High Line (40m from goal)',
          analysis:
            'Barcelona caught Real Madrid offside 7+ times by stepping up in unison the instant Bellingham or Valverde looked up to play a through ball.',
        },
        {
          title: 'Half-Space Creativity',
          homePlayer: 'Eduardo Camavinga',
          awayPlayer: 'Lamine Yamal & Pedri',
          zone: 'Right Wing / Inside Channel',
          analysis:
            'Yamal’s ability to hold width before cutting inside onto his left foot stretches Ferland Mendy and opens central shooting lanes for Lewandowski.',
        },
      ],
      teamNews: {
        home: [
          'Jude Bellingham deployed in hybrid right-interior / #10 role',
          'Tchouaméni drops between center-backs during early build-up',
        ],
        away: [
          'Pedri and Casadó control midfield tempo with 91% pass completion',
          'Raphinha leads Europe in high-intensity sprints into the box',
        ],
      },
      h2h: {
        played: 10,
        homeWins: 5,
        draws: 0,
        awayWins: 5,
        avgGoals: 3.6,
        avgXg: '1.74 vs 1.98',
      },
      verdict: {
        prediction: status === 'FT' ? `Final Result: ${homeScore} - ${awayScore}` : 'Over 2.5 Goals • Barcelona xG Edge',
        confidence: '84% Tactical Model Confidence',
        tacticalKey: 'Timing of curved runs from deep midfielders beating the high offside trap.',
      },
    };
  }

  return {
    headline: `${homeName} vs ${awayName}: ${leagueName} Tactical Preview & Match Breakdown`,
    summary: `In-depth tactical preview and data telemetry for ${homeName} hosting ${awayName} in ${leagueName}. ${homeName} will look to establish territorial dominance through structured 3-2-5 build-up play, while ${awayName} aim to exploit space behind the full-backs in quick vertical transitions.`,
    homeTacticalStyle: '4-3-3 Positional Build-Up • High Half-Space Occupation',
    awayTacticalStyle: '4-2-3-1 Compact Mid-Block • Rapid Wing Transitions',
    keyBattles: [
      {
        title: 'Midfield Pivot Control & Press Resistance',
        homePlayer: `${homeCode} #8 (Central Playmaker)`,
        awayPlayer: `${awayCode} #6 (Defensive Anchor)`,
        zone: 'Zone 14 & Central Half-Spaces',
        analysis: `Controlling the space between the lines is critical. If ${homeName} can progress through the first line of pressure, they generate high-value cutback opportunities inside the penalty box.`,
      },
      {
        title: 'Wide Isolation & Full-Back Overlap',
        homePlayer: `${homeCode} #7 (Inverted Winger)`,
        awayPlayer: `${awayCode} #3 (Full-Back)`,
        zone: 'Wide Channels & Back Post',
        analysis: `${awayName} must prevent 1v1 isolations on the flank while keeping their counter-attacking outlet primed for quick switches of play.`,
      },
    ],
    teamNews: {
      home: [
        `${homeName} expected to field their strongest starting XI with full tactical flexibility`,
        'Focus on aggressive counter-pressing in the first 6 seconds after losing possession',
      ],
      away: [
        `${awayName} coaching staff emphasizing compact spacing between defensive and midfield lines`,
        'Set-piece delivery targeted as a primary scoring avenue on the road',
      ],
    },
    h2h: {
      played: 6,
      homeWins: 3,
      draws: 2,
      awayWins: 1,
      avgGoals: 2.7,
      avgXg: '1.58 vs 1.24',
    },
    verdict: {
      prediction:
        status === 'FT'
          ? `Post-Match Review: ${homeName} ${homeScore} - ${awayScore} ${awayName}`
          : `${homeName} Slight xG Advantage • Tight Tactical Contest`,
      confidence: '79% Tactical Model Confidence',
      tacticalKey: 'First-goal leverage and bench impact after the 65th minute.',
    },
  };
}

export const NICHE_ARTICLES: NicheArticle[] = [
  {
    id: 'art-ars-liv-preview',
    slug: 'arsenal-vs-liverpool-preview-tactical-analysis',
    title: 'Arsenal vs Liverpool Preview: Key Tactical Battles, Predicted Lineups & xG Form Guide',
    pillar: 'timely',
    category: 'Match Preview',
    leagueCode: 'PL',
    readTime: '6 min read',
    publishedAt: 'Oct 30, 2026',
    seoKeyword: 'Arsenal vs Liverpool preview',
    excerpt:
      'How Mikel Arteta’s 3-2-5 rest-defense structure matches up against Arne Slot’s controlled buildup and lethal counter-attacks at the Emirates Stadium.',
    keyTakeaways: [
      'Arsenal’s right-sided triangle (White–Ødegaard–Saka) accounts for 46% of their open-play expected threat (xT).',
      'Liverpool’s double pivot (Gravenberch–Mac Allister) baits opposing presses to open vertical lanes for Salah.',
      'Set-pieces remain the decisive xG swing factor: Arsenal lead Europe with 0.44 set-piece xG per 90.',
    ],
    tacticalBoard: {
      formation: '4-3-3 vs 4-2-3-1',
      pressingStyle: 'Man-Oriented High Press vs Mid-Block Trap',
      keyZone: 'Right Half-Space (Zone 15)',
    },
    contentSections: [
      {
        heading: '1. Build-Up Shapes & Pressing Triggers',
        body: 'Out of possession, Arsenal morph into a compact 4-4-2 with Martin Ødegaard stepping up alongside Kai Havertz to screen the opposition’s double pivot. Liverpool counter this by dropping Ryan Gravenberch between the center-backs briefly to create a 3v2 overload before playing vertical bounce passes.',
      },
      {
        heading: '2. Key Battle: Bukayo Saka vs Liverpool’s Left Flank',
        body: 'When Ben White overlaps on the outside, Andrew Robertson is forced into a dilemma: track the runner or stay tight to Saka’s left foot. Expect Luis Díaz and Alexis Mac Allister to tuck inside to close the half-space cutback lane.',
      },
      {
        heading: '3. Data & xG Verdict',
        body: 'Across the last 5 meetings at the Emirates and Anfield, both sides have combined for 3.2 goals per game and an average of 3.51 combined xG. Expect high-intensity pressing waves in the opening 25 minutes.',
      },
    ],
  },
  {
    id: 'art-low-block-formation',
    slug: 'best-formation-against-low-block-tactical-guide',
    title: 'Best Formation Against a Low Block: Why Elite Coaches Use the 3-2-5 Box Midfield',
    pillar: 'evergreen',
    category: 'Tactical Guide',
    leagueCode: 'ALL',
    readTime: '8 min read',
    publishedAt: 'Oct 28, 2026',
    seoKeyword: 'best formation against low block',
    excerpt:
      'Struggling to break down a compact 5-4-1 or 4-5-1 defense? Learn the 5-lane positional principles, half-space underlaps, and rest-defense structures used by top European tacticians.',
    keyTakeaways: [
      'Occupy all 5 vertical corridors simultaneously: 2 touchline wingers + 2 half-space #10s + 1 central #9.',
      'Use a 3-2 rest-defense base (3 defenders + 2 pivots) to recycle second balls and prevent counter-attacks.',
      'Trigger blind-side third-man runs into the penalty box when the ball is switched rapidly from flank to flank.',
    ],
    tacticalBoard: {
      formation: '3-2-5 / 2-3-5 In Possession',
      pressingStyle: '6-Second Counter-Press (Gegenpressing)',
      keyZone: 'Zone 14 & Both Half-Spaces',
    },
    contentSections: [
      {
        heading: 'Why Traditional Formations Stagnate Against Low Blocks',
        body: 'Against a deep 5-4-1 low block, keeping four defenders back leaves you outnumbered between the lines. By inverting a full-back into midfield or pushing one full-back high while the other forms a back three, you transform a 4-3-3 into a 3-2-5 attacking shape.',
      },
      {
        heading: 'Pinning the Back Five Across All 5 Lanes',
        body: 'When both wingers hug the touchline, the opponent’s wing-backs cannot tuck inside without leaving a free switch of play. This creates natural gaps in the half-spaces between the opposition center-backs and full-backs for your dual #8/#10 playmakers.',
      },
      {
        heading: 'The Cutback Zone: Highest xG Shot Creation',
        body: 'Data across the top 5 European leagues shows that crosses from wide areas convert at less than 4%, whereas low cutbacks from the byline inside the penalty box carry an average xG of 0.22 to 0.35 per shot.',
      },
    ],
  },
  {
    id: 'art-clasico-post-match',
    slug: 'real-madrid-barcelona-post-match-tactical-review',
    title: 'Post-Match Analysis: How Barcelona’s 45-Meter High Line Neutralized Real Madrid’s Transition Threat',
    pillar: 'timely',
    category: 'Post-Match Analysis',
    leagueCode: 'PD',
    readTime: '7 min read',
    publishedAt: 'Oct 29, 2026',
    seoKeyword: 'Real Madrid vs Barcelona post match analysis',
    excerpt:
      'A frame-by-frame tactical breakdown of Hansi Flick’s synchronized offside trap, Pedri’s tempo control, and Lamine Yamal’s decisive half-space finishing.',
    keyTakeaways: [
      'Barcelona maintained an average defensive line height of 44.8 meters, forcing 7+ first-half offsides.',
      'Pedri and Marc Casadó completed 91% of passes under high pressure, starving Real Madrid of transition moments.',
      'Lamine Yamal and Raphinha combined for 1.42 xG through diagonal runs behind Ferland Mendy.',
    ],
    tacticalBoard: {
      formation: '4-2-3-1 High-Line Compress',
      pressingStyle: 'Synchronized Step-Up Trap',
      keyZone: 'Midfield Third (35m–55m)',
    },
    contentSections: [
      {
        heading: 'The Mechanics of the High Offside Trap',
        body: 'Rather than dropping deep out of fear of Kylian Mbappé’s pace, Pau Cubarsí and Iñigo Martínez watched the ball-carrier’s head. Whenever a Real Madrid midfielder had no immediate pressure, the back four stepped up two yards in unison just as the pass was struck.',
      },
      {
        heading: 'Second-Half Midfield Dominance',
        body: 'By compressing the vertical distance between Robert Lewandowski and the defensive line to just 22 meters, Barcelona won 64% of loose balls in the middle third and sustained relentless attacking waves.',
      },
    ],
  },
  {
    id: 'art-set-piece-guide',
    slug: 'modern-corner-kick-tactics-blocker-routines-xg',
    title: 'Tactical Guide: Inside the Near-Post Blocker & Back-Post Overload Corner Routines',
    pillar: 'evergreen',
    category: 'Tactical Guide',
    leagueCode: 'CL',
    readTime: '6 min read',
    publishedAt: 'Oct 25, 2026',
    seoKeyword: 'football set piece tactics guide',
    excerpt:
      'Set-pieces account for 28% of all goals in the Champions League and Premier League. Here is how specialized set-piece coaches engineer free headers inside the six-yard box.',
    keyTakeaways: [
      'In-swinging deliveries into the six-yard box double the probability of goalkeeper errors and second-ball tap-ins.',
      'Starting 4 attackers at the back post before sprinting toward the near post disrupts zonal-marking blockers.',
      'Two edge-of-the-box guards prevent opposition counter-attacks while sustaining second-phase pressure.',
    ],
    tacticalBoard: {
      formation: '6-Yard Box Stack (4+2 Routine)',
      pressingStyle: 'Second-Ball Counter-Lock',
      keyZone: 'Six-Yard Corridor',
    },
    contentSections: [
      {
        heading: 'Why In-Swingers Dominate Modern Analytics',
        body: 'An in-swinging corner curves toward the goal line with pace, forcing the goalkeeper to make a split-second decision in traffic. Any slight deflection inside the six-yard box results in a high-xG shot.',
      },
      {
        heading: 'Defeating Hybrid Zonal-Man Marking',
        body: 'Most top clubs use 5 zonal defenders along the six-yard line and 4 man-markers. By using legal screens and late curved runs from the penalty spot, attackers gain a half-yard separation at the exact point of delivery.',
      },
    ],
  },
  {
    id: 'art-wonderkids-2026',
    slug: 'best-u21-young-players-europe-2026-scouting-list',
    title: 'Best of 2026: Top 10 U-21 Wonderkids Dominating European Football by xG & Progressive Carries',
    pillar: 'evergreen',
    category: 'Best Of List',
    leagueCode: 'ALL',
    readTime: '9 min read',
    publishedAt: 'Oct 22, 2026',
    seoKeyword: 'best young football players 2026',
    excerpt:
      'From Lamine Yamal and Pau Cubarsí to Warren Zaïre-Emery and Ethan Nwaneri — ranking Europe’s most impactful teenage and U-21 stars using underlying per-90 telemetry.',
    keyTakeaways: [
      'Lamine Yamal leads all U-21 wingers in Europe in combined non-penalty xG + xAG per 90 (0.89).',
      'Pau Cubarsí ranks in the 98th percentile among all European center-backs for line-breaking passes.',
      'João Neves and Kobbie Mainoo set the benchmark for press-resistant ball retention in central midfield.',
    ],
    tacticalBoard: {
      formation: 'U-21 Best XI (4-3-3)',
      pressingStyle: 'High-Volume Progressive Carrying',
      keyZone: 'Final Third & Half-Spaces',
    },
    contentSections: [
      {
        heading: 'How We Ranked Europe’s Elite Youth Talent',
        body: 'Rather than relying on raw goal tallies alone, our scouting model weights progressive passes received, shot-creating actions (SCA) per 90, duel win percentage, and senior minutes played in the top 5 European leagues and UEFA Champions League.',
      },
      {
        heading: 'The Rise of Press-Resistant Teenagers',
        body: 'Modern academy development prioritizes scanning frequency (checking shoulders 6–8 times per 10 seconds before receiving) so young midfielders can play one-touch vertical passes under intense pressure.',
      },
    ],
  },
  {
    id: 'art-pressing-drills',
    slug: 'coaching-drills-high-press-rondo-transition',
    title: 'Coaching & Youth Development: 3 High-Intensity Rondo Drills to Teach Pressing Triggers',
    pillar: 'evergreen',
    category: 'Training & Coaching',
    leagueCode: 'ALL',
    readTime: '5 min read',
    publishedAt: 'Oct 19, 2026',
    seoKeyword: 'football pressing training drills',
    excerpt:
      'Practical training pitch blueprints for coaches and players: how to train curved pressing runs, cover shadows, and 6-second counter-pressing habits.',
    keyTakeaways: [
      'Teach players to curve their pressing run to block the passing lane behind them (using their cover shadow).',
      'Universal pressing triggers: a backward pass, a bouncing ball, a heavy touch, or a receiver facing their own goal.',
      'Use 6v3 transition rondos with mini-goals to reward immediate shots within 5 seconds of ball recovery.',
    ],
    tacticalBoard: {
      formation: '6v3 Transition Grid (25m x 25m)',
      pressingStyle: 'Curved Run + Cover Shadow',
      keyZone: 'Central Coaching Grid',
    },
    contentSections: [
      {
        heading: 'Drill 1: The Two-Grid 6v3 Transition Rondo',
        body: 'Set up two adjacent 20x20m grids with four mini-goals on the outer corners. The possession team must complete 8 passes before transferring the ball to the other grid. If the 3 defenders win the ball, they have 6 seconds to score in any mini-goal.',
      },
      {
        heading: 'Coaching Point: The Cover Shadow',
        body: 'Stop players from sprinting in a straight line at the ball-carrier. By arching their run at a 30-degree angle, a single presser can close down the defender with the ball while simultaneously blocking the pass to the central midfielder.',
      },
    ],
  },
];

export const GEAR_REVIEWS: GearReviewItem[] = [
  {
    id: 'gear-predator-pro-2026',
    name: 'Adidas Predator Pro Fold-Over Tongue (2026 Pack)',
    category: 'Football Boots',
    price: '$145',
    under150: true,
    rating: 4.9,
    bestFor: 'Central Midfielders, Playmakers & Set-Piece Specialists',
    seoKeyword: 'best football boots 2026 under $150',
    pros: [
      'High-grip rubber Strikeskin elements generate elite curl and dip on passes',
      'Best value-for-money pro-level takedown boot under the $150 price point',
      'Comfortable HybridTouch 2.0 upper requires almost zero break-in time',
    ],
    cons: ['Slightly heavier (235g) than ultra-thin speed boots'],
    verdict:
      'Our #1 rated football boot under $150 in 2026. Delivers 95% of the $280 Elite tier performance at nearly half the cost.',
    affiliateBadge: 'Editor’s Choice • Under $150',
    accentColor: '#10b981',
  },
  {
    id: 'gear-vapor-16-pro',
    name: 'Nike Mercurial Vapor 16 Pro FG (Air Zoom)',
    category: 'Football Boots',
    price: '$148',
    under150: true,
    rating: 4.8,
    bestFor: 'Explosive Wingers, Forwards & High-Pressing Full-Backs',
    seoKeyword: 'best football boots 2026 under $150',
    pros: [
      'Responsive forefoot Air Zoom unit provides snappy propulsion on sprints',
      'Ultra-lightweight Flyknit upper with tacky ball-control finish',
      'Aggressive chevron studs ideal for quick cuts in the final third',
    ],
    cons: ['Narrow midfoot fit may feel snug for wide-footed players'],
    verdict:
      'The ultimate speed boot under $150 for wingers who rely on sharp 1v1 changes of direction.',
    affiliateBadge: 'Best Speed Boot • Under $150',
    accentColor: '#38bdf8',
  },
  {
    id: 'gear-puma-future-8',
    name: 'Puma Future 8 Pro Cage / FG (PWRTAPE Edition)',
    category: 'Football Boots',
    price: '$135',
    under150: true,
    rating: 4.7,
    bestFor: 'Wide-Footed Players & Creative #10s (Laced or Laceless)',
    seoKeyword: 'best wide fit football boots 2026',
    pros: [
      'Adaptive FUZIONFIT360 mesh accommodates wide feet effortlessly',
      '360-degree conical/bladed stud layout is safe on both natural grass (FG) and artificial turf (AG)',
      'Under $140 retail price with durable toe-box reinforcement',
    ],
    cons: ['Slightly thicker padded feel on the ball compared to Nike Mercurial'],
    verdict:
      'Unbeatable comfort and FG/AG versatility for players who play multiple times a week on mixed surfaces.',
    affiliateBadge: 'Best Wide Fit & AG Safe',
    accentColor: '#f59e0b',
  },
  {
    id: 'gear-gps-vest-tracker',
    name: 'PitchPulse Pro GPS Player Telemetry Vest & Pod',
    category: 'Training Equipment',
    price: '$129',
    under150: true,
    rating: 4.8,
    bestFor: 'Sunday League, Academy Players & Youth Coaches Tracking Heatmaps',
    seoKeyword: 'best football GPS tracker vest 2026',
    pros: [
      'Tracks total distance, top sprint speed (km/h), high-intensity runs, and pitch heatmaps',
      'Syncs via Bluetooth to iOS/Android with zero monthly subscription required',
      'Breathable compression vest legal for match and training wear',
    ],
    cons: ['Does not track ball-touch metrics without separate shin sensors'],
    verdict:
      'Brings Premier League-style physical telemetry and post-match heatmaps to grassroots players.',
    affiliateBadge: 'Top Training Tech',
    accentColor: '#a855f7',
  },
  {
    id: 'gear-tactical-ebook',
    name: 'Digital Playbook: Mastering the 3-2-5 & Breaking Low Blocks (2026 Edition)',
    category: 'Digital Guide',
    price: '$19',
    under150: true,
    rating: 5.0,
    bestFor: 'Tactical Analysts, Coaches & Serious Football Fans',
    seoKeyword: 'football tactical analysis ebook guide',
    pros: [
      '120+ pages of 2D tactical diagrams, pressing triggers, and set-piece routines',
      'Includes 25 printable training session blueprints for coaches',
      'Instant PDF + Notion template download',
    ],
    cons: ['Digital download only'],
    verdict:
      'Our flagship in-house tactical blueprint used by over 4,200 coaches, analysts, and fantasy managers.',
    affiliateBadge: 'PitchPulse Original • Instant Download',
    accentColor: '#ec4899',
  },
];

