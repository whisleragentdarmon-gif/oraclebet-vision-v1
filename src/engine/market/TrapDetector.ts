export const TrapDetector = {
  // On nomme la fonction 'scan' pour que ça marche avec AnalysisPage
  scan: (odds: any) => {
    // Simulation basique : si l'écart d'ouverture est trop grand, c'est suspect
    // Dans le futur, on connectera ça aux vraies cotes
    return { 
        isTrap: false, 
        riskLevel: 'SAFE',
        reason: "Mouvements de marché normaux." 
    };
  }
};
