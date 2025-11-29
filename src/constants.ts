import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  // --- MATCH 1 : LE DIRECT (Ton Challenger Bogota) ---
  {
    id: 'live-bogota-ficovich',
    tournament: 'Challenger Bogota',
    date: '29.11.2025',
    time: '18:10',
    status: 'LIVE',
    surface: 'Clay', // Terre battue (Point fort Ficovich)
    score: '0-0 (2-2)', // Score du screenshot
    player1: { 
        name: 'Ficovich J.P.', 
        rank: 169, 
        country: 'ARG', 
        form: 90, 
        surfacePrefs: { hard: 60, clay: 95, grass: 40 } 
    },
    player2: { 
        name: 'Gomez J.S.', 
        rank: 997, 
        country: 'COL', 
        form: 40, 
        surfacePrefs: { hard: 50, clay: 60, grass: 30 } 
    },
    odds: { player1: 1.15, player2: 4.50, p1: 1.15, p2: 4.50 },
    ai: {
      winner: 'Ficovich J.P.',
      confidence: 92,
      recommendedBet: 'Ficovich 2-0',
      riskLevel: 'SAFE',
      marketType: 'SET_BET',
      circuit: 'CHALLENGER',
      
      // Analyse basée sur tes captures
      fairOdds: { p1: 1.05, p2: 8.00 },
      attributes: [
        { power: 85, serve: 50, return: 80, mental: 85, form: 90 },
        { power: 60, serve: 77, return: 40, mental: 50, form: 40 }
      ],
      qualitativeAnalysis: "Mismatch total. Ficovich est sur sa surface de prédilection. Gomez (ATP 997) ne tient pas la cadence en fond de court.",
      structuralAnalysis: "Le % de premier service de Ficovich est faible (50%) mais il gagne 80% des points derrière.",
      quantitativeAnalysis: "Ficovich reste sur 3 victoires consécutives ici.",
      integrity: { isSuspicious: false, score: 0 },
      oddsAnalysis: { 
          bestOdds: { p1: 1.15, p2: 4.75, bookieP1: 'Winamax', bookieP2: 'Unibet' }, 
          marketAverage: { p1: 1.12, p2: 4.50 }, 
          recommendedBookie: 'Winamax', 
          kelly: { percentage: 10, advice: "Mise Max (Safe)" }, 
          arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, 
          bookmakers: [] 
      }
    }
  },

  // --- MATCH 2 : LIVE (ATP Miami - Pour avoir du contenu) ---
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
      riskLevel: 'MODERATE',
      marketType: 'WINNER',
      circuit: 'ATP',
      winProbA: 45, winProbB: 55, fairOdds: { p1: 2.10, p2: 1.75 },
      attributes: [{ power: 90, serve: 85, return: 95, mental: 88, form: 95 }, { power: 92, serve: 90, return: 90, mental: 95, form: 98 }],
      integrity: { isSuspicious: false, score: 12 },
      oddsAnalysis: { bestOdds: { p1: 1.85, p2: 1.95, bookieP1: 'Winamax', bookieP2: 'Unibet' }, marketAverage: { p1: 1.82, p2: 1.95 }, recommendedBookie: 'Unibet', kelly: { percentage: 2.5, advice: "Mise modérée" }, arbitrage: { isSurebet: false, profit: 0, bookmakerP1: '', bookmakerP2: '', msg: '' }, bookmakers: [] }
    }
  },

  // --- MATCH 3 : TERMINÉ (Pour tester la validation dans Résultats) ---
  {
    id: 'history-1',
    tournament: 'ATP Indian Wells',
    date: '2024-03-20',
    time: 'FINISHED',
    status: 'FINISHED',
    surface: 'Hard',
    score: '6-3 6-2',
    validationResult: 'PENDING', // 👈 Tu pourras cliquer sur ✅ ou ❌
    player1: { name: 'D. Medvedev', rank: 4, country: 'RUS', form: 90, surfacePrefs: { hard: 95, clay: 60, grass: 70 } },
    player2: { name: 'T. Paul', rank: 12, country: 'USA', form: 85, surfacePrefs: { hard: 85, clay: 65, grass: 75 } },
    odds: { player1: 1.45, player2: 2.80, p1: 1.45, p2: 2.80 },
    ai: {
      winner: 'D. Medvedev',
      confidence: 82,
      recommendedBet: 'Medvedev 2-0',
      riskLevel: 'SAFE',
      marketType: 'SET_BET',
      circuit: 'ATP',
      fairOdds: { p1: 1.35, p2: 3.10 },
      integrity: { isSuspicious: false, score: 5 }
    }
  },

  // --- MATCH 4 : GOD MODE (ITF Chine - Pour tester l'auto-validation) ---
  {
    id: 'god-mode-1',
    tournament: 'ITF W15 Shenzhen',
    date: '2024-03-23',
    time: 'FINISHED',
    status: 'FINISHED',
    surface: 'Hard',
    score: '7-5 4-6 6-1',
    validationResult: 'PENDING',
    player1: { name: 'Wei Sijia', rank: 245, country: 'CHN', form: 75, surfacePrefs: { hard: 80, clay: 40, grass: 20 } },
    player2: { name: 'Li Zongyu', rank: 310, country: 'CHN', form: 60, surfacePrefs: { hard: 75, clay: 50, grass: 30 } },
    odds: { player1: 1.60, player2: 2.20, p1: 1.60, p2: 2.20 },
    ai: {
      winner: 'Wei Sijia',
      confidence: 68,
      recommendedBet: 'Wei Sijia',
      riskLevel: 'MODERATE',
      marketType: 'WINNER',
      circuit: 'ITF',
      fairOdds: { p1: 1.50, p2: 2.50 },
      integrity: { isSuspicious: true, score: 65, reason: "Mises anormales sur le 3ème set" }
    }
  }
];

export const MOCK_ADMIN_STATS = { aiAccuracy: 78.5, globalROI: 12.4, totalPredictions: 12450, activeUsers: 342 };
