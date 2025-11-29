// Fichier : src/types.ts
// CORRECTION ICI : on met ./ et pas ../ car engine est dans src
import { OddsAnalysis } from './engine/types';

export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number;
  surfacePrefs: {
    hard: number;
    clay: number;
    grass: number;
  };
}

export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

export interface AIPrediction {
  winner: string;
  confidence: number;
  recommendedBet: string;
  riskLevel: 'SAFE' | 'MODERATE' | 'RISKY';
  marketType: string;
  circuit: string;
  
  winProbA?: number;
  winProbB?: number;
  
  fairOdds?: { p1: number; p2: number };
  
  attributes?: { 
    power: number; 
    serve: number; 
    return: number; 
    mental: number; 
    form: number 
  }[];
  
  monteCarlo?: {
      setDistribution: { [key: string]: number };
  };
  
  expectedSets?: string;
  tieBreakProbability?: number;
  breaks?: { p1: number; p2: number };
  
  trap?: { isTrap: boolean; verdict?: string; reason?: string };
  integrity?: { isSuspicious: boolean; score: number; reason?: string };
  
  qualitativeAnalysis?: string;
  structuralAnalysis?: string;
  quantitativeAnalysis?: string;
  
  oddsAnalysis?: OddsAnalysis; 
}

export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING';
  player1: Player;
  player2: Player;
  score?: string;
  odds: MatchOdds;
  ai?: AIPrediction;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
}

export type MatchStatus = Match['status'];
