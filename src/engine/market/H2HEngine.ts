import { H2HFullProfile, FullMatchDossier, HumanFactors, PlayerProfileData, MomentumData, PsychData } from '../../types';

export const H2HEngine = {
  // 1. NOUVELLE FONCTION (Pour le Dossier Géant)
  buildDossier: async (p1: string, p2: string): Promise<FullMatchDossier> => {
    // ... (Logique de création du dossier complet, je mets une version simplifiée qui compile)
    const emptyProfile: PlayerProfileData = { rank: "Non trouvé", bestRank: "Non trouvé", age: "Non trouvé", height: "Non trouvé", style: "Non trouvé", hand: "Non trouvé", strength: "Non trouvé", weakness: "Non trouvé", injury: "Non trouvé", formScore: "Non trouvé", matches10days: "Non trouvé", timeOnCourt7days: "Non trouvé", seasonWinRate: "Non trouvé", careerWinRate: "Non trouvé", surfaceWinRate: "Non trouvé", tieBreakWinRate: "Non trouvé", vsTop10: "Non trouvé", vsTop50: "Non trouvé", motivation: "Non trouvé", socialSignal: "Non trouvé" };
    const emptyMomentum: MomentumData = { last5Matches: "Non trouvé", results: "Non trouvé", fatigue: "Non trouvé", pointsToDefend: "Non trouvé", motivation: "Non trouvé" };
    const emptyPsych: PsychData = { confidence: "Non trouvé", serenity: "Non trouvé", scandals: "Non trouvé", interviews: "Non trouvé" };

    return {
      identity: { p1Name: p1, p2Name: p2, tournament: "Recherche...", category: "Recherche...", surface: "Recherche...", format: "Bo3", localTime: "Recherche...", userTime: "Recherche..." },
      profiles: { p1: { ...emptyProfile }, p2: { ...emptyProfile } },
      h2h: { global: "Non trouvé", surface: "Non trouvé", setsWon: "Non trouvé", gamesWon: "Non trouvé", lastDuelContext: "Non trouvé", matchupStyle: "Non trouvé" },
      conditions: { weather: "Non trouvé", temp: "Non trouvé", wind: "Non trouvé", humidity: "Non trouvé", altitude: "Non trouvé", courtSpeed: "Non trouvé", indoorOutdoor: "Non trouvé", surfaceAdvantage: "Non trouvé" },
      momentum: { p1: { ...emptyMomentum }, p2: { ...emptyMomentum } },
      bookmakers: { p1Odds: "Non trouvé", p2Odds: "Non trouvé", value: "Calcul...", movement24h: "Non trouvé", trapIndicator: "Non trouvé", publicVolume: "Non trouvé" },
      psychology: { p1: { ...emptyPsych }, p2: { ...emptyPsych } },
      synthesis: { statAdvantage: "Analyse...", mentalAdvantage: "Analyse...", physicalAdvantage: "Analyse...", surfaceAdvantage: "Analyse...", momentumAdvantage: "Analyse..." },
      sources: []
    };
  },

  // 2. ANCIENNE FONCTION (Pour compatibilité AnalysisPage existante)
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    const defaultHuman: HumanFactors = {
        mental: { state: "Stable", motivation: "Standard", pressSentiment: "Neutre", scandals: [] },
        physical: { fatigue: "Normale", injuryStatus: "Apte", trainingObservation: "R.A.S" },
        lifestyle: { recentActivity: "Focus", travelStress: "Faible" },
        social: { redditMood: "Neutre", twitterHype: "Moyenne", fanRumors: [] }
    };

    return {
      p1: { name: p1, age: "25", height: "1.85m", rank: "100", hand: "Droitier", style: "Complet", nationality: "" },
      p2: { name: p2, age: "25", height: "1.85m", rank: "100", hand: "Droitier", style: "Complet", nationality: "" },
      human: { p1: JSON.parse(JSON.stringify(defaultHuman)), p2: JSON.parse(JSON.stringify(defaultHuman)) },
      h2hMatches: [],
      surfaceStats: { clay: {p1:"-", p2:"-"}, hard: {p1:"-", p2:"-"}, grass: {p1:"-", p2:"-"} },
      stats: { p1: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" }, p2: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" } },
      context: { weather: "Analyse...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };
  }
};
