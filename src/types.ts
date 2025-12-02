// On importe les définitions depuis le moteur
import { 
  OddsAnalysis, 
  AIPrediction, 
  PlayerAttributes, 
  Circuit, 
  H2HFullProfile, 
  HumanFactors, // 👈 IL FAUT L'IMPORTER ICI
  WebScrapedData, 
  ComboStrategy,
  ComboSelection
} from './engine/types';

// Structure des matchs passés
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

// 👇 ET IL FAUT L'EXPORTER ICI POUR QUE H2HENGINE LE TROUVE
export type { 
  AIPrediction, 
  OddsAnalysis, 
  PlayerAttributes, 
  Circuit, 
  H2HFullProfile, 
  HumanFactors, // ✅ Ajouté
  WebScrapedData,
  ComboStrategy,
  ComboSelection
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
