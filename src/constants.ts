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
    player1: { 
        name: 'Ficovich J.P.', 
        rank: 169, 
        country: 'ARG', 
        form: 90, 
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
        name: 'Gomez J.S.', 
        rank: 997, 
        country: 'COL', 
        form: 40, 
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
      winner: 'Ficovich J.P.',
      confidence: 92,
      recommendedBet: 'Ficovich 2-0',
      riskLevel: 'SAFE',
      marketType: 'SET_BET',
      circuit: 'CHALLENGER',
      fairOdds: { p1: 1.05, p2: 8.00 },
      attributes: [
        { power: 85, serve: 50, return: 80, mental: 85, form: 90 },
        { power: 60, serve: 77, return: 40, mental: 50, form: 40 }
      ],
      qualitativeAnalysis: "Mismatch total. Ficovich reste sur 3 victoires solides ici à Bogota. Gomez (ATP 997) ne tient pas la cadence.",
      structuralAnalysis: "Gomez commet trop de fautes directes en coup droit.",
      quantitativeAnalysis: "Ratio W/L Terre Battue : Ficovich 65% vs Gomez 30%.",
      integrity: { isSuspicious: false, score: 0 },
      oddsAnalysis: { 
          bestOdds: { p1: 1.15, p2: 4.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, 
          marketAverage: { p1: 1.12, p2: 4.50 }, 
          recommendedBookie: 'Winamax', 
          kelly: { percentage: 10, advice: "Mise Max (Safe)" }, 
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, 
          bookmakers: [
              { name: 'Winamax', p1: 1.15, p2: 4.50, payout: 95, openingOdds: {p1: 1.25, p2: 3.80}, movement: 'DOWN', isTrap: false, isValue: true },
              { name: 'Betclic', p1: 1.12, p2: 4.40, payout: 94, openingOdds: {p1: 1.22, p2: 3.90}, movement: 'DOWN', isTrap: false, isValue: false }
          ]
      }
    }
  },

  // --- MATCH 2 : LIVE (ATP Miami) ---
  {
    id: '1',
    tournament: 'ATP Miami',
    date: '2024-03-24',
    time: '20:30',
    status: 'LIVE',
    surface: 'Hard',
    player1: { name: 'C. Alcaraz', rank: 2, country: 'ESP', form: 95, surfacePrefs: { hard: 90, clay: 95, grass: 85 } },
    player2: { name: 'J. Sinner', rank: 3, country: 'ITA', form: 98, surfacePrefs: { hard: 95, clay: 80, grass: 85 } },
    score: '6-4 4-3',
    odds: { player1: 1.85, player2: 1.95, p1: 1.85, p2: 1.95 },
    ai: {
      winner: 'J. Sinner',
      confidence: 65,
      recommendedBet: 'Sinner Vainqueur',
      riskLevel:
