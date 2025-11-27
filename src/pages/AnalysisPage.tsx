// pages/AnalysisPage.tsx
import React, { useEffect, useState } from "react";
import { MOCK_MATCHES } from "../constants";


export const AnalysisPage: React.FC = () => {
const [loading, setLoading] = useState(true);
const [oracleData, setOracleData] = useState<any>(null);


useEffect(() => {
setLoading(true);


const safe = MOCK_MATCHES.filter(m => m.ai && m.ai.confidence >= 75);
const noBet = MOCK_MATCHES.filter(m => m.ai && m.ai.riskLevel === "Risky");
const history = {
passed: MOCK_MATCHES.filter(m => m.status === "FINISHED" && m.ai && m.ai.winner === m.winner),
failed: MOCK_MATCHES.filter(m => m.status === "FINISHED" && m.ai && m.ai.winner !== m.winner)
};


setOracleData({
matches: MOCK_MATCHES,
pronostics: safe,
noBet,
suivi: history
});


setLoading(false);
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
<strong>{p.player1.name} vs {p.player2.name}</strong><br />
Vainqueur : {p.ai.winner}<br />
Confiance : {p.ai.confidence}%
</div>
))
)}
</section>


{/* NO BET */}
<section>
<h2>⚠️ NO BET</h2>
{oracleData.noBet.map((m: any, i: number) => (
<div key={i} className="nobet-item">
{m.player1.name} vs {m.player2.name}
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
