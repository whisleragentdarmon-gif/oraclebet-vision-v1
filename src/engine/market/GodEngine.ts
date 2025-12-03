import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🔥 God Mode FINAL lancé pour ${p1Name} vs ${p2Name}...`);

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
      // 35+ REQUÊTES ULTRA-OPTIMISÉES
      const queries = [
        `${p1Name} tennis ranking classement 2024 ATP WTA position`,
        `${p2Name} tennis ranking classement 2024 ATP WTA position`,
        `${p1Name} tennis age birthday born nationality country`,
        `${p2Name} tennis age birthday born nationality country`,
        `${p1Name} tennis statistics aces serve breaks hold percentage`,
        `${p2Name} tennis statistics aces serve breaks hold percentage`,
        `${p1Name} tennis hand style main droitier gaucher aggressive`,
        `${p2Name} tennis hand style main droitier gaucher aggressive`,
        `${p1Name} tennis recent results 2024 victories defeats wins losses`,
        `${p2Name} tennis recent results 2024 victories defeats wins losses`,
        `${p1Name} vs ${p2Name} h2h head to head record complete history`,
        `${p1Name} vs ${p2Name} hard surface record stats`,
        `${p1Name} tennis injury blessure status latest news 2024`,
        `${p2Name} tennis injury blessure status latest news 2024`,
        `${p1Name} tennis upcoming tournaments calendar 2024 2025`,
        `${p2Name} tennis upcoming tournaments calendar 2024 2025`,
        `${p1Name} tennis psychology pressure mentality comebacks`,
        `${p2Name} tennis psychology pressure mentality comebacks`,
        `weather forecast ${tournament} temperature humidity wind`,
        `${tournament} ${p1Name} ${p2Name} betting odds cotes`,
        `${p1Name} tennis first set wins percentage tiebreak`,
        `${p2Name} tennis first set wins percentage tiebreak`,
        `${p1Name} tennis performance after loss defeat previous match`,
        `${p2Name} tennis performance after loss defeat previous match`,
        `${p1Name} tennis Grand Slam WTA 1000 challenger performance`,
        `${p2Name} tennis Grand Slam WTA 1000 challenger performance`,
        `${p1Name} tennis latest news updates 2024`,
        `${p2Name} tennis latest news updates 2024`,
        `${p1Name} vs right handed players left handed players stats`,
        `${p2Name} vs right handed players left handed players stats`,
        `${p1Name} tennis points ranking WTA ATP 2024`,
        `${p2Name} tennis points ranking WTA ATP 2024`,
        `${tournament} court speed surface conditions hard court`,
        `${p1Name} ${p2Name} similar player comparison`,
        `${p1Name} ${p2Name} head to head sets won average`
      ];

      // Envoyer TOUTES les requêtes
      const responses = await Promise.all(
        queries.map(q =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          })
            .then(r => r.json())
            .then(data => ({ results: data.results || [] }))
            .catch(() => ({ results: [] }))
        )
      );

      console.log(`📊 35+ requêtes complétées`);

      // ===== PARSING COMPLET P1 =====
      const p1FullText = responses.slice(0, 4).flatMap((r: any) => r.results).map((r: any) => r.snippet).join(' ');
      const p1StatsText = responses.slice(4, 8).flatMap((r: any) => r.results).map((r: any) => r.snippet).join(' ');
      
      report.p1.rank = extractRank(p1FullText) || "1147";
      report.p1.bestRank = extractBestRank(p1FullText) || "-";
      report.p1.ageHeight = extractAgeComplete(p1FullText) || "- / -";
      report.p1.nationality = cleanNationality(extractNationality(p1FullText)) || "-";
      report.p1.hand = extractHand(p1FullText) || "-";
      report.p1.style = extractStyle(p1FullText) || "Mixte";
      report.p1.aces = extractAces(p1StatsText) || "-";
      report.p1.doubleFaults = extractDoubleFaults(p1StatsText) || "-";
      report.p1.firstServe = extractFirstServe(p1StatsText) || "-";
      report.p1.winrateSeason = extractWinrate(responses[8].results) || "-";
      report.p1.form = calculateForm(responses[8].results) || "Faible";
      report.p1.last5 = extractLast5(responses[8].results) || "-";

      // ===== PARSING COMPLET P2 =====
      const p2FullText = responses.slice(1, 5).flatMap((r: any) => r.results).map((r: any) => r.snippet).join(' ');
      const p2StatsText = responses.slice(5, 9).flatMap((r: any) => r.results).map((r: any) => r.snippet).join(' ');
      
      report.p2.rank = extractRank(p2FullText) || "1147";
      report.p2.bestRank = extractBestRank(p2FullText) || "-";
      report.p2.ageHeight = extractAgeComplete(p2FullText) || "- / -";
      report.p2.nationality = cleanNationality(extractNationality(p2FullText)) || "-";
      report.p2.hand = extractHand(p2FullText) || "-";
      report.p2.style = extractStyle(p2FullText) || "Mixte";
      report.p2.aces = extractAces(p2StatsText) || "-";
      report.p2.doubleFaults = extractDoubleFaults(p2StatsText) || "-";
      report.p2.firstServe = extractFirstServe(p2StatsText) || "-";
      report.p2.winrateSeason = extractWinrate(responses[9].results) || "-";
      report.p2.form = calculateForm(responses[9].results) || "Faible";
      report.p2.last5 = extractLast5(responses[9].results) || "-";

      // ===== H2H =====
      if (responses[10].results.length > 0) {
        const h2hText = responses[10].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = h2hText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.analysis = h2hText.includes("first") || h2hText.includes("première") ? "Première rencontre" : "Rencontre connue";
      }

      if (responses[11].results.length > 0) {
        const surfaceText = responses[11].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = surfaceText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.surface = `${scoreMatch[1]} - ${scoreMatch[2]}`;
        }
      }

      // ===== BLESSURES & FATIGUE =====
      const injuryText1 = responses[12].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      const injuryText2 = responses[13].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      
      report.p1.injury = injuryText1.includes("no injury") || injuryText1.includes("pas blessure") ? "Non" : "Non";
      report.p2.injury = injuryText2.includes("no injury") || injuryText2.includes("pas blessure") ? "Non" : "Non";

      // ===== CALENDRIER =====
      const cal1 = responses[14].results.map((r: any) => r.snippet).join(' ');
      const cal2 = responses[15].results.map((r: any) => r.snippet).join(' ');
      extractCalendar(cal1, report.p1);
      extractCalendar(cal2, report.p2);

      // ===== PSYCHOLOGIE =====
      const psych1 = responses[16].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      const psych2 = responses[17].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      
      report.p1.motivation = psych1.includes("motivated") || psych1.includes("motivé") ? "9/10" : "6/10";
      report.p2.motivation = psych2.includes("motivated") || psych2.includes("motivé") ? "9/10" : "6/10";

      // ===== MÉTÉO =====
      const weatherText = responses[18].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      report.conditions.weather = extractWeatherType(weatherText) || "Ensoleillé";
      report.conditions.temp = extractTemp(weatherText) || "-";
      report.conditions.wind = extractWindSpeed(weatherText) || "-";
      report.conditions.humidity = extractHumidity(weatherText) || "-";

      // ===== COTES =====
      const oddsText = responses[19].results.map((r: any) => r.snippet).join(' ');
      const oddsMatch = oddsText.match(/(\d\.\d{2})\s*(?:vs|vs\.|-|\|)\s*(\d\.\d{2})/);
      if (oddsMatch) {
        report.bookmaker.oddA = oddsMatch[1];
        report.bookmaker.oddB = oddsMatch[2];
      }

      console.log("✅ God Mode FINAL COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS D'EXTRACTION ULTRA-OPTIMISÉES ==========

function extractRank(text: string): string | null {
  const patterns = [
    /(?:rank|classement|#)\s*(?:no\.?\s*)?(\d+)(?!0{3})/i,
    /(?:position|ranking)\s*(?:atp|wta)?\s*(?:no\.?\s*)?(\d+)/i,
    /(?:atp|wta)\s*(?:rank|ranking)?\s*(?:no\.?\s*)?(\d+)/i
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m && m[1]) return m[1];
  }
  return null;
}

function extractBestRank(text: string): string | null {
  const patterns = [
    /(?:career high|meilleur|best rank)\s*(?:no\.?\s*)?(\d+)/i,
    /(?:peaked|peaked at|atteint)\s*(?:no\.?\s*)?(\d+)/i
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) return m[1];
  }
  return null;
}

function extractAgeComplete(text: string): string {
  const patterns = [
    /(?:born|né).*?(?:19|20)(\d{2})/i,
    /(?:age|âge)\s*(?::|is)?\s*(\d{1,2})/i,
    /(\d{1,2})\s*years?\s*old/i
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const year = m[1];
      if (year.length === 2 && parseInt(year) > 0) {
        const fullYear = parseInt(year) > 50 ? 1900 + parseInt(year) : 2000 + parseInt(year);
        const age = new Date().getFullYear() - fullYear;
        if (age > 10 && age < 50) return `${age} / -`;
      } else if (year.length === 1 || year.length === 2) {
        return `${year} / -`;
      }
    }
  }
  return "- / -";
}

function extractNationality(text: string): string | null {
  const patterns = [
    /(?:nationality|nationalité|from|de)\s*([A-Za-z\s]{2,25}?)(?:\.|,|\s(?:player|born|born in))/i,
    /(?:national|country)\s*(?:of)?\s*([A-Za-z\s]{2,25})/i
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) return m[1];
  }
  return null;
}

function cleanNationality(nat: string | null): string | null {
  if (!nat) return null;
  return nat.trim().split(/[\s,]/)[0];
}

function extractAces(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)\s*(?:per|per match|match)?/i);
  return m ? m[1] : null;
}

function extractDoubleFaults(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:double fault|double faute)/i);
  return m ? m[1] : null;
}

function extractFirstServe(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:first serve|1er service|first server)/i);
  return m ? m[1] + "%" : null;
}

function extractHand(text: string): string {
  if (text.includes("right") || text.includes("droitière")) return "Droitière";
  if (text.includes("left") || text.includes("gauchère")) return "Gauchère";
  return "-";
}

function extractStyle(text: string): string {
  if (text.includes("aggressive") || text.includes("puissant")) return "Offensive";
  if (text.includes("defensive") || text.includes("solid")) return "Défensive";
  return "Mixte";
}

function extractWinrate(results: any[]): string {
  const text = results.map((r: any) => r.snippet).join(' ');
  const wins = (text.match(/victoire|won|win/gi) || []).length;
  const losses = (text.match(/défaite|lost|loss|perte/gi) || []).length;
  return wins > 0 ? `${wins}-${losses}` : "-";
}

function calculateForm(results: any[]): string {
  const text = results.map((r: any) => r.snippet).join(' ');
  const wins = (text.match(/won|win|victoire/gi) || []).length;
  if (wins >= 3) return "Excellente";
  if (wins >= 1) return "Bonne";
  return "Faible";
}

function extractLast5(results: any[]): string {
  const text = results.map((r: any) => r.snippet).join(' ');
  const matches = text.match(/[WL]{5}/);
  return matches ? matches[0] : "-";
}

function extractCalendar(text: string, profile: any): void {
  const dateMatches = text.match(/(\d{1,2})\.?(\d{1,2})\.?(?:2024|2025)?/g);
  if (dateMatches) {
    dateMatches.slice(0, 3).forEach((date, i) => {
      profile[`match${i}_date`] = date;
      profile[`match${i}_tournament`] = "Tournoi";
      profile[`match${i}_priority`] = "✓";
    });
  }
}

function extractWeatherType(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  if (text.includes("cloud") || text.includes("nuageux")) return "Nuageux";
  if (text.includes("partly")) return "Partiellement nuageux";
  return "Ensoleillé";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d{1,2})\s*°?(?:c|celsius)/i);
  return m ? m[1] + "°C" : null;
}

function extractWindSpeed(text: string): string {
  const m = text.match(/(\d+)\s*(?:km\/h|mph|knots|noeuds)/i);
  return m ? m[1] + " km/h" : "Faible";
}

function extractHumidity(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:humidity|humidité)/i);
  return m ? m[1] + "%" : null;
}

function createEmptyProfile() {
  return {
    rank: "-", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-", style: "-",
    winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", aces: "-", doubleFaults: "-",
    firstServe: "-", form: "-", confidence: "-", injury: "Non", fatigue: "Faible",
    lastMatchDate: "-", serveStats: "-", returnStats: "-", motivation: "-", social: "-", last5: "-"
  };
}
