// Fichier : src/engine/types.ts

// --- Types de base ---
export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky';
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

// --- Cotes & Bookmakers ---
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
  type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium';
  selections: ComboSelection[];
  combinedOdds: number;
  successProbability: number;
  riskScore: string;
  expectedRoi?: number;
  analysis?: string;
}

export type ComboStrategyResult = ComboStrategy;
// --- EXTENSION GOD MODE (DATA MARKET) ---

// 1. Module Presse & Scandales
export interface PressAnalysis {
  sentimentScore: number; // -100 (Haine) à +100 (Adoration)
  scandalAlert: boolean;
  mentalPressureIndex: number; // 0-100
  recentQuotes: { source: string; text: string; sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }[];
  rumors: string[]; // ex: "Rumeur de blessure épaule"
}

// 2. Module Social Media
export interface SocialSentiment {
  twitterHype: number; // Volume de discussion
  redditMood: 'BULLISH' | 'BEARISH' | 'TOXIC';
  instagramActivity: string; // "Normal", "Absent", "Party Mode"
  publicBettingTrend: number; // % des parieurs sur ce joueur
}

// 3. Module Fatigue & Voyage
export interface FatigueData {
  travelDistance: number; // km parcourus cette semaine
  timeZoneChange: number; // Heures de décalage
  hoursOnCourt: number; // Cumul 7 jours
  physioCalls: number; // Appels kiné derniers matchs
  fatigueScore: number; // 0 (Frais) - 100 (Épuisé)
}

// 4. Module Météo & Conditions (Geo)
export interface GeoCondition {
  altitude: number; // Mètres (impacte vitesse balle)
  humidity: number; // %
  windSpeed: number; // km/h
  courtSpeedIndex: number; // 1-100 (Calculé via météo + surface)
  ballType: string; // "Wilson US Open", "Dunlop Fort"...
  isIndoor: boolean;
}

// 5. Profilage Stylistique
export type PlayerArchetype = 'BIG_SERVER' | 'DEFENSIVE_GRINDER' | 'AGGRESSIVE_BASELINER' | 'ALL_ROUNDER' | 'SERVE_VOLLEY';

export interface StyleMatchup {
  p1Style: PlayerArchetype;
  p2Style: PlayerArchetype;
  compatibilityNote: string; // ex: "Le serveur est désavantagé par le retourneur sur terre battue"
  tacticalAdvantage: 'P1' | 'P2' | 'NEUTRAL';
}

// --- MISE À JOUR DU MATCH (Extension) ---
// On ajoute ces champs optionnels à AIPrediction dans src/engine/types.ts
// (Tu n'as pas besoin de remplacer tout le fichier, juste d'ajouter ces champs à l'interface AIPrediction existante)
/*
export interface AIPrediction {
  // ... tes champs existants ...
  
  // Nouveaux champs GOD MODE :
  godModeAnalysis?: {
    press?: PressAnalysis;
    social?: SocialSentiment;
    fatigue?: { p1: FatigueData, p2: FatigueData };
    conditions?: GeoCondition;
    style?: StyleMatchup;
    globalConfidence: number; // Score final pondéré
    noBetReason?: string; // Si Trap Detector activé
  };
}
*/
