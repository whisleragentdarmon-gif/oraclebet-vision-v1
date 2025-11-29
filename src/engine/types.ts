// Fichier : src/engine/types.ts

// --- Types de base ---
// On accepte les majuscules et minuscules pour éviter l'erreur dans ComboGenerator
export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- IA & Apprentissage (LearningModule & CircuitHelper) ---
export interface AIModelWeights {
  surfaceWeight: number;
  formWeight: number;
  h2hWeight: number;
  fatigueFactor: number;
  mentalWeight: number;
  variance: number;
}

export interface LearningExperience {
  matchId: string;
  date: string;
  prediction: string;
  outcome: 'WIN' | 'LOSS' | 'VOID';
  circuit: Circuit;
  adjustments: string; // Description de l'ajustement
}

// --- Joueurs & Attributs ---
export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  stamina?: number;
  speed?: number;
}

// --- Cotes & Bookmakers (OddsEngine) ---
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

// --- Bankroll (BankrollManager) ---
export interface BankrollSimulationMetric {
  finalBankroll: number;
  riskOfRuin: number;
  volatility: number;
  maxBankroll: number;
  minBankroll: number;
  paths: { x: number; y: number }[][];
}

// Alias pour compatibilité
export type SimulationResult = BankrollSimulationMetric; 

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

// --- Prédictions ---
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
  
  // Propriété manquante ajoutée pour ComboGenerator
  totalGamesProjection?: number; 
  
  winProbA?: number;
  winProbB?: number;
  fairOdds?: { p1: number; p2: number };
  attributes?: PlayerAttributes[];
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
}

export interface LiveUpdatePayload {
  matchId: string;
  score: string;
  pointByPoint: string[];
  momentum: number;
}

// --- Combinés (ComboGenerator) ---
export interface ComboSelection {
    player1: string;
    player2: string;
    selection: string;
    odds: number;
    confidence: number;
    reason: string;
}

export interface ComboStrategy {
  type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium';
  selections: ComboSelection[];
  combinedOdds: number;
  successProbability: number;
  riskScore: string;
}

// Alias pour satisfaire ComboGenerator
export type ComboStrategyResult = ComboStrategy;
