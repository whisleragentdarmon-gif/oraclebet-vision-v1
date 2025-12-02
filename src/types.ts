// Fichier : src/types.ts

// On importe les définitions techniques depuis le moteur
import { OddsAnalysis, AIPrediction, PlayerAttributes, Circuit, H2HFullProfile } from './engine/types';

// Structure des matchs passés (Historique joueur)
export interface PastMatch {
  date: string;
  tournament: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  opponent: string;
  score: string;
  result: 'W' | 'L';
}

// Structure Joueur
export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number;
  surfacePrefs: { hard: number; clay: number; grass: number };
  lastMatches?: PastMatch[];
}

// Structure Cotes simplifiées
export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

// On ré-exporte pour que les pages puissent les utiliser
export type { OddsAnalysis, AIPrediction, PlayerAttributes, Circuit, H2HFullProfile };

// Structure Principale du Match
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
