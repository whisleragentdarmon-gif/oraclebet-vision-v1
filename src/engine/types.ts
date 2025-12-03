export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET' | 'High' | 'Low';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced';

// --- STRUCTURE V2 COMPLÈTE ---
export interface PlayerProfileV2 {
  rank: string;
  bestRank: string;
  ageHeight: string; // Combiné
  nationality: string;
  hand: string;
  winrateCareer: string;
  winrateSeason: string;
  winrateSurface: string;
  aces: string;
  doubleFaults: string;
  firstServe: string;
  style: string;
  form: string;
  injury: string;
  motivation: string;
  last5: string;
  // Champs techniques optionnels
  age?: string; height?: string; weight?: string; serveStats?: string; returnStats?: string; injuries?: string; instagram?: string; twitter?: string;
}

export interface GodModeReportV2 {
  identity: {
    p1Name: string; p2Name: string; tournament: string; surface: string; date: string;
    // Champs techniques
    time?: string; level?: string; round?: string; location?: string; dateTime?: string; timezone?: string; importance?: string; p1?: string; p2?: string; category?: string; format?: string; city?: string; enjeu?: string; importanceP1?: string; importanceP2?: string;
  };
  p1: PlayerProfileV2;
  p2: PlayerProfileV2;
  h2h: {
    global: string; surface: string; advantage: string; 
    lastMatches: string; // C'est lui le bon nom
    // Champs techniques
    total?: string; sets?: string; games?: string; analysis?: string; context?: string; styleMatchup?: string; lastMatch?: string; trend?: string;
  };
  conditions: {
    weather: string; temp: string; wind: string; altitude: string;
    // Champs techniques
    humidity?: string; advantage?: string; speed?: string; indoor?: string; courtSpeed?: string; ballType?: string; fatigueImpact?: string;
  };
  bookmaker: {
    oddA: string; oddB: string; movement: string;
    // Champs techniques
    valueIndex?: string; trapIndex?: string; smartMoney?: string; value?: string; trap?: string; volume?: string; spread?: string; p1Odd?: string; p2Odd?: string;
    // ✅ AJOUT POUR GOD ENGINE
    specialOdds?: { market: string; odd: string; analysis: string }[];
  };
  // ✅ AJOUT POUR GOD ENGINE
  factors?: { factor: string; importance: string; impact: string }[];
  
  synthesis: {
    tech: string; mental: string; physical: string; surface: string; momentum: string; xFactor: string; risk: string;
    stat?: string;
  };
  prediction?: {
    // On combine tout ici
    probA: string; probB: string; probOver: string; probTieBreak: string; probUpset: string; risk: string;
    recoWinner: string; recoOver: string; recoSet: string;
    winner?: string; score?: string; duration?: string; volatility?: string; confidence?: string; bestBet?: string; avoidBet?: string; altBet?: string;
  };
}

// ALIAS
export type GodModeReport = GodModeReportV2;
export type FullMatchDossier = GodModeReportV2;
export type H2HFullProfile = GodModeReportV2;
export type WebScrapedData = any;

// --- TYPES MOTEURS (Ne pas toucher) ---
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
export interface GodModeAnalysis { social: any; geo: any; trap: any; motivation?: any; injuryAlert?: boolean; injuryDetails?: string; reportV2?: GodModeReportV2; webStats?: any[]; realProb?: { p1Prob: number; p2Prob: number }; globalConfidence?: number; noBetReason?: string; h2hProfile?: any; }
export interface AIPrediction { winner: string; confidence: number; recommendedBet: string; riskLevel: RiskLevel; marketType: string; circuit: string; totalGamesProjection?: number; winProbA?: number; winProbB?: number; fairOdds?: { p1: number; p2: number }; attributes?: PlayerAttributes[]; monteCarlo?: { setDistribution: { [key: string]: number } }; expectedSets?: string; tieBreakProbability?: number; breaks?: { p1: number; p2: number }; trap?: { isTrap: boolean; verdict?: string; reason?: string }; integrity?: { isSuspicious: boolean; score: number; reason?: string }; qualitativeAnalysis?: string; structuralAnalysis?: string; quantitativeAnalysis?: string; oddsAnalysis?: OddsAnalysis; godModeAnalysis?: GodModeAnalysis; }
export interface LiveUpdatePayload { matchId: string; score: string; pointByPoint: string[]; momentum: number; }
export interface ComboSelection { matchId: string; player1: string; player2: string; selection: string; odds: number; confidence: number; reason: string; valueScore?: number; marketType?: string; }
export interface ComboStrategy { type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium' | 'Lotto'; selections: ComboSelection[]; combinedOdds: number; successProbability: number; riskScore: string; expectedRoi?: number; analysis?: string; }
export type ComboStrategyResult = ComboStrategy;
export interface GeoCondition { altitude: number | string; humidity: number | string; windSpeed?: number; wind?: number; courtSpeedIndex?: number; ballType?: string; isIndoor?: boolean; weather: string; }
export interface PressAnalysis { sentimentScore: number; scandalAlert: boolean; mentalPressureIndex: number; recentQuotes: any[]; rumors: string[]; }
export interface SocialSentiment { twitterHype: number; redditMood: string; instagramActivity: string; publicBettingTrend: number; }
