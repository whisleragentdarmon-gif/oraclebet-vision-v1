import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🚀 God Mode lancé - Serper Only...`);

    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Dur", date: new Date().toLocaleDateString('fr-FR'),
        round: "Qualification", city: "Non trouvé", timezone: "UTC", 
        importanceP1: "Moyenne", importanceP2: "Moyenne", enjeu: "Points"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { 
        global: "0 - 0", surface: "0 - 0", advantage: "Neutre", lastMatches: "-", trend: "Neutre", analysis: "-" 
      },
      conditions: { 
        weather: "Non trouvé", temp: "-", wind: "-", humidity: "-", 
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
      // ===== PHASE 1: SERPER (Données complètes) =====
      console.log("🔍 Phase 1: Serper...");

      const serperQueries = [
        `${p1Name} tennis classement ranking ATP WTA 2024 profile`,
        `${p2Name} tennis classement ranking ATP WTA 2024 profile`,
        `${p1Name} tennis statistics aces break hold serve first`,
        `${p2Name} tennis statistics aces break hold serve first`,
        `${p1Name} tennis recent results wins losses last matches`,
        `${p2Name} tennis recent results wins losses last matches`,
        `${p1Name} vs ${p2Name} h2h head to head complete record`,
        `${p1Name} tennis age born nationality main hand style`,
        `${p2Name} tennis age born nationality main hand style`,
        `weather ${tournament} temperature humidity wind forecast`,
        `${p1Name} vs ${p2Name} betting odds cotes 2024`,
        `${p1Name} tennis calendar upcoming tournaments 2024 2025`,
      ];

      const serperResponses = await Promise.all(
        serperQueries.map(q =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          })
            .then(r => r.json())
            .then(data => ({ results: data.results || [] }))
            .catch(e => {
              console.error(`❌ Serper Error (${q}):`, e);
              return { results: [] };
            })
        )
      );

      console.log("✅ Phase 1 Serper complétée");

      // ===== PARSING SERPER =====

      // P1 Profile & Stats
      if (serperResponses[0].results.length > 0) {
        const text = serperResponses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.rank = extractRank(text) || "-";
        report.p1.bestRank = extractBestRank(text) || "-";
      }

      if (serperResponses[2].results.length > 0) {
        const text = serperResponses[2].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.aces = extractAces(text) || "-";
        report.p1.doubleFaults = extractDoubleFaults(text) || "-";
        report.p1.firstServe = extractFirstServe(text) || "-";
      }

      if (serperResponses[4].results.length > 0) {
        const text = serperResponses[4].results.map((r: any) => r.snippet).join(' ');
        report.p1.winrateSeason = extractWinrate(text) || "-";
        report.p1.last5 = extractLast5(text) || "-";
        report.p1.form = calculateForm(text) || "Faible";
      }

      if (serperResponses[7].results.length > 0) {
        const text = serperResponses[7].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.ageHeight = extractAge(text) || "- / -";
        report.p1.nationality = extractNationality(text) || "-";
        report.p1.hand = extractHand(text) || "-";
        report.p1.style = extractStyle(text) || "-";
      }

      // P2 Profile & Stats
      if (serperResponses[1].results.length > 0) {
        const text = serperResponses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.rank = extractRank(text) || "-";
        report.p2.bestRank = extractBestRank(text) || "-";
      }

      if (serperResponses[3].results.length > 0) {
        const text = serperResponses[3].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.aces = extractAces(text) || "-";
        report.p2.doubleFaults = extractDoubleFaults(text) || "-";
        report.p2.firstServe = extractFirstServe(text) || "-";
      }

      if (serperResponses[5].results.length > 0) {
        const text = serperResponses[5].results.map((r: any) => r.snippet).join(' ');
        report.p2.winrateSeason = extractWinrate(text) || "-";
        report.p2.last5 = extractLast5(text) || "-";
        report.p2.form = calculateForm(text) || "Faible";
      }

      if (serperResponses[8].results.length > 0) {
        const text = serperResponses[8].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.ageHeight = extractAge(text) || "- / -";
        report.p2.nationality = extractNationality(text) || "-";
        report.p2.hand = extractHand(text) || "-";
        report.p2.style = extractStyle(text) || "-";
      }

      // H2H
      if (serperResponses[6].results.length > 0) {
        const h2hText = serperResponses[6].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = h2hText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.analysis = h2hText.includes("first") ? "Première rencontre" : "Rencontre connue";
      }

      // Météo
      if (serperResponses[9].results.length > 0) {
        const weatherText = serperResponses[9].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = extractWeather(weatherText) || "Ensoleillé";
        report.conditions.temp = extractTemp(weatherText) || "-";
        report.conditions.wind = extractWind(weatherText) || "-";
        report.conditions.humidity = extractHumidity(weatherText) || "-";
      }

      // Cotes
      if (serperResponses[10].results.length > 0) {
        const oddsText = serperResponses[10].results.map((r: any) => r.snippet).join(' ');
        const oddsMatch = oddsText.match(/(\d\.\d{2})\s*(?:vs|-)\s*(\d\.\d{2})/);
        if (oddsMatch) {
          report.bookmaker.oddA = oddsMatch[1];
          report.bookmaker.oddB = oddsMatch[2];
        }
      }

      console.log("✅ God Mode COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS D'EXTRACTION ==========

function extractRank(text: string): string | null {
  const m = text.match(/(?:rank|classement|#)\s*(?:no\.?\s*)?(\d+)(?![0-9])/i);
  return m ? m[1] : null;
}

function extractBestRank(text: string): string | null {
  const m = text.match(/(?:career high|meilleur|best rank)\s*(?:no\.?\s*)?(\d+)/i);
  return m ? m[1] : null;
}

function extractAces(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)\s*(?:par|per|per match)?/i);
  return m ? m[1] : null;
}

function extractDoubleFaults(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:double fault|double faute)/i);
  return m ? m[1] : null;
}

function extractFirstServe(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:first serve|1er service|premier service)/i);
  return m ? m[1] + "%" : null;
}

function extractAge(text: string): string {
  const m = text.match(/(?:born|né|age|âge).*?(?:(\d{1,2})\s*(?:ans|years|yo)|(?:19|20)(\d{2}))/i);
  if (m && m[1]) return `${m[1]} / -`;
  if (m && m[2]) {
    const age = new Date().getFullYear() - parseInt(m[2]);
    return `${age} / -`;
  }
  return "- / -";
}

function extractNationality(text: string): string | null {
  const m = text.match(/(?:nationality|nationalité|from|de|pays)\s*(?::|is)?\s*([A-Za-z\s]{2,20})(?:\.|,|\s|$)/i);
  return m ? m[1].trim().split(/[\s,]/)[0] : null;
}

function extractHand(text: string): string {
  if (text.includes("right") || text.includes("droitière")) return "Droitière";
  if (text.includes("left") || text.includes("gauchère")) return "Gauchère";
  return "-";
}

function extractStyle(text: string): string {
  if (text.includes("aggressive")) return "Offensive";
  if (text.includes("defensive")) return "Défensive";
  if (text.includes("baseline")) return "Offensive";
  return "Mixte";
}

function extractWinrate(text: string): string {
  const wins = (text.match(/won|win|victoire|victoires/gi) || []).length;
  const losses = (text.match(/lost|loss|défaite|défaites/gi) || []).length;
  return wins > 0 || losses > 0 ? `${wins}-${losses}` : "-";
}

function extractLast5(text: string): string {
  const m = text.match(/[WL]{5}/);
  return m ? m[0] : "-";
}

function calculateForm(text: string): string {
  const wins = (text.match(/won|win/gi) || []).length;
  if (wins >= 3) return "Excellente";
  if (wins >= 1) return "Bonne";
  return "Faible";
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  if (text.includes("cloud") || text.includes("nuageux")) return "Nuageux";
  return "Ensoleillé";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d{1,2})\s*°?\s*(?:c|celsius)/i);
  return m ? m[1] + "°C" : null;
}

function extractWind(text: string): string {
  const m = text.match(/(\d+)\s*(?:km\/h|mph|knots)/i);
  return m ? m[1] + " km/h" : "Faible";
}

function extractHumidity(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:humidity|humidité|hygrométrie)/i);
  return m ? m[1] + "%" : null;
}

function createEmptyProfile() {
  return {
    rank: "-", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-", style: "-",
    winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", aces: "-", doubleFaults: "-",
    firstServe: "-", form: "-", confidence: "-", injury: "Non", fatigue: "Faible",
    serveStats: "-", returnStats: "-", motivation: "-", last5: "-"
  };
}
