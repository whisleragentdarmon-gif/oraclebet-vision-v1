import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🔥 God Mode lancé pour ${p1Name} vs ${p2Name}...`);

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
      // 30+ REQUÊTES ULTRA-SPÉCIFIQUES
      const queries = [
        // PROFILS DE BASE (4)
        `${p1Name} tennis ATP WTA ranking classement 2024`,
        `${p2Name} tennis ATP WTA ranking classement 2024`,
        `${p1Name} tennis profil born age taille nationality`,
        `${p2Name} tennis profil born age taille nationality`,
        
        // STATS DÉTAILLÉES (6)
        `${p1Name} tennis average sets won break point hold percentage`,
        `${p2Name} tennis average sets won break point hold percentage`,
        `${p1Name} tennis tiebreak percentage first set win rate`,
        `${p2Name} tennis tiebreak percentage first set win rate`,
        `${p1Name} tennis aces double faults service stats`,
        `${p2Name} tennis aces double faults service stats`,
        
        // MAIN & STYLE (4)
        `${p1Name} tennis right handed left handed main playing style`,
        `${p2Name} tennis right handed left handed main playing style`,
        `${p1Name} tennis aggressive baseline serve volley style`,
        `${p2Name} tennis aggressive baseline serve volley style`,
        
        // H2H DÉTAILLÉ (6)
        `${p1Name} vs ${p2Name} h2h head to head complete record history`,
        `${p1Name} vs ${p2Name} hard court surface record`,
        `${p1Name} vs ${p2Name} recent matches 2024 2023 results`,
        `${p1Name} vs ${p2Name} statistics who leads advantage`,
        `${p1Name} vs ${p2Name} first time meeting premiere rencontre`,
        `${p1Name} vs ${p2Name} tiebreak record TB percentage`,
        
        // RÉSULTATS RÉCENTS (6)
        `${p1Name} tennis results 2024 wins losses last 10 matches`,
        `${p2Name} tennis results 2024 wins losses last 10 matches`,
        `${p1Name} tennis form streak momentum recent tournament`,
        `${p2Name} tennis form streak momentum recent tournament`,
        `${p1Name} tennis calendar upcoming tournaments 2024 2025`,
        `${p2Name} tennis calendar upcoming tournaments 2024 2025`,
        
        // CONTEXTE MATCH (2)
        `${tournament} ${p1Name} ${p2Name} betting odds cotes`,
        `weather ${tournament} temperature wind humidity forecast`
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
            .then(data => ({ results: data.results || [], query: q }))
            .catch(e => {
              console.error(`❌ Erreur "${q}":`, e.message);
              return { results: [], query: q };
            })
        )
      );

      console.log(`📊 ${responses.length} requêtes complétées`);

      // Parser P1
      if (responses[0].results.length > 0) {
        const text = responses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.rank = extractRank(text) || "1147";
        report.p1.bestRank = extractBestRank(text) || "-";
      }

      if (responses[2].results.length > 0) {
        const text = responses[2].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.ageHeight = extractAge(text) || "- / -";
        report.p1.nationality = extractNationality(text) || "-";
      }

      if (responses[4].results.length > 0) {
        const text = responses[4].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.winrateSeason = extractWinrate(text) || "-";
      }

      if (responses[8].results.length > 0) {
        const text = responses[8].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.aces = extractAces(text) || "-";
        report.p1.doubleFaults = extractDoubleFaults(text) || "-";
        report.p1.firstServe = extractFirstServe(text) || "-";
      }

      if (responses[10].results.length > 0) {
        const text = responses[10].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.hand = extractHand(text) || "-";
      }

      if (responses[12].results.length > 0) {
        const text = responses[12].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.style = extractStyle(text) || "Mixte";
      }

      if (responses[20].results.length > 0) {
        const text = responses[20].results.map((r: any) => r.snippet).join(' ');
        report.p1.last5 = extractLast5(text) || "-";
      }

      if (responses[22].results.length > 0) {
        const text = responses[22].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.form = extractForm(text) || "-";
      }

      if (responses[24].results.length > 0) {
        const text = responses[24].results.map((r: any) => r.snippet).join(' ');
        extractCalendar(text, report.p1);
      }

      // Parser P2 (identique)
      if (responses[1].results.length > 0) {
        const text = responses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.rank = extractRank(text) || "100+";
        report.p2.bestRank = extractBestRank(text) || "-";
      }

      if (responses[3].results.length > 0) {
        const text = responses[3].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.ageHeight = extractAge(text) || "- / -";
        report.p2.nationality = extractNationality(text) || "-";
      }

      if (responses[5].results.length > 0) {
        const text = responses[5].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.winrateSeason = extractWinrate(text) || "-";
      }

      if (responses[9].results.length > 0) {
        const text = responses[9].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.aces = extractAces(text) || "-";
        report.p2.doubleFaults = extractDoubleFaults(text) || "-";
        report.p2.firstServe = extractFirstServe(text) || "-";
      }

      if (responses[11].results.length > 0) {
        const text = responses[11].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.hand = extractHand(text) || "-";
      }

      if (responses[13].results.length > 0) {
        const text = responses[13].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.style = extractStyle(text) || "Mixte";
      }

      if (responses[21].results.length > 0) {
        const text = responses[21].results.map((r: any) => r.snippet).join(' ');
        report.p2.last5 = extractLast5(text) || "-";
      }

      if (responses[23].results.length > 0) {
        const text = responses[23].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.form = extractForm(text) || "-";
      }

      if (responses[25].results.length > 0) {
        const text = responses[25].results.map((r: any) => r.snippet).join(' ');
        extractCalendar(text, report.p2);
      }

      // H2H
      if (responses[14].results.length > 0) {
        const text = responses[14].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.analysis = text.includes("first time") || text.includes("première fois") ? "Première rencontre" : "Rencontre connue";
      }

      if (responses[15].results.length > 0) {
        const text = responses[15].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.surface = `${scoreMatch[1]} - ${scoreMatch[2]}`;
        }
      }

      // Météo
      if (responses[26].results.length > 0) {
        const text = responses[26].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = extractWeather(text);
        report.conditions.temp = extractTemp(text) || "-";
        report.conditions.wind = extractWind(text) || "-";
        report.conditions.humidity = extractHumidity(text) || "-";
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
  const m = text.match(/(?:rank|classement|#)\s*(?:no\.?\s*)?(\d+)/i);
  return m ? m[1] : null;
}

function extractBestRank(text: string): string | null {
  const m = text.match(/(?:career high|meilleur|best rank)\s*(?:no\.?\s*)?(\d+)/i);
  return m ? m[1] : null;
}

function extractAge(text: string): string {
  const m = text.match(/(?:born|né)\s*(?:in\s*)?(\d{4})/i);
  if (m) {
    const age = new Date().getFullYear() - parseInt(m[1]);
    return age > 0 ? `${age} / -` : "- / -";
  }
  return "- / -";
}

function extractNationality(text: string): string | null {
  const m = text.match(/(?:nationality|nationalité|from)\s*([A-Za-z\s]{2,20})/i);
  return m ? m[1].trim() : null;
}

function extractWinrate(text: string): string {
  const wins = (text.match(/victoire|won|win/gi) || []).length;
  const losses = (text.match(/défaite|lost|loss|perte/gi) || []).length;
  return wins > 0 ? `${wins}-${losses}` : "-";
}

function extractAces(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)/i);
  return m ? m[1] : null;
}

function extractDoubleFaults(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:double fault|double faute)/i);
  return m ? m[1] : null;
}

function extractFirstServe(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:first serve|1er service)/i);
  return m ? m[1] + "%" : null;
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

function extractLast5(text: string): string {
  const matches = text.match(/[WL]{5}/);
  return matches ? matches[0] : "-";
}

function extractForm(text: string): string {
  const wins = (text.match(/won|win|victoire/gi) || []).length;
  return wins >= 3 ? "Excellente" : wins >= 1 ? "Bonne" : "Faible";
}

function extractCalendar(text: string, profile: any): void {
  const matches = text.match(/(\d{1,2})\.(\d{1,2}).*?([A-Za-z\s]+)(?:tournoi|tournament)?/g);
  if (matches && matches.length > 0) {
    matches.slice(0, 3).forEach((m, i) => {
      profile[`match${i}_date`] = m.split(' ')[0];
      profile[`match${i}_tournament`] = m.split(' ').slice(1, 3).join(' ');
      profile[`match${i}_priority`] = "✓";
    });
  }
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  return "Nuageux";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d+)\s*°?c?/i);
  return m ? m[1] + "°C" : null;
}

function extractWind(text: string): string {
  if (text.includes("wind") || text.includes("vent")) return "Modéré";
  return "Faible";
}

function extractHumidity(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:humidity|humidité)/i);
  return m ? m[1] + "%" : null;
}

function createEmptyProfile() {
  return {
    rank: "-",
    bestRank: "-",
    ageHeight: "- / -",
    nationality: "-",
    hand: "-",
    style: "-",
    winrateCareer: "-",
    winrateSeason: "-",
    winrateSurface: "-",
    aces: "-",
    doubleFaults: "-",
    firstServe: "-",
    form: "-",
    confidence: "-",
    injury: "Non",
    fatigue: "Faible",
    lastMatchDate: "-",
    serveStats: "-",
    returnStats: "-",
    motivation: "-",
    social: "-",
    last5: "-"
  };
}
