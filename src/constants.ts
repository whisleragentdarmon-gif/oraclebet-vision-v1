// Temporary MOCK data until live API integration

import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    status: "LIVE",
    tournament: "ATP Bâle",
    player1: { name: "A. Rublev" },
    player2: { name: "F. Auger-Aliassime" },
    odds: { p1: 1.65, p2: 2.25 },
    ai: {
      winner: "A. Rublev",
      confidence: 78,
      riskLevel: "Safe",
      recommendedBet: "Rublev gagne",
      fairOdds: { p1: 1.55, p2: 2.40 },
      totalGamesProjection: 23,
      monteCarlo: { setDistribution: { "2-0": 0.48, "2-1": 0.36 } }
    }
  },
  {
    id: "2",
    status: "TODAY",
    tournament: "WTA Tokyo",
    player1: { name: "N. Osaka" },
    player2: { name: "E. Rybakina" },
    odds: { p1: 2.10, p2: 1.70 },
    ai: {
      winner: "E. Rybakina",
      confidence: 72,
      riskLevel: "Balanced",
      recommendedBet: "Rybakina gagne",
      fairOdds: { p1: 2.40, p2: 1.60 },
      totalGamesProjection: 21,
      monteCarlo: { setDistribution: { "2-0": 0.40, "2-1": 0.42 } }
    }
  }
];
