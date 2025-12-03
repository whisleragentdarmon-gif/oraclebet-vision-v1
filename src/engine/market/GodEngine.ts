import { GodModeReportV2 } from '../../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation COMPLÈTE (Correction de l'erreur TS2741)
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Dur", date: "Auj.",
        round: "1er Tour", city: "Non trouvé", timezone: "UTC", 
        importanceP1: "Moyenne", importanceP2: "Moyenne", enjeu: "Points"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { 
        // ✅ AJOUT DE 'advantage' QUI MANQUAIT
        global: "0 - 0", surface: "0 - 0", advantage: "Neutre", lastMatches: "-", trend: "Neutre", analysis: "-" 
      },
      conditions: { 
        weather: "-", temp: "-", wind: "-", humidity: "-", 
        courtSpeed: "Moyen", ballType: "Standard", fatigueImpact: "Faible",
        altitude: "-", advantage: "-"
      },
      bookmaker: { 
        oddA: "-", oddB: "-", spread: "-", movement: "Stable", 
        smartMoney: "Non", valueIndex: "0", trapIndex: "Non",
        specialOdds: [] 
      },
      factors: [],
      synthesis: {
        tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-"
      },
      prediction: { 
        winner: "-", score: "-", duration: "-", volatility: "-", confidence: "-", 
        bestBet: "-", avoidBet: "-", altBet: "-",
        probA: "-", probB: "-", probOver: "-", probTieBreak: "-", probUpset: "-", risk: "-", recoWinner: "-", recoOver: "-", recoSet: "-"
      }
    };

    try {
      // 2. Recherches
      const queries = [
        `${p1Name} tennis profile stats`,
        `${p2Name} tennis profile stats`,
        `${p1Name} vs ${p2Name} h2h`,
        `weather ${tournament}`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q }) }).then(r => r.json())
        )
      );

      // Parsing basique
      if (responses[0]?.results?.[0]) report.p1.rank = "Top 100 (Est.)";
      if (responses[3]?.results?.[0]) report.conditions.weather = responses[3].results[0].snippet.substring(0, 50);

    } catch (e) {
      console.error(e);
    }

    return report;
  }
};

function createEmptyProfile() {
    return {
        rank: "-", bestRank: "-", ageHeight: "- / -", nationality: "-",
        hand: "-", style: "-", 
        winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", 
        aces: "-", doubleFaults: "-", firstServe: "-",
        form: "-", confidence: "-", injury: "Non", fatigue: "Faible", 
        lastMatchDate: "-", serveStats: "-", returnStats: "-", motivation: "-", social: "-", last5: "-"
    };
}

function extract(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
