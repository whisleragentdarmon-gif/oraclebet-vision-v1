// Fichier : src/engine/types.ts

// --- Définitions de base ---
export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY';

// --- Structures pour les Joueurs ---
export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  stamina?: number;
  speed?: number;
}

// --- Structures pour les Paris et Bookmakers ---
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

// --- Structures pour la Bankroll ---
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

// --- Structures pour l'IA et les Prédictions ---
export interface LiveUpdatePayload {
  matchId: string;
  score: string;
  pointByPoint: string[];
  momentum: number;
}

// Alias pour satisfaire les vieux fichiers qui cherchent "DetailedPrediction"
// On le fait correspondre à la structure attendue
export interface DetailedPrediction {
  winner: string;
  confidence: number;
  scorePrediction: string;
  totalGames: number;
  riskLevel: RiskLevel;
}

export interface AIPrediction {
  winner: string;
  confidence: number;
  recommendedBet: string;
  riskLevel: RiskLevel;
  marketType: string;
  circuit: string;
  
  winProbA?: number;
  winProbB?: number;
  fairOdds?: { p1: number; p2: number };
  
  attributes?: PlayerAttributes[]; // Utilisation du type correct
  
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

// --- Structures pour Monte Carlo ---
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

// --- Structures pour les Combinés ---
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
