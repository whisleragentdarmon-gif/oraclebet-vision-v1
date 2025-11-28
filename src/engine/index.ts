import { OddsAnalysis } from '../engine/types';

// Types de base pour les Joueurs
export interface Player {
  name: string;
  rank: number;
  country: string;
  form: number; // Score de forme sur 100
  surfacePrefs: {
    hard: number;
    clay: number;
    grass: number;
  };
}

// Structure des Cotes d'un match
export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number; // Alias pour compatibilité avec certains composants
  p2: number; // Alias pour compatibilité
}

// Structure complète des Prédictions de l'IA (utilisée par AnalysisPage)
export interface AIPrediction {
  winner: string;
  confidence: number;
  recommendedBet: string; // Ex: "Sinner 2-0"
  riskLevel: 'SAFE' | 'MODERATE' | 'RISKY';
  marketType: string; // Ex: "WINNER", "SET_BET"
  circuit: string; // ATP, WTA, CHALLENGER...
  
  // --- Données requises pour les graphiques AnalysisPage ---
  winProbA?: number; // Probabilité victoire Joueur 1 (%)
  winProbB?: number; // Probabilité victoire Joueur 2 (%)
  
  fairOdds?: { p1: number; p2: number }; // Cotes "justes" calculées par l'IA
  
  // Attributs comparatifs pour le Radar Chart
  attributes?: { 
    power: number; 
    serve: number; 
    return: number; 
    mental: number; 
    form: number 
  }[];
  
  // Résultats de la simulation Monte Carlo
  monteCarlo?: {
      setDistribution: { [key: string]: number }; // Ex: {'2-0': 0.6, '2-1': 0.4}
  };
  
  // Prévisions détaillées du score
  expectedSets?: string; // Ex: "2-1"
  tieBreakProbability?: number;
  breaks?: { p1: number; p2: number }; // Nombre de breaks attendus par joueur
  
  // Détection de pièges et d'anomalies
  trap?: { isTrap: boolean; verdict?: string; reason?: string };
  integrity?: { isSuspicious: boolean; score: number; reason?: string };
  
  // Analyses textuelles générées
  qualitativeAnalysis?: string;
  structuralAnalysis?: string;
  quantitativeAnalysis?: string;
  
  // Analyse comparative des cotes (pour OddsComparator)
  oddsAnalysis?: OddsAnalysis; 
}

// Structure principale d'un Match
export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING';
  player1: Player;
  player2: Player;
  score?: string; // Ex: "6-4 4-3"
  odds: MatchOdds;
  ai?: AIPrediction; // L'IA est optionnelle tant que le match n'est pas analysé
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
}

export type MatchStatus = Match['status'];
