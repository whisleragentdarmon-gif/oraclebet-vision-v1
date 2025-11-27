import { Match } from "../types";

export const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    tournament: "Australian Open",
    time: "11:30",
    status: "LIVE",
    score: "6-4 | 2-1",
    player1: { name: "A. Rublev", rank: 6, country: "RU" },
    player2: { name: "F. Auger-Aliassime", rank: 12, country: "CA" },
    odds: { p1: 1.65, p2: 2.20 },
    
    ai: {
      confidence: 72,
      winner: "A. Rublev",
      recommendedBet: "Rublev gagne",
      marketType: "WINNER",
      circuit: "ATP",
      trap: { isTrap: false },
      integrity: { isSuspicious: false }
    }
  },

  {
    id: "2",
    tournament: "WTA Doha",
    time: "14:10",
    status: "LIVE",
    score: "3-2 | 1-0",
    player1: { name: "N. Osaka", rank: 14, country: "JP" },
    player2: { name: "E. Rybakina", rank: 8, country: "KZ" },
    odds: { p1: 2.40, p2: 1.70 },
    
    ai: {
      confidence: 68,
      winner: "E. Rybakina",
      recommendedBet: "Rybakina gagne",
      marketType: "WINNER",
      circuit: "WTA",
      trap: { isTrap: true },
      integrity: { isSuspicious: false }
    }
  }
];

