import React, { useState, useEffect } from 'react';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReportV2 } from '../engine/types';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { useData } from '../context/DataContext'; // Si tu veux lier aux matchs réels plus tard
import { FilePlus, FolderOpen, Save } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  // État du rapport actuel (Vide par défaut)
  const [report, setReport] = useState<GodModeReportV2>(getEmptyReport());
  const [showMenu, setShowMenu] = useState(true);

  // Fonction pour charger un scénario
  const loadScenario = (scenario: GodModeReportV2) => {
    setReport(JSON.parse(JSON.stringify(scenario))); // Deep copy pour éviter les bugs
    setShowMenu(false);
  };

  // Fonction pour réinitialiser
  const resetReport = () => {
    setReport(getEmptyReport());
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-carbon text-white">
      
      {/* BARRE D'OUTILS */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-surface">
        <h2 className="text-xl font-bold text-neon flex items-center gap-2">
            GOD MODE v2 <span className="text-xs text-gray-500 font-normal">| Éditeur Manuel & Scénarios</span>
        </h2>
        
        <div className="flex gap-2">
            <button 
                onClick={resetReport}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-bold transition-colors"
            >
                <FilePlus size={14}/> Nouveau
            </button>
            <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors">
                    <FolderOpen size={14}/> Charger Scénario
                </button>
                {/* Menu déroulant des scénarios */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                    {DEMO_SCENARIOS.map((s) => (
                        <button
                            key={s.identity.matchId}
                            onClick={() => loadScenario(s)}
                            className="w-full text-left p-2 hover:bg-white/10 rounded-lg text-xs mb-1 last:mb-0"
                        >
                            <div className="font-bold text-white">{s.identity.p1Name} vs {s.identity.p2Name}</div>
                            <div className="text-gray-500">{s.identity.tournament}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* LE TABLEAU (GodModeTable) */}
      <div className="flex-1 overflow-hidden">
        <GodModeTable 
            report={report} 
            onUpdate={setReport} 
            onSave={() => alert("Analyse sauvegardée en mémoire !")}
        />
      </div>

    </div>
  );
};

// Fonction utilitaire pour avoir un rapport vide propre
const getEmptyReport = (): GodModeReportV2 => ({
  identity: { p1Name: "Joueur 1", p2Name: "Joueur 2", tournament: "Tournoi", surface: "Dur", date: "", time: "", round: "", matchId: `manual-${Date.now()}` },
  p1: {}, p2: {}, h2h: {}, conditions: {}, bookmaker: {}, synthesis: {}, prediction: {}
} as unknown as GodModeReportV2);
