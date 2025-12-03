// Fichier : src/engine/types.ts

// --- 1. Types de base ---
export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
// Correction ComboGenerator : on accepte toutes les casses pour éviter l'erreur de comparaison
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET' | 'High' | 'Low';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- 2. IA & Apprentissage ---
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

// --- 3. Joueurs & Attributs ---
export interface PlayerAttributes {
  power: number;
  serve: number;
  return: number;
  mental: number;
  form: number;
  stamina?: number;
  speed?: number;
}

// --- 4. Cotes & Bookmakers ---
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

// --- 5. Bankroll ---
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

// --- 6. TYPES MANQUANTS (CORRECTIONS) ---

// Manquait pour GeoEngine et ScandalEngine
export interface GeoCondition {
  altitude: number | string;
  humidity: number | string;
  windSpeed?: number;
  wind?: number; // Alias
  courtSpeedIndex?: number;
  ballType?: string;
  isIndoor?: boolean;
  weather: string; // Obligatoire
}

export interface PressAnalysis {
  sentimentScore: number;
  scandalAlert: boolean;
  mentalPressureIndex: number;
  recentQuotes: any[];
  rumors: string[];
}

export interface SocialSentiment {
  twitterHype: number;
  redditMood: string;
  instagramActivity: string;
  publicBettingTrend: number;
}

// --- 7. H2H OLD VERSION (Pour DetailedH2H.tsx & H2HEngine.ts) ---
// C'est cette structure précise que tes erreurs réclament
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
  human?: {
      note: string;
      confidenceModifier: number;
      manualWinner?: string;
  };
}

// --- 8. GOD MODE V2 (Nouvelle Version) ---
export interface PlayerProfileV2 {
  rank: string; bestRank: string; age: string; height: string; weight: string; nationality: string;
  style: string; hand: string; winrateCareer: string; winrateSeason: string; winrateSurface: string;
  aces: string; doubleFaults: string; serveStats: string; returnStats: string;
  form: string; injuries: string; instagram: string; twitter: string;
  motivation: string; fatigue: string; last5: string;
}

export interface GodModeReportV2 {
  identity: {
    p1Name: string; p2Name: string; tournament: string; level: string; round: string; surface: string;
    location: string; dateTime: string; timezone: string; importance: string;
    // Champs optionnels pour compatibilité
    p1?: string; p2?: string; category?: string; format?: string; time?: string;
  };
  p1: PlayerProfileV2;
  p2: PlayerProfileV2;
  h2h: {
    total: string; surface: string; sets: string; games: string; lastMatches: string; analysis: string;
    // Champs optionnels compatibilité V1
    global?: string; advantage?: string; context?: string; styleMatchup?: string;
  };
  conditions: {
    weather: string; temp: string; wind: string; humidity: string; altitude: string; advantage: string;
    // Champs optionnels
    speed?: string; indoor?: string;
  };
  bookmaker: {
    oddA: string; oddB: string; movement: string; valueIndex: string; trapIndex: string; smartMoney: string;
    // Champs optionnels
    value?: string; trap?: string; volume?: string;
  };
  synthesis: {
    tech: string; mental: string; physical: string; surface: string; momentum: string; xFactor: string; risk: string;
    // Champs optionnels
    stat?: string;
  };
  // Ajout optionnel pour la prédiction
  prediction?: {
    probA: string; probB: string; probOver: string; probTieBreak: string; probUpset: string; risk: string;
    recoWinner: string; recoOver: string; recoSet: string;
  };
}

// Alias pour compatibilité
export type GodModeReport = GodModeReportV2;
export type FullMatchDossier = GodModeReportV2;
export type WebScrapedData = any; // Pour MonteCarlo

// --- 9. STRUCTURE GLOBALE D'ANALYSE ---
export interface MomentumData {
  last5: string;
  results: string;
  fatigue: string;
  pointsToDefend: string;
  motivation: string;
}

export interface GodModeAnalysis {
    social: any;
    geo: any;
    trap: any;
    motivation?: any;
    injuryAlert?: boolean;
    injuryDetails?: string;
    // On autorise les deux formats pour éviter les conflits
    reportV2?: GodModeReportV2; 
    h2hProfile?: H2HFullProfile; 
    webStats?: any[];
    realProb?: { p1Prob: number; p2Prob: number };
    globalConfidence?: number;
    noBetReason?: string;
}

// --- 10. Prédictions ---
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

export interface LiveUpdatePayload { matchId: string; score: string; pointByPoint: string[]; momentum: number; }

// --- 11. Combinés ---
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
