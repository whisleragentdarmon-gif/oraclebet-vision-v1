// pages/AnalysisPage.tsx
import React, { useEffect, useState } from "react";
import { 
  fetchAllMatches, 
  fetchSafeBets, 
  fetchNoBets, 
  fetchHistory 
} from "../engine/matches";

export const AnalysisPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [oracleData, setOracleData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const matches = await fetchAllMatches();
      const safe = await fetchSafeBets();
      const noBet = await fetchNoBets();
      const history = await fetchHistory();

      setOracleData({
        matches,
        pronostics: safe,
        noBet,
        suivi: history
      });

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Chargement des analyses IA...</p>;

  return (
    <div className="analysis-wrapper">
      <h1>Analyses IA – OracleBet Vision</h1>

      {/* SAFE BETS */}
      <section>
        <h2>🟩 Safe Bets</h2>
        {oracleData.pronostics.length === 0 ? (
          <p>Aucun pronostic pour le moment.</p>
        ) : (
          oracleData.pronostics.map((p: any, i: number) => (
            <div key={i} className="safe-item">
              <strong>{p.player1} vs {p.player2}</strong><br />
              Vainqueur : {p.predicted_winner}<br />
              Confiance : {p.confidence}%
            </div>
          ))
        )}
      </section>

      {/* NO BET */}
      <section>
        <h2>⚠️ NO BET</h2>
        {oracleData.noBet.map((m: any, i: number) => (
          <div key={i} className="nobet-item">
            {m.player1} vs {m.player2}
          </div>
        ))}
      </section>

      {/* HISTORIQUE */}
      <section>
        <h2>📊 Historique</h2>
        <p>Réussis : {oracleData.suivi.passed.length}</p>
        <p>Ratés : {oracleData.suivi.failed.length}</p>
      </section>
    </div>
  );
};
