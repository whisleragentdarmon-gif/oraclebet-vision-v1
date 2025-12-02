export type Circuit = 'ATP' | 'WTA' | 'CHALLENGER' | 'ITF';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'RISKY' | 'NO_BET';

// --- STRUCTURE DU DOSSIER COMPLET (GOD FILE) ---
export interface FullMatchDossier {
  // 1. IDENTITÉ MATCH
  identity: {
    p1Name: string;
    p2Name: string;
    tournament: string;
    category: string;
    surface: string;
    format: string;
    localTime: string;
    userTime: string;
  };

  // 2. PROFIL JOUEUR
  profiles: {
    p1: PlayerProfileData;
    p2: PlayerProfileData;
  };

  // 3. HEAD-TO-HEAD
  h2h: {
    global: string;
    surface: string;
    setsWon: string;
    gamesWon: string;
    lastDuelContext: string;
    matchupStyle: string;
  };

  // 4. CONDITIONS EXTERNES
  conditions: {
    weather: string;
    temp: string;
    wind: string;
    humidity: string;
    altitude: string;
    courtSpeed: string;
    indoorOutdoor: string;
    surfaceAdvantage: string;
  };

  // 5. MOMENTUM & FORME
  momentum: {
    p1: MomentumData;
    p2: MomentumData;
  };

  // 6. ANALYSE BOOKMAKER
  bookmakers: {
    p1Odds: string;
    p2Odds: string;
    value: string;
    movement24h: string;
    trapIndicator: string;
    publicVolume: string;
  };

  // 7. PSYCHOLOGIE
  psychology: {
    p1: PsychData;
    p2: PsychData;
  };

  // 8. SYNTHÈSE IA (Facts)
  synthesis: {
    statAdvantage: string;
    mentalAdvantage: string;
    physicalAdvantage: string;
    surfaceAdvantage: string;
    momentumAdvantage: string;
  };
  
  // Sources
  sources: string[];
}

// --- SOUS-STRUCTURES ---
export interface PlayerProfileData {
  rank: string;
  bestRank: string;
  age: string;
  height: string;
  style: string;
  hand: string;
  strength: string;
  weakness: string;
  injury: string;
  formScore: string;
  matches10days: string;
  timeOnCourt7days: string;
  seasonWinRate: string;
  careerWinRate: string;
  surfaceWinRate: string;
  tieBreakWinRate: string;
  vsTop10: string;
  vsTop50: string;
  motivation: string;
  socialSignal: string;
}

export interface MomentumData {
  last5Matches: string;
  results: string;
  fatigue: string;
  pointsToDefend: string;
  motivation: string;
}

export interface PsychData {
  confidence: string;
  serenity: string;
  scandals: string;
  interviews: string;
}

// --- COMPATIBILITÉ EXISTANTE ---
export interface Match { id: string; tournament: string; date: string; time: string; status: string; player1: any; player2: any; score?: string; odds: any; ai?: any; surface: string; validationResult?: any; dossier?: FullMatchDossier; }
// ... (Tu peux garder les autres types MatchOdds, AIPrediction, etc. si nécessaire pour le reste du site, mais le Dossier est roi)
