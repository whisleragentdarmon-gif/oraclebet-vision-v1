// Fichier : src/engine/types.ts

// --- Types de base ---
export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- IA & Apprentissage ---
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

// --- Joueurs ---
export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  stamina?: number;
  speed?: number;
}

// --- Cotes ---
export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';
export interface BookmakerOdds {
  name: BookmakerName;
  p1: number;
  p2: number;
  payout: number;
  movement: 'UP' | 'DOWN' | 'STABLE' | 'CRASH';
  openingOdds?: { p1: number, p2: number };
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

// --- Bankroll ---
export interface BankrollSimulationMetric {
  finalBankroll: number;
  riskOfRuin: number;
  volatility: number | string;
  maxBankroll: number;
  minBankroll: number;
  paths?: { x: number; y: number }[][];
}
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

// --- H2H & GOD MODE (CORRIGÉ) ---

// Ajout pour MonteCarlo
export type WebScrapedData = GodModeAnalysis; 

export interface H2HFullProfile {
  p1: {
    age: string; height: string; rank: string; plays: string; style: string; nationality: string;
  };
  p2: {
    age: string; height: string; rank: string; plays: string; style: string; nationality: string;
  };
  h2hMatches: { date: string; winner: string; score: string; surface: string }[];
  surfaceStats: {
    clay: { p1: string, p2: string };
    hard: { p1: string, p2: string };
    grass: { p1: string, p2: string };
  };
  context: {
    weather: string; altitude: string; motivation: string;
  };
  sources: string[];
  
  // ✅ AJOUT POUR CORRIGER DetailedH2H : Zone de notes manuelles
  human?: {
      note: string;
      confidenceModifier: number;
      manualWinner?: string;
  };
}

export interface GodModeReport {
    // ... (Structure compatible pour l'affichage)
    identity: any;
    playerA: any;
    playerB: any;
    h2h: any;
    conditions: any;
    momentum: any;
    bookmaker: any;
    psychology: any;
    synthesis: any;
    prediction: any;
}

export interface GodModeAnalysis {
    social: { sentimentScore: number; scandalAlert: boolean; mentalPressure: number; socialTrend: string };
    geo: { altitude: number; humidity: number; wind: number; speed: string; type: string };
    trap: { isTrap: boolean; riskLevel: string; reason: string };
    motivation?: { score: number; reason: string; risk: boolean };
    injuryAlert?: boolean;
    injuryDetails?: string;
    h2hProfile?: H2HFullProfile;
    webStats?: any[];
    realProb?: { p1Prob: number; p2Prob: number };
    globalConfidence?: number;
    noBetReason?: string;
}

// --- Prédictions ---
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
  godModeAnalysis?: GodModeAnalysis;
}

// --- Combinés ---
export interface ComboSelection {
    matchId: string;
    player1: string;
    player2: string;
    selection: string;
    odds: number;
    confidence: number;
    reason: string;
    valueScore?: number;
    marketType?: string;
}

export interface ComboStrategy {
  type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium' | 'Lotto';
  selections: ComboSelection[];
  combinedOdds: number;
  successProbability: number;
  riskScore: string;
  expectedRoi?: number;
  analysis?: string;
}

export type ComboStrategyResult = ComboStrategy;
