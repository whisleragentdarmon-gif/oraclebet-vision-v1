import React from "react";
import { MOCK_MATCHES } from "../engine/constants";
import { MatchCard } from "../components/MatchCard";

export const LivePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">En Direct</h1>

      {MOCK_MATCHES.map(match => (
        <div key={match.id} className="mb-4">
          <MatchCard match={match} />
        </div>
      ))}
    </div>
  );
};
