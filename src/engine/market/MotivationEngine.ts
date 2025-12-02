export const MotivationEngine = {
  analyze: async (player: string, tournament: string): Promise<{ score: number, reason: string, risk: boolean }> => {
    
    let motivationScore = 80; 
    let reason = "Contexte standard.";
    let risk = false;

    // Détection basique
    const t = tournament ? tournament.toLowerCase() : "";
    const isGrandSlam = t.includes("grand slam") || t.includes("open") || t.includes("wimbledon") || t.includes("roland");
    const isSmallTournament = t.includes("250") || t.includes("challenger") || t.includes("itf");

    if (isGrandSlam) {
        motivationScore = 100;
        reason = "Tournoi Majeur : Motivation Max.";
    } else if (isSmallTournament) {
        motivationScore = 65;
        reason = "Petit tournoi : Risque de baisse d'intensité.";
        risk = true;
    }

    return { score: motivationScore, reason, risk };
  }
};
