// On importe les types techniques depuis le moteur
import { OddsAnalysis, AIPrediction, PlayerAttributes } from './engine/types';

// --- 1. DÉFINITION DES MATCHS PASSÉS (C'est ce qui manquait !) ---
export interface PastMatch {
  date: string;
  tournament: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  opponent: string;
  score: string;
  result: 'W' | 'L';
}

// --- 2. MISE À JOUR DU JOUEUR (Avec l'historique) ---
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
  // C'est cette ligne qui corrige l'erreur "lastMatches n'existe pas"
  lastMatches?: PastMatch[]; 
}

export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

// On ré-exporte pour que tout le monde puisse les utiliser
export type { AIPrediction, OddsAnalysis, PlayerAttributes };

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
