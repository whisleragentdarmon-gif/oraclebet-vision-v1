import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🚀 God Mode OPTIMISÉ - Tennis API v1 + Serper...`);

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

      // Chercher les joueurs dans les rankings
      console.log(`🔍 Searching for ${p1Name} and ${p2Name}...`);
      
      const rankings = await tennisApiCall('/rankings', { limit: '1000' });
      
      let p1Data = null;
      let p2Data = null;
      let p1Id = null;
      let p2Id = null;

      if (rankings?.data) {
        // Chercher p1 dans les rankings
        p1Data = rankings.data.find((player: any) => 
          player.name?.toLowerCase().includes(p1Name.toLowerCase())
        );
        
        // Chercher p2 dans les rankings
        p2Data = rankings.data.find((player: any) => 
          player.name?.toLowerCase().includes(p2Name.toLowerCase())
        );

        if (p1Data) {
          p1Id = p1Data.playerId;
          console.log(`✅ ${p1Name} trouvé (ID: ${p1Id})`);
        } else {
          console.warn(`⚠️ ${p1Name} non trouvé dans les rankings`);
        }

        if (p2Data) {
          p2Id = p2Data.playerId;
          console.log(`✅ ${p2Name} trouvé (ID: ${p2Id})`);
        } else {
          console.warn(`⚠️ ${p2Name} non trouvé dans les rankings`);
        }
      }

      // ===== RÉCUPÉRER LES DONNÉES COMPLÈTES =====

      let p1Profile = null;
      let p2Profile = null;
      let p1Results = null;
      let p2Results = null;
      let p1News = null;
      let p2News = null;
      let p1Schedule = null;
      let p2Schedule = null;

      if (p1Id) {
        p1Profile = await tennisApiCall('/player-profile', { playerId: p1Id.toString() });
        p1Results = await tennisApiCall('/player-result', { playerId: p1Id.toString(), limit: '10' });
        p1News = await tennisApiCall('/news', { playerId: p1Id.toString() });
        p1Schedule = await tennisApiCall('/schedule', { playerId: p1Id.toString() });
      }

      if (p2Id) {
        p2Profile = await tennisApiCall('/player-profile', { playerId: p2Id.toString() });
        p2Results = await tennisApiCall('/player-result', { playerId: p2Id.toString(), limit: '10' });
        p2News = await tennisApiCall('/news', { playerId: p2Id.toString() });
        p2Schedule = await tennisApiCall('/schedule', { playerId: p2Id.toString() });
      }

      console.log("✅ Phase 1 Tennis API complétée");

      // ===== PARSING TENNIS API =====

      // P1 Profile
      if (p1Profile?.data) {
        const p = p1Profile.data;
        report.p1.rank = p1Data?.ranking?.toString() || p.ranking?.toString() || "-";
        report.p1.bestRank = p.bestRanking?.toString() || "-";
        report.p1.nationality = p.country || p.nationality || "-";
        report.p1.hand = p.hand || "-";
        report.p1.style = p.playingStyle || "Mixte";
        report.p1.ageHeight = `${calculateAge(p.birthDate)} / ${p.height || "-"}`;
      }

      // P1 Results
      if (p1Results?.data && p1Results.data.length > 0) {
        const recent = p1Results.data.slice(0, 5);
        const wins = recent.filter((m: any) => m.winner === p1Id).length;
        const losses = recent.length - wins;
        report.p1.winrateSeason = `${wins}-${losses}`;
        report.p1.last5 = recent.map((m: any) => m.winner === p1Id ? 'W' : 'L').join('');
        report.p1.form = wins >= 3 ? "Excellente" : wins >= 1 ? "Bonne" : "Faible";
      }

      // P1 News (propriété non disponible)

      // P1 Schedule
      if (p1Schedule?.data && p1Schedule.data.length > 0) {
        const upcoming = p1Schedule.data.slice(0, 3);
        upcoming.forEach((match: any, i: number) => {
          report.p1[`match${i}_date`] = match.date || "JJ.MM";
          report.p1[`match${i}_tournament`] = match.tournament || "Tournoi";
          report.p1[`match${i}_priority`] = "✓";
        });
      }

      // P2 Profile
      if (p2Profile?.data) {
        const p = p2Profile.data;
        report.p2.rank = p2Data?.ranking?.toString() || p.ranking?.toString() || "-";
        report.p2.bestRank = p.bestRanking?.toString() || "-";
        report.p2.nationality = p.country || p.nationality || "-";
        report.p2.hand = p.hand || "-";
        report.p2.style = p.playingStyle || "Mixte";
        report.p2.ageHeight = `${calculateAge(p.birthDate)} / ${p.height || "-"}`;
      }

      // P2 Results
      if (p2Results?.data && p2Results.data.length > 0) {
        const recent = p2Results.data.slice(0, 5);
        const wins = recent.filter((m: any) => m.winner === p2Id).length;
        const losses = recent.length - wins;
        report.p2.winrateSeason = `${wins}-${losses}`;
        report.p2.last5 = recent.map((m: any) => m.winner === p2Id ? 'W' : 'L').join('');
        report.p2.form = wins >= 3 ? "Excellente" : wins >= 1 ? "Bonne" : "Faible";
      }

      // P2 News (propriété non disponible)

      // P2 Schedule
      if (p2Schedule?.data && p2Schedule.data.length > 0) {
        const upcoming = p2Schedule.data.slice(0, 3);
        upcoming.forEach((match: any, i: number) => {
          report.p2[`match${i}_date`] = match.date || "JJ.MM";
          report.p2[`match${i}_tournament`] = match.tournament || "Tournoi";
          report.p2[`match${i}_priority`] = "✓";
        });
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

      console.log("✅ God Mode OPTIMISÉ COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS UTILITAIRES ==========

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  } catch {
    return 0;
  }
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
    serveStats: "-", returnStats: "-", motivation: "-", last5: "-",
    match0_date: "-", match0_tournament: "-", match0_priority: "-",
    match1_date: "-", match1_tournament: "-", match1_priority: "-",
    match2_date: "-", match2_tournament: "-", match2_priority: "-"
  };
}
