// Fichier : src/engine/types.ts

export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- NOUVELLE STRUCTURE V2 STRICTE ---

export interface GodModeReportV2 {
  identity: {
    p1Name: string; p2Name: string; tournament: string; level: string; round: string; surface: string;
    location: string; dateTime: string; timezone: string; importance: string;
  };
  p1: PlayerProfileV2;
  p2: PlayerProfileV2;
  h2h: {
    total: string; surface: string; sets: string; games: string; lastMatches: string; analysis: string;
  };
  conditions: {
    weather: string; temp: string; wind: string; humidity: string; altitude: string; advantage: string;
  };
  bookmaker: {
    oddA: string; oddB: string; movement: string; valueIndex: string; trapIndex: string; smartMoney: string;
  };
  synthesis: {
    tech: string; mental: string; physical: string; surface: string; momentum: string; xFactor: string; risk: string;
  };
}

export interface PlayerProfileV2 {
  rank: string; bestRank: string; age: string; height: string; weight: string; nationality: string;
  style: string; hand: string; winrateCareer: string; winrateSeason: string; winrateSurface: string;
  aces: string; doubleFaults: string; serveStats: string; returnStats: string;
  form: string; injuries: string; instagram: string; twitter: string;
  motivation: string; fatigue: string; last5: string;
}

// --- TYPES EXISTANTS (Pour compatibilité) ---
export interface AIModelWeights { surfaceWeight: number; formWeight: number; h2hWeight: number; fatigueFactor: number; mentalWeight: number; variance: number; momentumWeight?: number; serveDominance?: number; }
export interface LearningExperience { matchId: string; date: string; timestamp?: number; prediction: string; outcome: 'WIN' | 'LOSS' | 'VOID'; circuit: Circuit; adjustments: string; result?: string; weightsUsed?: any; }
export interface PlayerAttributes { power: number; serve: number; return: number; mental: number; form: number; stamina?: number; speed?: number; }
export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';
export interface BookmakerOdds { name: BookmakerName; p1: number; p2: number; payout: number; movement: 'UP' | 'DOWN' | 'STABLE' | 'CRASH'; openingOdds?: { p1: number, p2: number }; isTrap: boolean; isValue: boolean; }
export interface ArbitrageResult { isSurebet: boolean; profit: number; bookmakerP1: string; bookmakerP2: string; msg: string; }
export interface OddsAnalysis { bestOdds: { p1: number; p2: number; bookieP1: string; bookieP2: string }; marketAverage: { p1: number; p2: number }; recommendedBookie: string; kelly: { percentage: number; advice: string }; arbitrage: ArbitrageResult; bookmakers: BookmakerOdds[]; }
export interface BankrollSimulationMetric { finalBankroll: number; riskOfRuin: number; volatility: number | string; maxBankroll: number; minBankroll: number; paths?: { x: number; y: number }[][]; }
export type SimulationResult = BankrollSimulationMetric; 
export interface BetRecord { id: string; matchId: string; matchTitle: string; selection: string; odds: number; stake: number; status: 'PENDING' | 'WON' | 'LOST' | 'VOID'; profit: number; date: string; confidenceAtTime: number; }
export interface BankrollState { currentBalance: number; startBalance: number; totalBets: number; wins: number; losses: number; totalInvested: number; totalReturned: number; roi: number; history: BetRecord[]; }
export interface GodModeAnalysis { social: any; geo: any; trap: any; motivation?: any; injuryAlert?: boolean; injuryDetails?: string; reportV2?: GodModeReportV2; webStats?: any[]; realProb?: { p1Prob: number; p2Prob: number }; globalConfidence?: number; noBetReason?: string; }
export interface AIPrediction { winner: string; confidence: number; recommendedBet: string; riskLevel: RiskLevel; marketType: string; circuit: string; totalGamesProjection?: number; winProbA?: number; winProbB?: number; fairOdds?: { p1: number; p2: number }; attributes?: PlayerAttributes[]; monteCarlo?: { setDistribution: { [key: string]: number } }; expectedSets?: string; tieBreakProbability?: number; breaks?: { p1: number; p2: number }; trap?: { isTrap: boolean; verdict?: string; reason?: string }; integrity?: { isSuspicious: boolean; score: number; reason?: string }; qualitativeAnalysis?: string; structuralAnalysis?: string; quantitativeAnalysis?: string; oddsAnalysis?: OddsAnalysis; godModeAnalysis?: GodModeAnalysis; }
export interface LiveUpdatePayload { matchId: string; score: string; pointByPoint: string[]; momentum: number; }
export interface ComboSelection { matchId: string; player1: string; player2: string; selection: string; odds: number; confidence: number; reason: string; valueScore?: number; marketType?: string; }
export interface ComboStrategy { type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium' | 'Lotto'; selections: ComboSelection[]; combinedOdds: number; successProbability: number; riskScore: string; expectedRoi?: number; analysis?: string; }
export type ComboStrategyResult = ComboStrategy;
export type FullMatchDossier = GodModeReportV2; // Alias pour compatibilité
