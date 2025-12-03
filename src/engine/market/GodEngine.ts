import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🚀 God Mode FINAL lancé - Tennis API v1 + Serper...`);

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
      // ===== PHASE 1: TENNIS API v1 =====
      console.log("📡 Phase 1: Tennis API v1...");

      const TENNIS_API_KEY = process.env.RAPIDAPI_KEY || 'your_key_here';
      const TENNIS_API_HOST = 'tennis-api.p.rapidapi.com';

      // Helper fonction pour Tennis API
      const tennisApiCall = async (endpoint: string, params: Record<string, string> = {}) => {
        try {
          const queryString = new URLSearchParams(params).toString();
          const url = `https://${TENNIS_API_HOST}${endpoint}${queryString ? '?' + queryString : ''}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': TENNIS_API_KEY,
              'x-rapidapi-host': TENNIS_API_HOST,
              'Accept': 'application/json'
            }
          });

          if (!response.ok) {
            console.warn(`⚠️ Tennis API ${endpoint}: ${response.status}`);
            return null;
          }

          return await response.json();
        } catch (e) {
          console.error(`❌ Tennis API Error (${endpoint}):`, e);
          return null;
        }
      };

      // Chercher les joueurs
      console.log(`🔍 Searching for ${p1Name}...`);
      console.log(`📡 Using API Key: ${TENNIS_API_KEY.substring(0, 10)}...`);
      const p1Data = await tennisApiCall('/search', { name: p1Name });
      console.log(`🎾 P1 Data:`, JSON.stringify(p1Data).substring(0, 200));
      
      console.log(`🔍 Searching for ${p2Name}...`);
      const p2Data = await tennisApiCall('/search', { name: p2Name });
      console.log(`🎾 P2 Data:`, JSON.stringify(p2Data).substring(0, 200));

      let p1Profile = null;
      let p2Profile = null;

      // Si la recherche retourne un joueur, récupère son profil
      if (p1Data?.playerInfo) {
        p1Profile = p1Data;
        console.log(`✅ ${p1Name} trouvé`);
      }

      if (p2Data?.playerInfo) {
        p2Profile = p2Data;
        console.log(`✅ ${p2Name} trouvé`);
      }

      console.log("✅ Phase 1 Tennis API complétée");

      // ===== PARSING TENNIS API =====

      // Parse P1
      if (p1Profile?.playerInfo) {
        const info = p1Profile.playerInfo;
        report.p1.rank = extractRankFromString(info.Rank) || "-";
        report.p1.nationality = info.nationality || "-";
        report.p1.hand = info.plays || "-";
        report.p1.ageHeight = `${extractAge(info.birthDate)} / ${info.height || "-"}`;
        report.p1.winrateSeason = info.singlesWL || "-";
        report.p1.winrateCareer = info.careerSinglesWL || "-";
      }

      // Parse P1 Stats
      if (p1Profile?.stats && p1Profile.stats.length > 0) {
        const currentYear = new Date().getFullYear();
        const yearStats = p1Profile.stats.find((s: any) => parseInt(s.year) === currentYear);
        if (yearStats) {
          report.p1.form = calculateFormFromStats(yearStats.singlesWL);
          report.p1.motivation = calculateMotivation(yearStats.prizeMoney);
        }
        
        // Prendre les 5 derniers years pour calculer la forme
        const last5 = p1Profile.stats.slice(0, 5);
        report.p1.last5 = calculateLast5(last5);
      }

      // Parse P2
      if (p2Profile?.playerInfo) {
        const info = p2Profile.playerInfo;
        report.p2.rank = extractRankFromString(info.Rank) || "-";
        report.p2.nationality = info.nationality || "-";
        report.p2.hand = info.plays || "-";
        report.p2.ageHeight = `${extractAge(info.birthDate)} / ${info.height || "-"}`;
        report.p2.winrateSeason = info.singlesWL || "-";
        report.p2.winrateCareer = info.careerSinglesWL || "-";
      }

      // Parse P2 Stats
      if (p2Profile?.stats && p2Profile.stats.length > 0) {
        const currentYear = new Date().getFullYear();
        const yearStats = p2Profile.stats.find((s: any) => parseInt(s.year) === currentYear);
        if (yearStats) {
          report.p2.form = calculateFormFromStats(yearStats.singlesWL);
          report.p2.motivation = calculateMotivation(yearStats.prizeMoney);
        }
        
        const last5 = p2Profile.stats.slice(0, 5);
        report.p2.last5 = calculateLast5(last5);
      }

      // ===== PHASE 2: SERPER (Données manquantes) =====
      console.log("🔍 Phase 2: Serper...");

      const serperQueries = [
        `${p1Name} vs ${p2Name} h2h head to head record`,
        `${p1Name} tennis aces service percentage statistics`,
        `${p2Name} tennis aces service percentage statistics`,
        `weather ${tournament} temperature humidity wind`,
        `${p1Name} vs ${p2Name} betting odds cotes`,
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
            .catch(() => ({ results: [] }))
        )
      );

      console.log("✅ Phase 2 Serper complétée");

      // Parse Serper - H2H
      if (serperResponses[0].results.length > 0) {
        const h2hText = serperResponses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = h2hText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
      }

      // Parse Serper - Stats P1
      if (serperResponses[1].results.length > 0) {
        const statsText = serperResponses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const aces = statsText.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)/i);
        if (aces) report.p1.aces = aces[1];
        const firstServe = statsText.match(/(\d+)\s*%\s*(?:first serve|1er service)/i);
        if (firstServe) report.p1.firstServe = firstServe[1] + "%";
      }

      // Parse Serper - Stats P2
      if (serperResponses[2].results.length > 0) {
        const statsText = serperResponses[2].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const aces = statsText.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)/i);
        if (aces) report.p2.aces = aces[1];
        const firstServe = statsText.match(/(\d+)\s*%\s*(?:first serve|1er service)/i);
        if (firstServe) report.p2.firstServe = firstServe[1] + "%";
      }

      // Parse Serper - Météo
      const weatherText = serperResponses[3].results.map((r: any) => r.snippet).join(' ').toLowerCase();
      report.conditions.weather = extractWeather(weatherText) || "Ensoleillé";
      report.conditions.temp = extractTemp(weatherText) || "-";
      report.conditions.wind = extractWind(weatherText) || "Faible";
      report.conditions.humidity = extractHumidity(weatherText) || "-";

      // Parse Serper - Cotes
      if (serperResponses[4].results.length > 0) {
        const oddsText = serperResponses[4].results.map((r: any) => r.snippet).join(' ');
        const oddsMatch = oddsText.match(/(\d\.\d{2})\s*(?:vs|-)\s*(\d\.\d{2})/);
        if (oddsMatch) {
          report.bookmaker.oddA = oddsMatch[1];
          report.bookmaker.oddB = oddsMatch[2];
        }
      }

      console.log("✅ God Mode FINAL COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS UTILITAIRES ==========

function extractAge(birthDate: string): number {
  if (!birthDate) return 0;
  try {
    const ageMatch = birthDate.match(/\(Age:\s*(\d+)\)/);
    if (ageMatch) return parseInt(ageMatch[1]);
    
    const dateMatch = birthDate.match(/(\w+)\s*(\d+),\s*(\d{4})/);
    if (dateMatch) {
      const birth = new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? age : 0;
    }
  } catch {
    return 0;
  }
  return 0;
}

function extractRankFromString(rankStr: string): string | null {
  const match = rankStr?.match(/(\d+)/);
  return match ? match[1] : null;
}

function calculateFormFromStats(wlStr: string): string {
  if (!wlStr || wlStr === "0-0") return "Faible";
  const [wins, losses] = wlStr.split('-').map(Number);
  const total = wins + losses;
  if (total === 0) return "Faible";
  const winRate = wins / total;
  if (winRate >= 0.7) return "Excellente";
  if (winRate >= 0.5) return "Bonne";
  return "Faible";
}

function calculateMotivation(prizeStr: string): string {
  if (!prizeStr) return "6/10";
  const prize = parseInt(prizeStr.replace(/[^0-9]/g, '')) || 0;
  if (prize > 1000000) return "9/10";
  if (prize > 500000) return "8/10";
  if (prize > 100000) return "7/10";
  return "6/10";
}

function calculateLast5(stats: any[]): string {
  let result = '';
  for (let i = 0; i < Math.min(5, stats.length); i++) {
    const [wins, losses] = stats[i].singlesWL?.split('-').map(Number) || [0, 0];
    result += wins > losses ? 'W' : losses > wins ? 'L' : 'D';
  }
  return result || "-";
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  if (text.includes("cloud") || text.includes("nuageux")) return "Nuageux";
  if (text.includes("partly")) return "Partiellement nuageux";
  return "Ensoleillé";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d{1,2})\s*°?c/i);
  return m ? m[1] + "°C" : null;
}

function extractWind(text: string): string {
  const m = text.match(/(\d+)\s*(?:km\/h|mph)/i);
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
    serveStats: "-", returnStats: "-", motivation: "-", last5: "-"
  };
}
