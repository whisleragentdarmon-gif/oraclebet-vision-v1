import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';

// ✅ IMPORTS DU NOUVEAU SYSTÈME GOD MODE
import { GodEngine } from '../engine/market/GodEngine';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReport } from '../engine/types';

import { Globe, Cpu, Zap, CheckCircle2, Lock } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis(); // Mémoire
  
  // Filtre les matchs jouables
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // ✅ On stocke le Rapport Complet ici
  const [currentReport, setCurrentReport] = useState<GodModeReport | null>(null);

  // Auto-sélection
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // Chargement de la mémoire (Persistance)
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        // On vérifie si la sauvegarde est bien un rapport GodMode
        if (saved && saved.identity) {
            setCurrentReport(saved);
        } else {
            setCurrentReport(null);
        }
    }
  }, [selectedMatch]);

  // --- FONCTION GOD MODE ---
  const runGodMode = async () => {
    setIsComputing(true);
    if (selectedMatch) {
        try {
           // 1. APPEL AU MOTEUR CENTRAL (Il fait tout : Google, Météo, Stats)
           const report = await GodEngine.generateReport(selectedMatch);
           
           // 2. SAUVEGARDE
           saveAnalysis(selectedMatch.id, report);
           setCurrentReport(report);
        } catch (e) {
           console.error("Erreur God Mode:", e);
           alert("Erreur lors de la génération du rapport.");
        }
    }
    setIsComputing(false);
  };

  // Gestion de la mise à jour manuelle du tableau
  const handleReportUpdate = (newReport: GodModeReport) => {
      setCurrentReport(newReport);
      if (selectedMatch) {
          saveAnalysis(selectedMatch.id, newReport); // Sauvegarde à chaque frappe
      }
  };

  const getCircuitColor = (c: string) => {
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    if (c.includes('ITF')) return 'text-purple-500';
    return 'text-blue-500';
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* COLONNE GAUCHE : LISTE */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            {activeMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                selected={selectedMatch?.id === match.id} 
                onClick={() => setSelectedMatch(match)} 
                compact 
              />
            ))}
            {activeMatches.length === 0 && <p className="text-gray-500 border border-dashed border-neutral-800 p-4 rounded text-sm">Aucun match à venir.</p>}
          </div>
        </div>

        {/* COLONNE DROITE : TABLEAU GOD MODE */}
        <div className="lg:w-2/3">
          {selectedMatch ? (
            <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto relative">
              
              {/* EN-TÊTE */}
              <div className="flex justify-between items-start mb-4 border-b border-neutral-800 pb-4">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Globe size={14} className={getCircuitColor(selectedMatch.ai?.circuit || 'ATP')} />
                        <span className={`text-xs font-bold ${getCircuitColor(selectedMatch.ai?.circuit || 'ATP')}`}>{selectedMatch.ai?.circuit || 'ATP'}</span>
                        <span className="text-gray-400 text-xs">| {selectedMatch.tournament}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      {selectedMatch.player1.name} <span className="text-neon">vs</span> {selectedMatch.player2.name}
                    </h2>
                 </div>
                 
                 {!currentReport ? (
                   <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 animate-pulse">
                      <Cpu size={20} /> LANCER GOD MODE
                   </button>
                 ) : (
                     <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                         <CheckCircle2 size={14} /> FICHE GÉNÉRÉE
                     </div>
                 )}
              </div>

              {/* 🔒 ECRAN DE VERROUILLAGE */}
              {!currentReport && (
                  <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-neutral-800 rounded-xl bg-black/20 mt-8">
                      <div className="relative">
                          <div className="absolute inset-0 bg-neon/20 blur-xl rounded-full"></div>
                          <Lock size={64} className="text-neon relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white mt-6">FICHE MATCH VERROUILLÉE</h3>
                      <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
                          Lancez le God Mode pour que l'IA scanne le web et remplisse automatiquement la fiche complète (H2H, Météo, Stats).
                      </p>
                  </div>
              )}

              {/* 🔓 TABLEAU ULTIME (GodModeTable) */}
              {currentReport && (
                  <div className="animate-fade-in">
                      {/* On appelle ici le composant TABLEAU MODIFIABLE */}
                      <GodModeTable 
                          report={currentReport} 
                          onUpdate={handleReportUpdate} 
                      />
                      
                      <div className="mt-4 text-center">
                          <p className="text-[10px] text-gray-500 uppercase">Toutes les données sont modifiables manuellement pour affiner la prédiction.</p>
                      </div>
                  </div>
              )}

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl m-4">
                Sélectionnez un match pour commencer.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
