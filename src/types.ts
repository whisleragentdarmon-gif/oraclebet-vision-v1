import { 
  OddsAnalysis, 
  AIPrediction, 
  PlayerAttributes, 
  Circuit, 
  H2HFullProfile, 
  HumanFactors,
  WebScrapedData,
  ComboStrategy,
  ComboSelection,
  FullMatchDossier,
  PlayerProfileData,
  MomentumData,
  PsychData,
  BetRecord,          // ✅ Manquait
  BankrollState,      // ✅ Manquait
  GeoCondition,       // ✅ Manquait
  PressAnalysis,      // ✅ Manquait
  SocialSentiment,    // ✅ Manquait
  BookmakerOdds,      // ✅ Manquait
  ArbitrageResult     // ✅ Manquait
} from './engine/types';

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

export interface MatchOdds {
  player1: number;
  player2: number;
  p1: number;
  p2: number;
}

// ON RÉ-EXPORTE TOUT LE MONDE
export type { 
  AIPrediction, 
  OddsAnalysis, 
  PlayerAttributes, 
  Circuit, 
  H2HFullProfile, 
  HumanFactors,
  WebScrapedData,
  ComboStrategy,
  ComboSelection,
  FullMatchDossier,
  PlayerProfileData,
  MomentumData,
  PsychData,
  BetRecord,
  BankrollState,
  GeoCondition,
  PressAnalysis,
  SocialSentiment,
  BookmakerOdds,
  ArbitrageResult
};

export interface Match {
  id: string;
  tournament: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'TODAY' | 'UPCOMING';
  player1: Player;
  player2: Player;
  score?: string;
  odds: MatchOdds;
  ai?: AIPrediction;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  validationResult?: 'CORRECT' | 'WRONG' | 'PENDING';
  dossier?: FullMatchDossier;
}

export type MatchStatus = Match['status'];
