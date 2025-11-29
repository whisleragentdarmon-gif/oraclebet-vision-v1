import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  // --- MATCH 1 : LE DIRECT (Ficovich vs Gomez - Bogota) ---
  {
    id: 'live-bogota-ficovich',
    tournament: 'Challenger Bogota',
    date: '29.11.2025',
    time: '18:10',
    status: 'LIVE',
    surface: 'Clay',
    score: '0-0 (2-2)',
    player1: { name: 'Ficovich J.P.', rank: 169, country: 'ARG', form: 90, surfacePrefs: { hard: 60, clay: 95, grass: 40 }, lastMatches: [] },
    player2: { name: 'Gomez J.S.', rank: 997, country: 'COL', form: 40, surfacePrefs: { hard: 50, clay: 60, grass: 30 }, lastMatches: [] },
    odds: { player1: 1.15, player2: 4.50, p1: 1.15, p2: 4.50 },
    ai: {
      winner: 'Ficovich J.P.', confidence: 92, recommendedBet: 'Ficovich 2-0', riskLevel: 'SAFE', marketType: 'SET_BET', circuit: 'CHALLENGER',
      fairOdds: { p1: 1.05, p2: 8.00 },
      attributes: [{ power: 85, serve: 50, return: 80, mental: 85, form: 90 }, { power: 60, serve: 77, return: 40, mental: 50, form: 40 }],
      integrity: { isSuspicious: false, score: 0 },
      oddsAnalysis: { bestOdds: { p1: 1.15, p2: 4.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, marketAverage: { p1: 1.12, p2: 4.50 }, recommendedBookie: 'Winamax', kelly: { percentage: 10, advice: "Mise Max" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  },

  // --- MATCH A VENIR 1 : LE PIÈGE (Rune vs Struff) ---
  // Simulation : Rune est favori mais sa cote chute bizarrement et il est fatigué.
  {
    id: 'upcoming-rune-struff',
    tournament: 'ATP Munich',
    date: 'Demain',
    time: '14:00',
    status: 'UPCOMING',
    surface: 'Clay',
    player1: { name: 'H. Rune', rank: 7, country: 'DEN', form: 60, surfacePrefs: { hard: 85, clay: 80, grass: 70 } },
    player2: { name: 'J. Struff', rank: 25, country: 'GER', form: 90, surfacePrefs: { hard: 75, clay: 90, grass: 60 } },
    odds: { player1: 1.65, player2: 2.25, p1: 1.65, p2: 2.25 },
    ai: {
      winner: 'J. Struff', // L'IA mise sur l'outsider !
      confidence: 65,
      recommendedBet: 'Struff ou +1.5 Sets',
      riskLevel: 'RISKY',
      marketType: 'HANDICAP',
      circuit: 'ATP',
      fairOdds: { p1: 1.90, p2: 1.90 }, // L'IA pense que c'est du 50/50
      qualitativeAnalysis: "ALERTE PIÈGE. Rune a joué 4h hier (Fatigue extrême). Mouvements de cotes suspects contre lui.",
      integrity: { isSuspicious: true, score: 75, reason: "Chute brutale de la cote de Struff (2.80 -> 2.25)" },
      attributes: [
        { power: 80, serve: 75, return: 80, mental: 60, form: 60 }, // Rune fatigué
        { power: 90, serve: 95, return: 70, mental: 85, form: 90 }  // Struff en forme
      ],
      oddsAnalysis: {
          bestOdds: { p1: 1.65, p2: 2.30, bookieP1: 'Winamax', bookieP2: 'Unibet' },
          marketAverage: { p1: 1.60, p2: 2.20 },
          recommendedBookie: 'Unibet',
          kelly: { percentage: 0, advice: "No Bet (Risque)" },
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
          bookmakers: [
              { name: 'Pinnacle', p1: 1.62, p2: 2.35, payout: 98, openingOdds: {p1: 1.45, p2: 2.80}, movement: 'CRASH', isTrap: true, isValue: false }
          ]
      }
    }
  },

  // --- MATCH A VENIR 2 : ULTRA PREMIUM (Djokovic vs Monfils) ---
  {
    id: 'upcoming-djoko-monfils',
    tournament: 'ATP Cincinnati',
    date: 'Demain',
    time: '20:00',
    status: 'UPCOMING',
    surface: 'Hard',
    player1: { name: 'N. Djokovic', rank: 1, country: 'SRB', form: 95, surfacePrefs: { hard: 99, clay: 90, grass: 95 } },
    player2: { name: 'G. Monfils', rank: 45, country: 'FRA', form: 70, surfacePrefs: { hard: 80, clay: 60, grass: 50 } },
    odds: { player1: 1.12, player2: 6.50, p1: 1.12, p2: 6.50 },
    ai: {
      winner: 'N. Djokovic',
      confidence: 98,
      recommendedBet: 'Djokovic 2-0',
      riskLevel: 'SAFE',
      marketType: 'SET_BET',
      circuit: 'ATP',
      fairOdds: { p1: 1.05, p2: 12.00 },
      qualitativeAnalysis: "H2H : 19-0 pour Djokovic. Monfils revient de blessure. Conditions rapides favorisent le service de Novak.",
      integrity: { isSuspicious: false, score: 0 },
      attributes: [
        { power: 90, serve: 95, return: 99, mental: 100, form: 95 },
        { power: 85, serve: 80, return: 60, mental: 50, form: 70 }
      ],
      oddsAnalysis: {
          bestOdds: { p1: 1.12, p2: 7.00, bookieP1: 'Winamax', bookieP2: 'Betclic' },
          marketAverage: { p1: 1.10, p2: 6.50 },
          recommendedBookie: 'Winamax',
          kelly: { percentage: 8, advice: "Mise Forte" },
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
          bookmakers: []
      }
    }
  },

  // --- MATCH A VENIR 3 : VALUE BET (Draper vs Shelton) ---
  {
    id: 'upcoming-draper-shelton',
    tournament: 'ATP Queen\'s',
    date: 'Après-demain',
    time: '13:00',
    status: 'UPCOMING',
    surface: 'Grass',
    player1: { name: 'J. Draper', rank: 35, country: 'GBR', form: 88, surfacePrefs: { hard: 80, clay: 50, grass: 90 } },
    player2: { name: 'B. Shelton', rank: 15, country: 'USA', form: 75, surfacePrefs: { hard: 90, clay: 60, grass: 75 } },
    odds: { player1: 2.10, player2: 1.75, p1: 2.10, p2: 1.75 }, // Draper est outsider
    ai: {
      winner: 'J. Draper',
      confidence: 60,
      recommendedBet: 'Draper Vainqueur',
      riskLevel: 'RISKY', // Risqué mais Value
      marketType: 'WINNER',
      circuit: 'ATP',
      fairOdds: { p1: 1.80, p2: 2.00 }, // L'IA pense qu'il devrait être favori !
      qualitativeAnalysis: "VALUE ALERT. Draper joue à domicile sur gazon (sa meilleure surface). Shelton est moins à l'aise sur herbe.",
      integrity: { isSuspicious: false, score: 0 },
      attributes: [
        { power: 85, serve: 90, return: 85, mental: 80, form: 88 },
        { power: 95, serve: 95, return: 65, mental: 70, form: 75 }
      ],
      oddsAnalysis: {
          bestOdds: { p1: 2.15, p2: 1.75, bookieP1: 'Winamax', bookieP2: 'Unibet' },
          marketAverage: { p1: 2.05, p2: 1.72 },
          recommendedBookie: 'Winamax',
          kelly: { percentage: 3, advice: "Mise Value (3%)" },
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
          bookmakers: []
      }
    }
  },

  // ... (Garde les anciens matchs HISTORY ici si tu veux)
  {
    id: 'history-1',
    tournament: 'ATP Indian Wells',
    date: '2024-03-20',
    time: 'FINISHED',
    status: 'FINISHED',
    surface: 'Hard',
    score: '6-3 6-2',
    validationResult: 'PENDING',
    player1: { name: 'D. Medvedev', rank: 4, country: 'RUS', form: 90, surfacePrefs: { hard: 95, clay: 60, grass: 70 } },
    player2: { name: 'T. Paul', rank: 12, country: 'USA', form: 85, surfacePrefs: { hard: 85, clay: 65, grass: 75 } },
    odds: { player1: 1.45, player2: 2.80, p1: 1.45, p2: 2.80 },
    ai: { winner: 'D. Medvedev', confidence: 82, recommendedBet: 'Medvedev 2-0', riskLevel: 'SAFE', marketType: 'SET_BET', circuit: 'ATP', fairOdds: { p1: 1.35, p2: 3.10 }, integrity: { isSuspicious: false, score: 5 }, attributes: [], oddsAnalysis: { bestOdds: {p1:0,p2:0,bookieP1:'',bookieP2:''}, marketAverage:{p1:0,p2:0}, recommendedBookie:'', kelly:{percentage:0,advice:''}, arbitrage:{isSurebet:false,profit:0,bookmakerP1:'',bookmakerP2:'',msg:''}, bookmakers:[] } }
  },
];

export const MOCK_ADMIN_STATS = { aiAccuracy: 78.5, globalROI: 12.4, totalPredictions: 12450, activeUsers: 342 };
