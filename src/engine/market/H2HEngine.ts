import { GodModeReportV2 } from '../../types';

export const H2HEngine = {
  fetchFullProfile: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation STRICTE selon le type GodModeReportV2 / PlayerProfileV3
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Non trouvé", date: "Aujourd'hui",
        round: "1er Tour", city: "Non trouvé", timezone: "UTC", 
        importanceP1: "Moyenne", importanceP2: "Moyenne", enjeu: "Points classement"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { 
        global: "0 - 0", surface: "0 - 0", lastMatch: "-", trend: "Neutre", analysis: "-" 
      },
      conditions: { 
        weather: "-", temp: "-", wind: "-", humidity: "-", 
        courtSpeed: "Moyen", ballType: "Standard", fatigueImpact: "Faible" 
      },
      bookmaker: { 
        p1Odd: "-", p2Odd: "-", spread: "-", movement: "Stable", 
        smartMoney: "Non", valueIndex: "0", 
        specialOdds: [] 
      },
      factors: [],
      prediction: { 
        winner: "-", score: "-", duration: "-", volatility: "-", confidence: "-", 
        bestBet: "-", avoidBet: "-", altBet: "-" 
      }
    };

    try {
      const queries = [
        `${p1Name} tennis profile ranking age height`,
        `${p2Name} tennis profile ranking age height`,
        `${p1Name} vs ${p2Name} h2h stats tennis`,
        `weather ${tournament} tennis forecast`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          }).then(res => res.json())
        )
      );

      // --- PARSING P1 ---
      const resP1 = responses[0]?.results || [];
      if (resP1.length > 0) {
         const text = JSON.stringify(resP1).toLowerCase();
         report.p1.rank = extract(text, /(?:rank|#)\s?(\d+)/) || "N/A";
         report.p1.age = extract(text, /(\d{2})\s?years/) || "?";
         report.p1.height = extract(text, /(\d\.\d{2})/) || "?"; // Hauteur séparée
         report.p1.nationality = extract(text, /nationality\s?(\w+)/) || "-";
      }

      // --- PARSING P2 ---
      const resP2 = responses[1]?.results || [];
      if (resP2.length > 0) {
         const text = JSON.stringify(resP2).toLowerCase();
         report.p2.rank = extract(text, /(?:rank|#)\s?(\d+)/) || "N/A";
         report.p2.age = extract(text, /(\d{2})\s?years/) || "?";
         report.p2.height = extract(text, /(\d\.\d{2})/) || "?"; // Hauteur séparée
         report.p2.nationality = extract(text, /nationality\s?(\w+)/) || "-";
      }

      // --- PARSING H2H ---
      const resH2H = responses[2]?.results || [];
      if (resH2H.length > 0) {
          const textH2H = JSON.stringify(resH2H).toLowerCase();
          const h2hScore = textH2H.match(/(\d+)\s?-\s?(\d+)/);
          if (h2hScore) report.h2h.global = `${h2hScore[1]} - ${h2hScore[2]}`;
          report.h2h.lastMatch = resH2H[0].title; // Titre du résultat Google
      }

      // --- PARSING MÉTÉO ---
      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          report.conditions.weather = resWeather[0].snippet.substring(0, 50);
      }

    } catch (e) {
      console.error("Erreur H2HEngine", e);
    }

    return report;
  }
};

// Helper pour initialiser un profil V3 complet
function createEmptyProfile() {
    return {
        rank: "-", bestRank: "-", age: "-", height: "-", nationality: "-",
        hand: "-", style: "-", strongPoint: "-", weakPoint: "-",
        winrateYear: "-", winrateSurface: "-", last5: "V-D-V...",
        form: "5/10", confidence: "Moyenne", injury: "Non", fatigue: "Faible", lastMatchDate: "-",
        serveStats: "-", returnStats: "-", motivation: "-", social: "-"
    };
}

function extract(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
