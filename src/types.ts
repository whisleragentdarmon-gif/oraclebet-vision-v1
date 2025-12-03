// On importe tout depuis le moteur principal
import { 
  OddsAnalysis, 
  AIPrediction, 
  PlayerAttributes, 
  Circuit,
  H2HFullProfile,
  PressAnalysis,
  SocialSentiment,
  GeoCondition,
  GodModeReport // Ajouté
} from './engine/types';

export interface PastMatch {
  date: string;
  tournament: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  opponent: string;
  score: string;
  result: 'W' | 'L';
}

export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number;
  surfacePrefs: { hard: number; clay: number; grass: number };
  lastMatches?: PastMatch[]; 
}

export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

// Exportation groupée pour que les autres fichiers trouvent tout
export type { 
  AIPrediction, 
  OddsAnalysis, 
  PlayerAttributes, 
  Circuit,
  H2HFullProfile,
  PressAnalysis,
  SocialSentiment,
  GeoCondition,
  GodModeReport
};

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
  validationResult?: 'CORRECT' | 'WRONG' | 'PENDING';
}

export type MatchStatus = Match['status'];
