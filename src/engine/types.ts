// Fichier : src/engine/types.ts

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

// --- DEEP DATA : PARAMÈTRES AVANCÉS ---
export interface AdvancedStats {
  timeOnCourt: number; // Heures jouées cette semaine (Fatigue)
  breakPointConversion: number; // % de balles de break converties (Mental)
  breakPointsSaved: number; // % de balles de break sauvées (Mental sous pression)
  firstServeSpeedAvg: number; // Vitesse moyenne 1ère balle (km/h)
  unforcedErrorsPerSet: number; // Précision
}

export interface MatchConditions {
  courtSpeed: number; // 1 (Lent) à 100 (Rapide) -> Très important pour l'IA
  weather: 'Sunny' | 'Cloudy' | 'Windy' | 'Indoor'; // Le vent tue les serveurs
  temperature: number; // La chaleur accélère la balle
  ballType?: string; // Wilson, Dunlop... (Détail pro)
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

// --- Cotes & Mouvements (DETECTION TRUCAGE) ---
export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';

export interface BookmakerOdds {
  name: BookmakerName;
  p1: number;
  p2: number;
  payout: number;
  openingOdds: { p1: number, p2: number }; // Cote à l'ouverture (pour voir la chute)
  movement: 'UP' | 'DOWN' | 'STABLE' | 'CRASH'; // CRASH = Suspect
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
