import { Match, MatchStatus } from '../types';
import { OracleAI } from '../engine';

const mapStatus = (status: any): MatchStatus => {
  // SportScore renvoie parfois des objets ou des strings
  const s = (typeof status === 'string' ? status : status?.slug || '').toLowerCase();
  
  // LIVE : En cours, set 1, set 2, etc.
  if (s === 'inprogress' || s.includes('set') || s === 'live') return 'LIVE';
  
  // FINI : Terminé, Abandon, Annulé
  if (s === 'finished' || s === 'ended' || s === 'retired' || s === 'cancelled' || s === 'walkover') return 'FINISHED';
  
  // A VENIR
  if (s === 'notstarted' || s === 'scheduled') return 'UPCOMING';
  
  // Par défaut (si on sait pas, on dit à venir)
  return 'SCHEDULED';
};

export const MatchService = {
  getTodaysMatches: async (): Promise<Match[]> => {
    try {
      const response = await fetch('/api/matches');
      const json = await response.json();

      if (!json.data) return [];

      const realMatches: Match[] = json.data.map((m: any) => {
        const p1Name = m.home_team?.name || "TBA";
        const p2Name = m.away_team?.name || "TBA";
        const status = mapStatus(m.status);

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
          status: status, // Utilise le nouveau mapping strict
          surface: 'Hard', 
          score: m.home_score?.display ? `${m.home_score.display}-${m.away_score.display}` : undefined,
          player1: { name: p1Name, rank: 0, country: 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          player2: { name: p2Name, rank: 0, country: 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          odds: { player1: 1.85, player2: 1.85, p1: 1.85, p2: 1.85 },
          ai: aiData
        };
      });

      return realMatches;
    } catch (e) {
      console.error("Erreur API:", e);
      return [];
    }
  }
};
