import { OddsAnalysis } from './engine/types';

export type MatchStatus = 'LIVE' | 'TODAY' | 'UPCOMING' | 'FINISHED';

export interface Player {
  name: string;
  rank: number;
  country: string;
}

export interface MatchStats {
  aces: number;
  doubleFaults: number;
  firstServeIn: number;
  winFirstServe: number;
  breakPointsSaved: number;
}

export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  fatigue: number;
  style: string;
}

export interface TrapResult {
  isTrap: boolean;
  score: number;
  reason: string;
  verdict: 'Safe' | 'Méfiance' | 'Piège';
}

export interface IntegrityResult {
  isSuspicious: boolean;
  score: number;
  reason: string;
  status: 'Clean' | 'Atypique' | 'Danger';
}

export interface MonteCarloStats {
  runs: number;
  p1WinRate: number;
  p2WinRate: number;
  tieBreakProb: number;
  totalGamesAvg: number;
  setDistribution: { [score: string]: number };
  breakDistribution: { p1: number; p2: number };
}

export interface AIPrediction {
  winner: string;
  winnerProbability: number;
  winProbA: number;
  winProbB: number;
  confidence: number;
  recommendedBet: string;
  expectedSets: string;
  riskLevel: 'Safe' | 'Moderate' | 'Risky';
  analysisText: string;
  
  structuralAnalysis: string;
  quantitativeAnalysis: string;
  qualitativeAnalysis: string;
  
  fairOdds: {
    p1: number;
    p2: number;
  };
  
  attributes: PlayerAttributes[];
  trap: TrapResult;
  integrity: IntegrityResult;
  circuit: string;

  // New fields required by UI and Engine
  marketType: 'WINNER' | 'SETS' | 'GAMES' | 'HANDICAP';
  monteCarlo: MonteCarloStats;
  tieBreakProbability: number;
  breaks: { p1: number; p2: number };
  totalGamesProjection: number;
  oddsAnalysis?: OddsAnalysis;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  tournament: string;
  time: string; // ISO or display string
  status: MatchStatus;
  score?: string; // "6-4 | 2-1"
  odds: {
    p1: number;
    p2: number;
  };
  ai?: AIPrediction;
  stats?: {
    p1: MatchStats;
    p2: MatchStats;
  };
}

export interface AdminStats {
  aiAccuracy: number;
  globalROI: number;
  totalPredictions: number;
  activeUsers: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}