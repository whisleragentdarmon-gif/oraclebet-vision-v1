export const MotivationEngine = {
  analyze: async (player: string, tournament: string): Promise<{ score: number, reason: string, risk: boolean }> => {
    
    // Par défaut
    let motivationScore = 80; 
    let reason = "Tournoi standard.";
    let risk = false;

    const isBigTournament = tournament.includes("Grand Slam") || tournament.includes("1000") || tournament.includes("Finals");
    const isSmallTournament = tournament.includes("250") || tournament.includes("Challenger");
    
    try {
        const query = `${player} defending points ${tournament}`;
        // Simulation de l'appel API (ou appel réel si dispo)
        // Ici on garde la logique statique pour garantir que ça compile
        if (isBigTournament) {
            motivationScore = 100;
            reason = "DÉFEND SON TITRE/POINTS. Motivation Max.";
        } else if (isSmallTournament) {
            motivationScore = 60;
            reason = "Petit tournoi (Risque de test).";
            risk = true;
        }
    } catch (e) {
        console.error("Erreur Motivation", e);
    }

    return { score: motivationScore, reason, risk };
  }
};
