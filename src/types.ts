// Fichier : src/types.ts
// On importe tout depuis le moteur pour éviter les doublons
import { OddsAnalysis, AIPrediction, PlayerAttributes } from './engine/types';

export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number;
  surfacePrefs: { hard: number; clay: number; grass: number };
}

export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

// On ré-exporte AIPrediction pour que les pages le trouvent facilement
export type { AIPrediction };

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
