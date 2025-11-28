export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number; // 0-100
  surfacePrefs: {
    hard: number;
    clay: number;
    grass: number;
  };
}

export interface MatchOdds {
  player1: number;
  player2: number;
}

export interface AIPrediction {
  winner: string;
  confidence: number;
  recommendedBet: string; // ex: "Alcaraz 2-0"
  riskLevel: 'SAFE' | 'MODERATE' | 'RISKY';
  marketType: 'WINNER' | 'SET_BET' | 'TOTAL_GAMES';
  circuit: string; // ATP, WTA...
  trap?: { isTrap: boolean; reason?: string };
  integrity?: { isSuspicious: boolean; reason?: string };
}

export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING';
  player1: Player;
  player2: Player;
  score?: string; // ex: "6-4 2-1"
  odds: {
    player1: number;
    player2: number;
    p1: number; // Alias pour compatibilité
    p2: number; // Alias pour compatibilité
  };
  ai?: AIPrediction;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
}

export type MatchStatus = Match['status'];
