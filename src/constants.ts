import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  // --- 1. RATTRAPAGE MANUEL (Crowder vs Osher) ---
  {
    id: 'rattrapage-crowder',
    tournament: 'UTR PTT Oxford',
    date: '02.12.2025',
    time: 'FINISHED',
    status: 'FINISHED',
    validationResult: 'PENDING',
    surface: 'Hard',
    score: '6-2 6-1',
    player1: { name: 'R. Crowder', rank: 0, country: 'USA', form: 80, surfacePrefs: { hard: 80, clay: 50, grass: 50 }, lastMatches: [] },
    player2: { name: 'A. Osher', rank: 0, country: 'USA', form: 40, surfacePrefs: { hard: 50, clay: 50, grass: 50 }, lastMatches: [] },
    odds: { player1: 1.35, player2: 3.50, p1: 1.35, p2: 3.50 },
    ai: {
      winner: 'R. Crowder',
      confidence: 85,
      recommendedBet: 'R. Crowder 2-0',
      riskLevel: 'SAFE',
      marketType: 'SCORE EXACT',
      circuit: 'ITF',
      fairOdds: { p1: 1.20, p2: 4.00 },
      integrity: { isSuspicious: false, score: 0 },
      attributes: [],
      oddsAnalysis: { bestOdds: {p1:1.35, p2:3.50, bookieP1:'Winamax', bookieP2:'Unibet'}, marketAverage:{p1:1.30, p2:3.40}, recommendedBookie:'Winamax', kelly:{percentage:5, advice:''}, arbitrage:{isSurebet:false, profit:0, bookmakerP1:'', bookmakerP2:'', msg:''}, bookmakers:[] }
    }
  },

  // --- 2. DÉMO FICTIVE LIVE (Ficovich vs Gomez) ---
  // ID commencant par 'mock-' pour être ignoré par l'IA
  {
    id: 'mock-live-bogota',
    tournament: 'Challenger Bogota',
    date: '02.12.2025',
    time: '18:10',
    status: 'LIVE',
    surface: 'Clay',
    score: '0-0 (2-2)',
    player1: { 
        name: 'Ficovich J.P.', rank: 169, country: 'ARG', form: 90, 
        surfacePrefs: { hard: 60, clay: 95, grass: 40 },
        lastMatches: [
            { date: '28.11', tournament: 'Bogota', surface: 'Clay', opponent: 'Barrientos N.', score: '2-0', result: 'W' },
            { date: '26.11', tournament: 'Bogota', surface: 'Clay', opponent: 'McCormick T.', score: '2-1', result: 'W' },
            { date: '24.11', tournament: 'Bogota', surface: 'Clay', opponent: 'Alves M.', score: '2-1', result: 'W' },
            { date: '24.10', tournament: 'Curitiba', surface: 'Clay', opponent: 'Boscardin P.', score: '0-2', result: 'L' },
            { date: '13.10', tournament: 'Campinas', surface: 'Clay', opponent: 'Pacheco R.', score: '1-2', result: 'L' }
        ]
    },
    player2: { 
        name: 'Gomez J.S.', rank: 997, country: 'COL', form: 40, 
        surfacePrefs: { hard: 50, clay: 60, grass: 30 },
        lastMatches: [
            { date: '28.11', tournament: 'Bogota', surface: 'Clay', opponent: 'Inconnu A.', score: '0-2', result: 'L' },
            { date: '15.11', tournament: 'Futures', surface: 'Hard', opponent: 'Perez A.', score: '1-2', result: 'L' },
            { date: '02.11', tournament: 'Futures', surface: 'Hard', opponent: 'Smith J.', score: '0-2', result: 'L' },
            { date: '20.10', tournament: 'Bogota', surface: 'Clay', opponent: 'Local', score: '2-0', result: 'W' },
            { date: '10.10', tournament: 'Medellin', surface: 'Clay', opponent: 'Top Seed', score: '0-2', result: 'L' }
        ]
    },
    odds: { player1: 1.15, player2: 4.50, p1: 1.15, p2: 4.50 },
    ai: {
      winner: 'Ficovich J.P.', confidence: 92, recommendedBet: 'Ficovich 2-0', riskLevel: 'SAFE', marketType: 'SET_BET', circuit: 'CHALLENGER',
      fairOdds: { p1: 1.05, p2: 8.00 },
      attributes: [{ power: 85, serve: 50, return: 80, mental: 85, form: 90 }, { power: 60, serve: 77, return: 40, mental: 50, form: 40 }],
      qualitativeAnalysis: "Mismatch total. Ficovich reste sur 3 victoires solides ici à Bogota.",
      integrity: { isSuspicious: false, score: 0 },
      oddsAnalysis: { bestOdds: { p1: 1.15, p2: 4.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, marketAverage: { p1: 1.12, p2: 4.50 }, recommendedBookie: 'Winamax', kelly: { percentage: 10, advice: "Mise Max" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  },

  // --- 3. MATCH A VENIR (Rune vs Struff) ---
  {
    id: 'upcoming-rune-struff',
    tournament: 'ATP Munich',
    date: '03.12.2025',
    time: '14:00',
    status: 'UPCOMING',
    surface: 'Clay',
    player1: { name: 'H. Rune', rank: 7, country: 'DEN', form: 60, surfacePrefs: { hard: 85, clay: 80, grass: 70 }, lastMatches: [] },
    player2: { name: 'J. Struff', rank: 25, country: 'GER', form: 90, surfacePrefs: { hard: 75, clay: 90, grass: 60 }, lastMatches: [] },
    odds: { player1: 1.65, player2: 2.25, p1: 1.65, p2: 2.25 },
    ai: {
      winner: 'J. Struff',
      confidence: 65,
      recommendedBet: 'Struff ou +1.5 Sets',
      riskLevel: 'RISKY',
      marketType: 'HANDICAP',
      circuit: 'ATP',
      fairOdds: { p1: 1.90, p2: 1.90 },
      qualitativeAnalysis: "ALERTE PIÈGE. Rune a joué 4h hier (Fatigue extrême).",
      integrity: { isSuspicious: true, score: 75, reason: "Chute brutale de la cote de Struff" },
      attributes: [{ power: 80, serve: 75, return: 80, mental: 60, form: 60 }, { power: 90, serve: 95, return: 70, mental: 85, form: 90 }],
      oddsAnalysis: { bestOdds: { p1: 1.65, p2: 2.30, bookieP1: 'Winamax', bookieP2: 'Unibet' }, marketAverage: { p1: 1.60, p2: 2.20 }, recommendedBookie: 'Unibet', kelly: { percentage: 0, advice: "No Bet" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  },

  // --- 4. MATCH A VENIR (Djokovic vs Monfils) ---
  {
    id: 'upcoming-djoko-monfils',
    tournament: 'ATP Cincinnati',
    date: '03.12.2025',
    time: '20:00',
    status: 'UPCOMING',
    surface: 'Hard',
    player1: { name: 'N. Djokovic', rank: 1, country: 'SRB', form: 95, surfacePrefs: { hard: 99, clay: 90, grass: 95 }, lastMatches: [] },
    player2: { name: 'G. Monfils', rank: 45, country: 'FRA', form: 70, surfacePrefs: { hard: 80, clay: 60, grass: 50 }, lastMatches: [] },
    odds: { player1: 1.12, player2: 6.50, p1: 1.12, p2: 6.50 },
    ai: {
      winner: 'N. Djokovic',
      confidence: 98,
      recommendedBet: 'Djokovic 2-0',
      riskLevel: 'SAFE',
      marketType: 'SET_BET',
      circuit: 'ATP',
      fairOdds: { p1: 1.05, p2: 12.00 },
      qualitativeAnalysis: "H2H : 19-0 pour Djokovic.",
      integrity: { isSuspicious: false, score: 0 },
      attributes: [{ power: 90, serve: 95, return: 99, mental: 100, form: 95 }, { power: 85, serve: 80, return: 60, mental: 50, form: 70 }],
      oddsAnalysis: { bestOdds: { p1: 1.12, p2: 7.00, bookieP1: 'Winamax', bookieP2: 'Betclic' }, marketAverage: { p1: 1.10, p2: 6.50 }, recommendedBookie: 'Winamax', kelly: { percentage: 8, advice: "Mise Forte" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  },

  // --- 5. MATCH A VENIR (Draper vs Shelton) ---
  {
    id: 'upcoming-draper-shelton',
    tournament: 'ATP Queens',
    date: '04.12.2025',
    time: '13:00',
    status: 'UPCOMING',
    surface: 'Grass',
    player1: { name: 'J. Draper', rank: 35, country: 'GBR', form: 88, surfacePrefs: { hard: 80, clay: 50, grass: 90 }, lastMatches: [] },
    player2: { name: 'B. Shelton', rank: 15, country: 'USA', form: 75, surfacePrefs: { hard: 90, clay: 60, grass: 75 }, lastMatches: [] },
    odds: { player1: 2.10, player2: 1.75, p1: 2.10, p2: 1.75 },
    ai: {
      winner: 'J. Draper',
      confidence: 60,
      recommendedBet: 'Draper Vainqueur',
      riskLevel: 'RISKY',
      marketType: 'WINNER',
      circuit: 'ATP',
      fairOdds: { p1: 1.80, p2: 2.00 },
      qualitativeAnalysis: "VALUE ALERT. Draper joue à domicile sur gazon.",
      integrity: { isSuspicious: false, score: 0 },
      attributes: [{ power: 85, serve: 90, return: 85, mental: 80, form: 88 }, { power: 95, serve: 95, return: 65, mental: 70, form: 75 }],
      oddsAnalysis: { bestOdds: { p1: 2.15, p2: 1.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, marketAverage: { p1: 2.05, p2: 1.72 }, recommendedBookie: 'Winamax', kelly: { percentage: 3, advice: "Mise Value" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  }
];

export const MOCK_ADMIN_STATS = { aiAccuracy: 78.5, globalROI: 12.4, totalPredictions: 12450, activeUsers: 342 };
