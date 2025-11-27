// pages/LivePage.tsx
import React, { useEffect, useState } from "react";
import { MatchCard } from "../components/MatchCard";
import { Match } from "../types";

import { fetchAllMatches } from "../engine/matches";
import { MOCK_MATCHES } from "../engine/constants";

interface LivePageProps {
  filter: "LIVE" | "TODAY" | "UPCOMING";
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);

      try {
        // 🔥 Priorité : vraies données IA
        const realMatches = await fetchAllMatches();

        let filtered = realMatches;

        if (filter === "LIVE") filtered = realMatches.filter(m => m.status === "LIVE");
        if (filter === "TODAY") filtered = realMatches.filter(m => m.status === "TODAY");
        if (filter === "UPCOMING") filtered = realMatches.filter(m => m.status === "UPCOMING");

        // 🔥 Si aucune donnée IA → fallback sur les mocks
        if (filtered.length === 0) {
          filtered = MOCK_MATCHES.filter(m => m.status === filter);
        }

        setMatches(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        // 🔥 Fallback absolu
        setMatches(MOCK_MATCHES.filter(m => m.status === filter));
      }

      setLoading(false);
    }

    loadMatches();
  }, [filter]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-neon pl-4">{title}</h2>
        <span className="text-sm text-gray-500 font-mono">{matches.length} Matchs trouvés</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">
          Chargement...
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <p className="text-gray-500">Aucun match disponible pour cette catégorie.</p>
        </div>
      )}
    </div>
  );
};
