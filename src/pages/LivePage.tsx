import React from "react";
import { MOCK_MATCHES } from "../engine/constants";
import { MatchCard } from "../components/MatchCard";

export const LivePage = ({ filter, title }: any) => {
  const matches = MOCK_MATCHES.filter(m => 
      filter === "LIVE" ? m.status === "LIVE" :
      filter === "TODAY" ? m.status === "TODAY" :
      filter === "UPCOMING" ? m.status === "UPCOMING" :
      true
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-400 mb-4">{matches.length} Matchs trouvés</p>

      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};
