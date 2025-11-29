import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    tournament: 'ATP Miami',
    date: '2024-03-22',
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
      riskLevel: 'MODERATE',
      marketType: 'WINNER',
      circuit: 'ATP',
      winProbA: 45,
      winProbB: 55,
      fairOdds: { p1: 2.10, p2: 1.75 },
      attributes: [
        { power: 90, serve: 85, return: 95, mental: 88, form: 95 },
        { power: 92, serve: 90, return: 90, mental: 95, form: 98 }
      ],
      monteCarlo: {
        setDistribution: { '1-2': 0.4, '0-2': 0.3, '2-1': 0.2, '2-0': 0.1 }
      },
      expectedSets: '1-2',
      tieBreakProbability: 60,
      breaks: { p1: 2.5, p2: 3.0 },
      integrity: { isSuspicious: false, score: 12 },
      trap: { isTrap: false, verdict: "Cotes cohérentes" },
      qualitativeAnalysis: "Match très serré. Sinner a l'avantage mental sur surface rapide indoor.",
      structuralAnalysis: "Le service de Sinner fait la différence dans les moments clés.",
      quantitativeAnalysis: "Ratio W/UE favorable à Sinner sur les 5 derniers matchs.",
      oddsAnalysis: {
        bestOdds: { p1: 1.85, p2: 2.00, bookieP1: 'Winamax', bookieP2: 'Unibet' },
        marketAverage: { p1: 1.82, p2: 1.95 },
        recommendedBookie: 'Unibet',
        kelly: { percentage: 2.5, advice: "Mise modérée (2.5%)" },
        arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
        bookmakers: [
            { name: 'Winamax', p1: 1.85, p2: 1.95, payout: 95, movement: 'STABLE', isTrap: false, isValue: true },
            { name: 'Betclic', p1: 1.82, p2: 1.92, payout: 94, movement: 'DOWN', isTrap: false, isValue: false },
            { name: 'Unibet', p1: 1.80, p2: 2.00, payout: 96, movement: 'UP', isTrap: false, isValue: true }
        ]
      }
    }
  },
  {
    id: '2',
    tournament: 'ATP Miami',
    date: '2024-03-22',
    time: '22:00',
    status: 'TODAY',
    surface: 'Hard',
    player1: { name: 'D. Medvedev', rank: 4, country: 'RUS', form: 88, surfacePrefs: { hard: 95, clay: 60, grass: 70 } },
    player2: { name: 'A. Zverev', rank: 6, country: 'GER', form: 85, surfacePrefs: { hard: 88, clay: 85, grass: 75 } },
    odds: { player1: 1.72, player2: 2.10, p1: 1.72, p2: 2.10 },
    ai: {
      winner: 'D. Medvedev',
      confidence: 72,
      recommendedBet: 'Medvedev',
      riskLevel: 'SAFE',
      marketType: 'WINNER',
      circuit: 'ATP',
      winProbA: 65,
      winProbB: 35,
      fairOdds: { p1: 1.55, p2: 2.80 },
      attributes: [
        { power: 80, serve: 90, return: 98, mental: 95, form: 88 },
        { power: 85, serve: 92, return: 75, mental: 70, form: 85 }
      ],
      monteCarlo: {
        setDistribution: { '2-0': 0.5, '2-1': 0.3, '0-2': 0.1, '1-2': 0.1 }
      },
      expectedSets: '2-0',
      tieBreakProbability: 40,
      breaks: { p1: 4.0, p2: 1.5 },
      integrity: { isSuspicious: false, score: 5 },
      trap: { isTrap: false, verdict: "Safe Bet" },
      qualitativeAnalysis: "Medvedev est le mur sur lequel Zverev va s'écraser aujourd'hui.",
      structuralAnalysis: "La défense de Medvedev forcera Zverev à la faute.",
      quantitativeAnalysis: "Zverev : 45% de fautes directes sous pression.",
      oddsAnalysis: {
        bestOdds: { p1: 1.72, p2: 2.15, bookieP1: 'Winamax', bookieP2: 'Betclic' },
        marketAverage: { p1: 1.68, p2: 2.10 },
        recommendedBookie: 'Winamax',
        kelly: { percentage: 4.0, advice: "Mise forte (4%)" },
        arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
        bookmakers: [
            { name: 'Winamax', p1: 1.72, p2: 2.10, payout: 96, movement: 'UP', isTrap: false, isValue: true },
            { name: 'Betclic', p1: 1.70, p2: 2.15, payout: 95, movement: 'STABLE', isTrap: false, isValue: false }
        ]
      }
    }
  },
  {
    id: '3',
    tournament: 'Challenger Phoenix',
    date: '2024-03-23',
    time: '14:00',
    status: 'UPCOMING',
    surface: 'Hard',
    player1: { name: 'B. Nakashima', rank: 92, country: 'USA', form: 70, surfacePrefs: { hard: 80, clay: 50, grass: 60 } },
    player2: { name: 'E. Berrettini', rank: 145, country: 'ITA', form: 60, surfacePrefs: { hard: 85, clay: 70, grass: 90 } },
    odds: { player1: 1.65, player2: 2.25, p1: 1.65, p2: 2.25 },
    ai: {
      winner: 'B. Nakashima',
      confidence: 55,
      recommendedBet: 'Nakashima',
      riskLevel: 'RISKY',
      marketType: 'WINNER',
      circuit: 'CHALLENGER',
      trap: { isTrap: true, verdict: "Piège retour de blessure", reason: 'Berrettini return from injury' },
      integrity: { isSuspicious: true, score: 65, reason: "Mouvements de cotes bizarres" },
      winProbA: 52,
      winProbB: 48,
      fairOdds: { p1: 1.90, p2: 1.90 },
      attributes: [
        { power: 75, serve: 80, return: 80, mental: 75, form: 70 },
        { power: 90, serve: 95, return: 60, mental: 50, form: 60 }
      ],
      monteCarlo: {
        setDistribution: { '2-1': 0.4, '1-2': 0.3, '2-0': 0.2, '0-2': 0.1 }
      },
      expectedSets: '2-1',
      tieBreakProbability: 70,
      breaks: { p1: 1.5, p2: 1.5 },
      qualitativeAnalysis: "Match piège par excellence. Berrettini manque de rythme mais son service reste une arme.",
      structuralAnalysis: "Nakashima est plus solide dans l'échange.",
      quantitativeAnalysis: "Volatilité extrême détectée sur ce match.",
      oddsAnalysis: {
        bestOdds: { p1: 1.65, p2: 2.30, bookieP1: 'Winamax', bookieP2: 'Unibet' },
        marketAverage: { p1: 1.60, p2: 2.20 },
        recommendedBookie: 'Pinnacle',
        kelly: { percentage: 0, advice: "No Bet (Risque)" },
        arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' },
        bookmakers: [
            { name: 'Winamax', p1: 1.65, p2: 2.25, payout: 94, movement: 'DOWN', isTrap: true, isValue: false },
            { name: 'Unibet', p1: 1.60, p2: 2.30, payout: 95, movement: 'UP', isTrap: false, isValue: true }
        ]
      }
    }
  }
];

export const MOCK_ADMIN_STATS = {
    aiAccuracy: 78.5,
    globalROI: 12.4,
    totalPredictions: 12450,
    activeUsers: 342
};
