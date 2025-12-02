export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'Safe' | 'Moderate' | 'Risky' | 'NO_BET';
export type PlayerStyle = 'Aggressive' | 'Defensive' | 'ServeVolley' | 'Balanced' | 'Big Server' | 'Grinder';

// --- 1. NOUVEAU : LE DOSSIER GÉANT (God Mode V2) ---
export interface FullMatchDossier {
  identity: { p1Name: string; p2Name: string; tournament: string; category: string; surface: string; format: string; localTime: string; userTime: string; };
  profiles: { p1: PlayerProfileData; p2: PlayerProfileData; };
  h2h: { global: string; surface: string; setsWon: string; gamesWon: string; lastDuelContext: string; matchupStyle: string; };
  conditions: { weather: string; temp: string; wind: string; humidity: string; altitude: string; courtSpeed: string; indoorOutdoor: string; surfaceAdvantage: string; };
  momentum: { p1: MomentumData; p2: MomentumData; };
  bookmakers: { p1Odds: string; p2Odds: string; value: string; movement24h: string; trapIndicator: string; publicVolume: string; };
  psychology: { p1: PsychData; p2: PsychData; };
  synthesis: { statAdvantage: string; mentalAdvantage: string; physicalAdvantage: string; surfaceAdvantage: string; momentumAdvantage: string; };
  sources: string[];
}

export interface PlayerProfileData { rank: string; bestRank: string; age: string; height: string; style: string; hand: string; strength: string; weakness: string; injury: string; formScore: string; matches10days: string; timeOnCourt7days: string; seasonWinRate: string; careerWinRate: string; surfaceWinRate: string; tieBreakWinRate: string; vsTop10: string; vsTop50: string; motivation: string; socialSignal: string; }
export interface MomentumData { last5Matches: string; results: string; fatigue: string; pointsToDefend: string; motivation: string; }
export interface PsychData { confidence: string; serenity: string; scandals: string; interviews: string; }

// --- 2. ANCIENNES STRUCTURES (Pour compatibilité Moteurs) ---
export interface HumanFactors { mental: { state: string; motivation: string; pressSentiment: string; scandals: string[]; }; physical: { fatigue: string; injuryStatus: string; trainingObservation: string; }; lifestyle: { recentActivity: string; travelStress: string; }; social: { redditMood: string; twitterHype: string; fanRumors: string[]; }; }
export interface GeoCondition { altitude: number; humidity: number; windSpeed: number; courtSpeedIndex: number; ballType: string; isIndoor: boolean; }
export interface PressAnalysis { sentimentScore: number; scandalAlert: boolean; mentalPressureIndex: number; recentQuotes: any[]; rumors: string[]; }
export interface SocialSentiment { twitterHype: number; redditMood: string; instagramActivity: string; publicBettingTrend: number; }
export interface WebScrapedData { playerProfile: { p1: { style: string; strengths: string; weaknesses: string; mental: string }; p2: { style: string; strengths: string; weaknesses: string; mental: string }; }; h2hReal: { totalMatches: number; p1Wins: number; p2Wins: number; lastMeeting: string; surfaceFavorite: string; }; surfaceStats: { p1WinRate: number; p2WinRate: number; trend: string; }; context: { weather: string; fatigueP1: string; fatigueP2: string; scandal: string | null; }; social: { sentimentP1: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; sentimentP2: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; }; }

// --- 3. STRUCTURES H2H VISUELLES ---
export interface H2HFullProfile {
  p1: { name: string; age: string; height: string; rank: string; hand: string; style: string; nationality: string; };
  p2: { name: string; age: string; height: string; rank: string; hand: string; style: string; nationality: string; };
  human: { p1: HumanFactors; p2: HumanFactors; };
  h2hMatches: { date: string; winner: string; score: string; surface: string }[];
  surfaceStats: { clay: { p1: string, p2: string }; hard: { p1: string, p2: string }; grass: { p1: string, p2: string }; };
  stats: { p1: { serveRating: string; returnRating: string; breakPointsSaved: string }; p2: { serveRating: string; returnRating: string; breakPointsSaved: string }; };
  context: { weather: string; conditions: string; tournamentLevel: string; };
  sources: string[];
}

// --- 4. BANKROLL & COMBOS (Les erreurs TS2305 venaient d'ici) ---
export interface AIModelWeights { surfaceWeight: number; formWeight: number; h2hWeight: number; fatigueFactor: number; mentalWeight: number; variance: number; momentumWeight?: number; serveDominance?: number; }
export interface LearningExperience { matchId: string; date: string; timestamp?: number; prediction: string; outcome: 'WIN' | 'LOSS' | 'VOID'; circuit: Circuit; adjustments: string; result?: string; weightsUsed?: any; }
export interface PastMatch { date: string; tournament: string; surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor'; opponent: string; score: string; result: 'W' | 'L'; }
export interface PlayerAttributes { power: number; serve: number; return: number; mental: number; form: number; stamina?: number; speed?: number; }
export interface Player { name: string; rank: number; country: string; form: number; surfacePrefs: { hard: number; clay: number; grass: number }; lastMatches?: PastMatch[]; }
export type BookmakerName = 'Winamax' | 'Betclic' | 'Unibet' | 'Pinnacle' | 'Bwin';
export interface BookmakerOdds { name: BookmakerName; p1: number; p2: number; payout: number; openingOdds?: { p1: number, p2: number }; movement: 'UP' | 'DOWN' | 'STABLE' | 'CRASH'; isTrap: boolean; isValue: boolean; }
export interface ArbitrageResult { isSurebet: boolean; profit: number; bookmakerP1: string; bookmakerP2: string; msg: string; }
export interface OddsAnalysis { bestOdds: { p1: number; p2: number; bookieP1: string; bookieP2: string }; marketAverage: { p1: number; p2: number }; recommendedBookie: string; kelly: { percentage: number; advice: string }; arbitrage: ArbitrageResult; bookmakers: BookmakerOdds[]; }
export interface BankrollSimulationMetric { finalBankroll: number; riskOfRuin: number; volatility: number | string; maxBankroll: number; minBankroll: number; paths?: { x: number; y: number }[][]; }
export type SimulationResult = BankrollSimulationMetric; 
export interface BetRecord { id: string; matchId: string; matchTitle: string; selection: string; odds: number; stake: number; status: 'PENDING' | 'WON' | 'LOST' | 'VOID'; profit: number; date: string; confidenceAtTime: number; }
export interface BankrollState { currentBalance: number; startBalance: number; totalBets: number; wins: number; losses: number; totalInvested: number; totalReturned: number; roi: number; history: BetRecord[]; }
export interface ComboSelection { matchId: string; player1: string; player2: string; selection: string; odds: number; confidence: number; reason: string; valueScore?: number; marketType?: string; }
export interface ComboStrategy { type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium' | 'Lotto'; selections: ComboSelection[]; combinedOdds: number; successProbability: number; riskScore: string; expectedRoi?: number; analysis?: string; }
export type ComboStrategyResult = ComboStrategy;

// --- 5. STRUCTURE MATCH PRINCIPALE ---
export interface AIPrediction { winner: string; confidence: number; recommendedBet: string; riskLevel: RiskLevel; marketType: string; circuit: string; totalGamesProjection?: number; winProbA?: number; winProbB?: number; fairOdds?: { p1: number; p2: number }; attributes?: PlayerAttributes[]; monteCarlo?: { setDistribution: { [key: string]: number } }; expectedSets?: string; tieBreakProbability?: number; breaks?: { p1: number; p2: number }; trap?: { isTrap: boolean; verdict?: string; reason?: string }; integrity?: { isSuspicious: boolean; score: number; reason?: string }; qualitativeAnalysis?: string; structuralAnalysis?: string; quantitativeAnalysis?: string; oddsAnalysis?: OddsAnalysis; godModeAnalysis?: { social: any; geo: any; trap: any; injuryAlert: boolean; injuryDetails?: string; h2hProfile?: H2HFullProfile; realProb?: { p1Prob: number, p2Prob: number }; motivation?: any; }; }
export interface MatchOdds { player1: number; player2: number; p1: number; p2: number; }
export interface Match { id: string; tournament: string; date: string; time: string; status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING'; player1: Player; player2: Player; score?: string; odds: MatchOdds; ai?: AIPrediction; surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor'; validationResult?: 'CORRECT' | 'WRONG' | 'PENDING'; dossier?: FullMatchDossier; }
export type MatchStatus = Match['status'];
