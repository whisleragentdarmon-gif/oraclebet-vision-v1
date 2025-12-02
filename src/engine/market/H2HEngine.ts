import { H2HFullProfile, HumanFactors } from '../../types';

export const H2HEngine = {
  // ✅ ON A REMIS LE BON NOM ICI : fetchFullProfile
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    const defaultHuman: HumanFactors = {
        mental: { state: "Stable", motivation: "Moyenne", pressSentiment: "Neutre", scandals: [] },
        physical: { fatigue: "Normale", injuryStatus: "Fit", trainingObservation: "R.A.S" },
        lifestyle: { recentActivity: "Focus", travelStress: "Faible" },
        social: { redditMood: "Neutre", twitterHype: "Moyenne", fanRumors: [] }
    };

    const profile: H2HFullProfile = {
      p1: { name: p1, age: "25", height: "1.85m", rank: "Top 100", hand: "Droitier", style: "Complet", nationality: "" },
      p2: { name: p2, age: "25", height: "1.85m", rank: "Top 100", hand: "Droitier", style: "Complet", nationality: "" },
      human: { p1: JSON.parse(JSON.stringify(defaultHuman)), p2: JSON.parse(JSON.stringify(defaultHuman)) },
      h2hMatches: [],
      stats: { p1: { serveRating: "7/10", returnRating: "6/10", breakPointsSaved: "55%" }, p2: { serveRating: "7/10", returnRating: "6/10", breakPointsSaved: "55%" } },
      context: { weather: "Analyse...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };

    try {
        // Simulation des recherches pour l'instant pour valider le build
        // Le vrai code de scraping ira ici quand le build sera vert
    } catch (e) { console.error(e); }

    return profile;
  }
};
