// Fichier : src/engine/types.ts

export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY';

export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  stamina?: number;
  speed?: number;
}

export interface DetailedPrediction {
  winner: string;
  confidence: number;
  scorePrediction: string;
  totalGames: number;
  riskLevel: RiskLevel;
}

export interface LiveUpdatePayload {
  matchId: string;
  score: string;
  pointByPoint: string[];
  momentum: number; // -100 to 100
}

export interface SimulationResult {
  finalBankroll: number;
  riskOfRuin: number;
  volatility: number;
  maxBankroll: number;
  minBankroll: number;
  paths: { x: number; y: number }[][];
}

export interface MonteCarloStats {
  winProbability: number;
  expectedValue: number;
  kellyCriterion: number;
}

export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';

export interface BookmakerOdds {
  name: BookmakerName;
  p1: number;
  p2: number;
  payout: number;
  movement: 'UP' | 'DOWN' | 'STABLE';
  isTrap: boolean;
  isValue: boolean;
}

export interface ArbitrageResult {
  isSurebet: boolean;
  profit: number;
  bookmakerP1: string;
  bookmakerP2: string;
  msg: string;
}

export interface OddsAnalysis {
  bestOdds: { p1: number; p2: number; bookieP1: string; bookieP2: string };
  marketAverage: { p1: number; p2: number };
  recommendedBookie: string;
  kelly: { percentage: number; advice: string };
  arbitrage: ArbitrageResult;
  bookmakers: BookmakerOdds[];
}

export interface BetRecord {
    id: string;
    matchId: string;
    matchTitle: string;
    selection: string;
    odds: number;
    stake: number;
    status: 'PENDING' | 'WON' | 'LOST' | 'VOID';
    profit: number;
    date: string;
    confidenceAtTime: number;
}

export interface BankrollState {
    currentBalance: number;
    startBalance: number;
    totalBets: number;
    wins: number;
    losses: number;
    totalInvested: number;
    totalReturned: number;
    roi: number;
    history: BetRecord[];
}

export interface ComboStrategy {
  type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium';
  selections: {
    player1: string;
    player2: string;
    selection: string;
    odds: number;
    confidence: number;
    reason: string;
  }[];
  combinedOdds: number;
  successProbability: number;
  riskScore: string;
}
