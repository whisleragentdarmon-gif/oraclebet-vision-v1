import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  // --- SEUL MATCH CONSERVÉ : CELUI POUR L'HISTORIQUE ---
  // Il ne s'affichera pas dans le Live ni dans les Combinés.
  // Il sert juste à tester ton bouton "Valider" dans l'onglet Résultats.
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
  }
];

export const MOCK_ADMIN_STATS = { aiAccuracy: 78.5, globalROI: 12.4, totalPredictions: 12450, activeUsers: 342 };
