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
            { date: '13.10', tournament: 'Campinas', surface: 'Clay', opponent: 'Pacheco R.', score: '1-2', result: 'L' },
        ]
    },
    player2: { 
        name: 'Gomez J.S.', 
        rank: 997, 
        country: 'COL', 
        form: 40, 
        surfacePrefs: { hard: 50, clay: 60, grass: 30 },
        lastMatches: [ /* ... tes matchs ... */ ]
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
      // NEW: DONNÉES AVANCÉES
      attributes: [
        { power: 85, serve: 50, return: 80, mental: 85, form: 90 },
        { power: 60, serve: 77, return: 40, mental: 50, form: 40 }
      ],
      qualitativeAnalysis: "Mismatch total. Conditions lentes (Bogota) favorisent Ficovich.",
      integrity: { isSuspicious: false, score: 0 },
      oddsAnalysis: { 
          bestOdds: { p1: 1.15, p2: 4.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, 
          marketAverage: { p1: 1.12, p2: 4.50 }, 
          recommendedBookie: 'Winamax', 
          kelly: { percentage: 10, advice: "Mise Max" }, 
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, 
          bookmakers: [
              // NEW: ANALYSE DES MOUVEMENTS DE COTES
              { name: 'Winamax', p1: 1.15, p2: 4.50, payout: 95, openingOdds: {p1: 1.25, p2: 3.80}, movement: 'DOWN', isTrap: false, isValue: true },
              { name: 'Betclic', p1: 1.12, p2: 4.40, payout: 94, openingOdds: {p1: 1.22, p2: 3.90}, movement: 'DOWN', isTrap: false, isValue: false }
          ]
      }
    }
  },
  // ... (Garde les autres matchs)
];
// ...
