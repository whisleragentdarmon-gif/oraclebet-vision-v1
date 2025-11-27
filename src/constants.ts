import { Match } from "../types";

export const MOCK_MATCHES: Match[] = [
  {
    id: 1,
    status: "LIVE",
    player1: { name: "A. Rublev", rank: 6 },
    player2: { name: "F. Auger-Aliassime", rank: 12 },
    score: "4-2",
    odds: { p1: 1.65, p2: 2.20 },
    ai: {
      winner: "A. Rublev",
      confidence: 72,
      recommendedBet: "Rublev gagne",
      fairOdds: { p1: 1.55, p2: 2.45 },
      riskLevel: "Moderate",
      totalGamesProjection: 23,
      monteCarlo: {
        setDistribution: { "2-0": 0.52, "2-1": 0.28, "1-2": 0.15, "0-2": 0.05 }
      }
    }
  },
  {
    id: 2,
    status: "LIVE",
    player1: { name: "N. Osaka", rank: 14 },
    player2: { name: "E. Rybakina", rank: 4 },
    score: "3-4",
    odds: { p1: 2.10, p2: 1.70 },
    ai: {
      winner: "E. Rybakina",
      confidence: 68,
      recommendedBet: "Rybakina gagne",
      fairOdds: { p1: 2.40, p2: 1.55 },
      riskLevel: "Moderate",
      totalGamesProjection: 21,
      monteCarlo: {
        setDistribution: { "2-0": 0.48, "2-1": 0.29, "1-2": 0.18, "0-2": 0.05 }
      }
    }
  }
];
