import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🔍 God Mode lancé pour ${p1Name} vs ${p2Name}...`);

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
      // 15+ REQUÊTES INTELLIGENTES
      const queries = [
        `${p1Name} tennis classement ranking ATP WTA 2024`,
        `${p2Name} tennis classement ranking ATP WTA 2024`,
        `${p1Name} statistiques tennis aces pourcentage service`,
        `${p2Name} statistiques tennis aces pourcentage service`,
        `${p1Name} vs ${p2Name} h2h tête à tête`,
        `${p1Name} résultats victoires défaites 2024`,
        `${p2Name} résultats victoires défaites 2024`,
        `${p1Name} blessure injury status 2024`,
        `${p2Name} blessure injury status 2024`,
        `${p1Name} profil tennis main style âge`,
        `${p2Name} profil tennis main style âge`,
        `météo ${tournament.toLowerCase()} température vent`,
        `${p1Name} ${p2Name} cotes odds paris`,
        `${tournament} tournoi tennis 2024`,
        `${p1Name} actualités tennis 2024`
      ];

      // Envoyer toutes les requêtes
      const responses = await Promise.all(
        queries.map(q =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          })
            .then(r => r.json())
            .then(data => ({ results: data.results || [] }))
            .catch(e => {
              console.error(`❌ Erreur requête "${q}":`, e);
              return { results: [] };
            })
        )
      );

      // Parser les réponses
      const allText = responses.map(r => r.results).flat();
      const fullText = allText.map((r: any) => `${r.title} ${r.snippet}`).join(' ').toLowerCase();

      // ========== PARSING P1 ==========
      console.log(`📊 Parsing ${p1Name}...`);
      
      if (responses[0].results.length > 0) {
        const text = responses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.rank = extractRank(text) || "100+";
        report.p1.bestRank = extractBestRank(text) || "-";
      }

      if (responses[2].results.length > 0) {
        const text = responses[2].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.aces = extractAces(text) || "-";
        report.p1.firstServe = extractFirstServe(text) || "-";
      }

      if (responses[5].results.length > 0) {
        const text = responses[5].results.map((r: any) => r.snippet).join(' ');
        const matches = text.match(/(\d+)[:\s-]+(\d+)/g) || [];
        if (matches.length > 0) {
          report.p1.winrateSeason = extractWinrate(text);
        }
      }

      if (responses[7].results.length > 0) {
        const text = responses[7].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.injury = text.includes("no injury") || text.includes("pas blessure") ? "Non" : text.includes("injury") ? "Oui" : "Non";
      }

      if (responses[9].results.length > 0) {
        const text = responses[9].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.ageHeight = extractAge(text) || "- / -";
        report.p1.hand = extractHand(text) || "-";
        report.p1.style = extractStyle(text) || "-";
        report.p1.nationality = extractNationality(text) || "-";
      }

      // ========== PARSING P2 ==========
      console.log(`📊 Parsing ${p2Name}...`);
      
      if (responses[1].results.length > 0) {
        const text = responses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.rank = extractRank(text) || "100+";
        report.p2.bestRank = extractBestRank(text) || "-";
      }

      if (responses[3].results.length > 0) {
        const text = responses[3].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.aces = extractAces(text) || "-";
        report.p2.firstServe = extractFirstServe(text) || "-";
      }

      if (responses[6].results.length > 0) {
        const text = responses[6].results.map((r: any) => r.snippet).join(' ');
        report.p2.winrateSeason = extractWinrate(text);
      }

      if (responses[8].results.length > 0) {
        const text = responses[8].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.injury = text.includes("no injury") || text.includes("pas blessure") ? "Non" : text.includes("injury") ? "Oui" : "Non";
      }

      if (responses[10].results.length > 0) {
        const text = responses[10].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.ageHeight = extractAge(text) || "- / -";
        report.p2.hand = extractHand(text) || "-";
        report.p2.style = extractStyle(text) || "-";
        report.p2.nationality = extractNationality(text) || "-";
      }

      // ========== H2H ==========
      if (responses[4].results.length > 0) {
        const text = responses[4].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.analysis = text.includes("première fois") || text.includes("first time") ? "Première rencontre" : "Rencontre connue";
      }

      // ========== MÉTÉO ==========
      if (responses[11].results.length > 0) {
        const text = responses[11].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = extractWeather(text);
        report.conditions.temp = extractTemp(text) || "-";
        report.conditions.wind = text.includes("vent") || text.includes("wind") ? "Présent" : "-";
        report.conditions.humidity = extractHumidity(text) || "-";
      }

      // ========== COTES ==========
      if (responses[12].results.length > 0) {
        const text = responses[12].results.map((r: any) => r.snippet).join(' ');
        const oddsMatch = text.match(/(\d\.\d{2})\s*[-/vs]\s*(\d\.\d{2})/);
        if (oddsMatch) {
          report.bookmaker.oddA = oddsMatch[1];
          report.bookmaker.oddB = oddsMatch[2];
        }
      }

      console.log("✅ God Mode COMPLET - Données enrichies!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS D'EXTRACTION ==========

function extractRank(text: string): string | null {
  const matches = text.match(/(?:rank|classement|#)\s*(?:no\.\s*)?(\d+)/i);
  return matches ? matches[1] : null;
}

function extractBestRank(text: string): string | null {
  const matches = text.match(/(?:career high|meilleur|best rank)\s*(?:no\.\s*)?(\d+)/i);
  return matches ? matches[1] : null;
}

function extractAces(text: string): string | null {
  const matches = text.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)/i);
  return matches ? matches[1] : null;
}

function extractFirstServe(text: string): string | null {
  const matches = text.match(/(\d+)\s*%.*first serve/i) || text.match(/first serve\s*(\d+)\s*%/i);
  return matches ? matches[1] + "%" : null;
}

function extractWinrate(text: string): string {
  const wins = (text.match(/victoire|won|win|defeated/gi) || []).length;
  const losses = (text.match(/défaite|lost|loss|perte/gi) || []).length;
  return wins > 0 ? `${wins}-${losses}` : "-";
}

function extractAge(text: string): string {
  const ageMatch = text.match(/(?:age|né|born)\s*(?:in\s*)?(\d{4})/);
  if (ageMatch) {
    const birthYear = parseInt(ageMatch[1]);
    const age = new Date().getFullYear() - birthYear;
    return age > 0 ? `${age} / -` : "- / -";
  }
  return "- / -";
}

function extractHand(text: string): string {
  if (text.includes("right") || text.includes("droitière")) return "Droitière";
  if (text.includes("left") || text.includes("gauchère")) return "Gauchère";
  return "-";
}

function extractStyle(text: string): string {
  if (text.includes("aggressive")) return "Offensive";
  if (text.includes("defensive")) return "Défensive";
  return "Mixte";
}

function extractNationality(text: string): string {
  const matches = text.match(/(?:nationality|nationalité|from)\s*([A-Za-z\s]{2,20})/i);
  return matches ? matches[1].trim() : "-";
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  if (text.includes("cloud") || text.includes("nuageux")) return "Nuageux";
  return "Non trouvé";
}

function extractTemp(text: string): string | null {
  const matches = text.match(/(\d+)\s*°?\s*c/i);
  return matches ? matches[1] + "°C" : null;
}

function extractHumidity(text: string): string | null {
  const matches = text.match(/(\d+)\s*%\s*(?:humidity|humidité)/i);
  return matches ? matches[1] + "%" : null;
}

function createEmptyProfile() {
  return {
    rank: "-", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-", style: "-",
    winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", aces: "-", doubleFaults: "-",
    firstServe: "-", form: "-", confidence: "-", injury: "Non", fatigue: "Faible",
    lastMatchDate: "-", serveStats: "-", returnStats: "-", motivation: "-", social: "-", last5: "-"
  };
}
