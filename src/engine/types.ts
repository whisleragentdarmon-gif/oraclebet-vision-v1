// Fichier : src/engine/types.ts

export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- PROFIL H2H COMPLET (GOD MODE) ---
export interface H2HFullProfile {
  p1: {
    name: string;
    rank: string;
    bestRank: string; // Ex-Top 10 ?
    age: string;
    hand: string; // Droitier/Gaucher
    height: string;
    nationality: string;
  };
  p2: {
    name: string;
    rank: string;
    bestRank: string;
    age: string;
    hand: string;
    height: string;
    nationality: string;
  };
  
  // Statistiques Mentales & Service
  stats: {
    p1: { serveRating: string; returnRating: string; mentalRating: string; breakPointsSaved: string };
    p2: { serveRating: string; returnRating: string; mentalRating: string; breakPointsSaved: string };
  };

  // Comportement (Vs profils spécifiques)
  behavior: {
    p1VsHand: string; // P1 vs Gauchers (si P2 est gaucher)
    p2VsHand: string;
    p1VsRank: string; // P1 vs Top 50
    p2VsRank: string;
  };

  h2hMatches: { date: string; winner: string; score: string; surface: string }[];
  
  context: {
    weather: string;
    surfaceSpeed: string; // Rapide/Lent
    motivation: string; // Enjeu du tournoi
  };
  
  sources: string[];
}

// --- Structures IA & Apprentissage ---
export interface AIModelWeights {
  surfaceWeight: number;
  formWeight: number;
  h2hWeight: number;
  fatigueFactor: number;
  mentalWeight: number;
  variance: number;
  momentumWeight?: number;
  serveDominance?: number;
}

export interface LearningExperience {
  matchId: string;
  date: string;
  timestamp?: number;
  prediction: string;
  outcome: 'WIN' | 'LOSS' | 'VOID';
  circuit: Circuit;
  adjustments: string;
  result?: string;
  weightsUsed?: any;
}

// --- Joueurs de base ---
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

// --- Cotes ---
export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';
export interface BookmakerOdds {
  name: BookmakerName;
  p1: number;
  p2: number;
  payout: number;
  openingOdds?: { p1: number, p2: number };
  movement: 'UP' | 'DOWN' | 'STABLE' | 'CRASH';
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

// --- Analyse IA ---
export interface AIPrediction {
  winner: string;
  confidence: number;
  recommendedBet: string;
  riskLevel: RiskLevel;
  marketType: string;
  circuit: string;
  totalGamesProjection?: number; 
  winProbA?: number;
  winProbB?: number;
  fairOdds?: { p1: number; p2: number };
  attributes?: { power: number; serve: number; return: number; mental: number; form: number }[];
  monteCarlo?: { setDistribution: { [key: string]: number } };
  expectedSets?: string;
  tieBreakProbability?: number;
  breaks?: { p1: number; p2: number };
  trap?: { isTrap: boolean; verdict?: string; reason?: string };
  integrity?: { isSuspicious: boolean; score: number; reason?: string };
  qualitativeAnalysis?: string;
  structuralAnalysis?: string;
  quantitativeAnalysis?: string;
  oddsAnalysis?: OddsAnalysis;
  godModeAnalysis?: {
      social: any;
      geo: any;
      trap: any;
      injuryAlert: boolean;
      injuryDetails?: string;
      h2hProfile?: H2HFullProfile;
      realProb?: { p1Prob: number, p2Prob: number };
  };
}

// --- Autres ---
export interface MatchOdds { player1: number; player2: number; p1: number; p2: number; }
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING';

export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  status: MatchStatus;
  player1: Player;
  player2: Player;
  score?: string;
  odds: MatchOdds;
  ai?: AIPrediction;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  validationResult?: 'CORRECT' | 'WRONG' | 'PENDING';
}

// Bankroll & Combo
export interface BetRecord { id: string; matchId: string; matchTitle: string; selection: string; odds: number; stake: number; status: 'PENDING' | 'WON' | 'LOST' | 'VOID'; profit: number; date: string; confidenceAtTime: number; }
export interface BankrollState { currentBalance: number; startBalance: number; totalBets: number; wins: number; losses: number; totalInvested: number; totalReturned: number; roi: number; history: BetRecord[]; }
export interface ComboSelection { matchId: string; player1: string; player2: string; selection: string; odds: number; confidence: number; reason: string; valueScore?: number; marketType?: string; }
export interface ComboStrategy { type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium' | 'Lotto'; selections: ComboSelection[]; combinedOdds: number; successProbability: number; riskScore: string; expectedRoi?: number; analysis?: string; }
export interface SimulationResult { finalBankroll: number; riskOfRuin: number; volatility: number | string; maxBankroll: number; minBankroll: number; paths?: { x: number; y: number }[][]; }
