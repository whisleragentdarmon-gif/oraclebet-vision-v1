import React from "react";
import { MatchCard } from "../components/MatchCard";

export const LivePage = ({ filter, title }: any) => {

  // 🔥 SIMULATION EXACTE DU PREMIER DEPLOIEMENT
  const matches = [
    {
      tournament: "EN DIRECT",
      category: "ATP",
      player1: "A. Rublev",
      player2: "F. Auger-Aliassime",
      score: "4-2 | 1.65",
      pickLabel: "Rublev gagne",
      confidence: 72,
    },
    {
      tournament: "EN DIRECT",
      category: "WTA",
      player1: "N. Osaka",
      player2: "E. Rybakina",
      score: "4-3 | 2.10",
      pickLabel: "Rybakina gagne",
      confidence: 68,
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <p className="text-gray-400 mb-4">{matches.length} Matchs trouvés</p>

      {matches.map((m, i) => (
        <MatchCard key={i} match={m} />
      ))}
    </div>
  );
};


