import { Match, MatchStatus } from '../types';
import { OracleAI } from '../engine';

// Traduction SportScore -> OracleBet
const mapStatus = (status: string): MatchStatus => {
  const s = status ? status.toLowerCase() : '';
  if (s.includes('progress') || s.includes('live') || s === 'inplay') return 'LIVE';
  if (s.includes('finish') || s.includes('ended')) return 'FINISHED';
  if (s.includes('not') || s.includes('upcoming')) return 'UPCOMING';
  return 'SCHEDULED';
};

export const MatchService = {
  getTodaysMatches: async (): Promise<Match[]> => {
    try {
      // On appelle NOTRE serveur (celui à la racine)
      // Note: Sur localhost, cela peut nécessiter l'URL complète http://localhost:3000/api/matches
      // Mais sur Vercel, /api/matches suffit.
      const response = await fetch('/api/matches');
      
      if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const json = await response.json();

      if (!json.data) return [];

      // On transforme les données SportScore en format OracleBet
      const realMatches: Match[] = json.data.map((m: any) => {
        const p1Name = m.home_team?.name || "Joueur 1";
        const p2Name = m.away_team?.name || "Joueur 2";
        
        // Simulation IA sur les vrais noms
        const aiData = {
            winner: Math.random() > 0.5 ? p1Name : p2Name,
            confidence: Math.floor(Math.random() * (90 - 55) + 55),
            recommendedBet: "Analyse Live...",
            riskLevel: 'MODERATE' as const,
            marketType: 'WINNER',
            circuit: m.league?.name?.includes('WTA') ? 'WTA' : 'ATP',
            fairOdds: { p1: 1.80, p2: 1.95 },
            qualitativeAnalysis: `Match officiel : ${m.league?.name || 'Tournoi'}.`,
            integrity: { isSuspicious: false, score: 0 }
        };

        return {
          id: String(m.id),
          tournament: m.league?.name || "Tournoi",
          date: m.start_at ? new Date(m.start_at).toLocaleDateString() : "Auj.",
          time: m.start_at ? new Date(m.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "00:00",
          status: mapStatus(m.status),
          surface: 'Hard', 
          score: m.home_score?.display ? `${m.home_score.display}-${m.away_score.display}` : undefined,
          player1: { name: p1Name, rank: 0, country: 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          player2: { name: p2Name, rank: 0, country: 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          odds: { player1: 1.85, player2: 1.85, p1: 1.85, p2: 1.85 },
          ai: aiData
        };
      });

      return realMatches;
    } catch (e: any) {
      console.error("Erreur API:", e);
      throw new Error(e.message || "Erreur inconnue");
    }
  }
};
