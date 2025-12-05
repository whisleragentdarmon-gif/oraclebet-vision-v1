'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Cpu, Zap, Save, X } from 'lucide-react';

// ✅ ÉTAPE 1 : Import du contexte data
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';

// ✅ ÉTAPE 2 : Import des types (ne devrait pas causer de problème)
import type { Match } from '../types';

// ✅ ÉTAPE 3 : Import des composants simples
import { MatchCard } from '../components/MatchCard';

// ⚠️ COMPOSANTS POTENTIELLEMENT PROBLÉMATIQUES - On les importe après
// import { OracleReactor } from '../components/OracleReactor';
// import { GodModeTable } from '../components/GodModeTable';
// import { GodEngine } from '../engine/market/GodEngine';
// import { OracleAI } from '../engine';

// FALLBACK pour OracleReactor
const OracleReactor: React.FC<{ isVisible: boolean; onComplete?: () => void }> = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="text-white text-2xl animate-pulse">🔮 Analyse en cours...</div>
    </div>
  );
};

// FALLBACK pour GodModeTable
const GodModeTable: React.FC<{ report: any; onUpdate?: any; onSave?: any }> = ({ report }) => {
  return (
    <div className="bg-neutral-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">📊 Tableau d'analyse</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-900 rounded">
            <div className="text-sm text-gray-400 mb-2">Joueur 1</div>
            <div className="text-lg font-bold text-white">
              {report?.identity?.p1Name || 'En attente...'}
            </div>
          </div>
          <div className="p-4 bg-neutral-900 rounded">
            <div className="text-sm text-gray-400 mb-2">Joueur 2</div>
            <div className="text-lg font-bold text-white">
              {report?.identity?.p2Name || 'En attente...'}
            </div>
          </div>
        </div>
        
        {report ? (
          <div className="text-green-400 text-sm">✅ Données chargées</div>
        ) : (
          <div className="text-gray-500 text-sm italic">
            Cliquez sur "LANCER GOD MODE" pour analyser le match
          </div>
        )}
      </div>
    </div>
  );
};

export const AnalysisPage: React.FC = () => {
  console.log('🎯 AnalysisPage: Rendu commencé');

  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(activeMatches[0]);
    }
  }, [matches.length]);

  useEffect(() => {
    if (selectedMatch) {
      const saved = getAnalysis(selectedMatch.id);
      if (saved && saved.identity) {
        setCurrentReport(saved);
      } else {
        setCurrentReport(null);
      }
      setShowPredictionsModal(false);
      setSaveStatus("");
    }
  }, [selectedMatch?.id]);

  // ⚠️ VERSION SIMPLIFIÉE DE GOD MODE (sans les vrais imports)
  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    setIsComputing(true);
    
    try {
      // Simulation pour tester l'UI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockReport = {
        identity: {
          p1Name: selectedMatch.player1.name,
          p2Name: selectedMatch.player2.name,
          tournament: selectedMatch.tournament,
        },
        p1: {},
        p2: {},
        h2h: {},
        prediction: {
          probA: "55%",
          probB: "45%",
          risk: "MOYEN",
          recoWinner: selectedMatch.player1.name + " en 2 sets"
        }
      };
      
      setCurrentReport(mockReport);
      
      setTimeout(() => {
        setShowPredictionsModal(true);
      }, 500);

    } catch (e) {
      console.error('❌ Erreur GOD MODE:', e);
      alert('Erreur: ' + (e instanceof Error ? e.message : String(e)));
    }
    
    setIsComputing(false);
  };

  const handleSaveAnalysis = () => {
    if (!currentReport || !selectedMatch) return;
    
    try {
      saveAnalysis(selectedMatch.id, currentReport);
      setSaveStatus("✅ Analyse enregistrée !");
      setTimeout(() => {
        setSaveStatus("");
        setShowPredictionsModal(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus("❌ Erreur");
    }
  };

  const getCircuitColor = (c: string) => {
    if (!c) return 'text-blue-500';
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    if (c.includes('ITF')) return 'text-purple-500';
    return 'text-blue-500';
  };

  console.log('🎯 AnalysisPage: Rendu terminé, matchs actifs:', activeMatches.length);

  return (
    <>
      <OracleReactor isVisible={isComputing} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* LISTE GAUCHE - MATCHS */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0">
          <h2 className="text-2xl font-bold">Matchs Actifs</h2>
          <div className="overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {activeMatches.map((match) => (
              <MatchCard 
                key={match.id}
                match={match}
                selected={selectedMatch?.id === match.id}
                onClick={() => setSelectedMatch(match)}
                compact
              />
            ))}
            {activeMatches.length === 0 && (
              <div className="text-gray-500 border border-dashed border-neutral-800 p-4 rounded text-sm text-center">
                Aucun match actif.
              </div>
            )}
          </div>
        </div>

        {/* ZONE PRINCIPALE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col bg-surface border border-neutral-800 rounded-2xl shadow-2xl">
              
              {/* HEADER */}
              <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-black/20 flex-shrink-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={14} className={getCircuitColor(selectedMatch.ai?.circuit || 'ATP')} />
                    <span className="text-xs font-bold text-gray-400">| {selectedMatch.tournament}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{selectedMatch.player1.name}</span>
                    <span className="text-orange-500 text-sm">vs</span>
                    <span className="truncate max-w-[200px]">{selectedMatch.player2.name}</span>
                  </h2>
                </div>
              </div>

              {/* CONTENU */}
              <div className="flex-1 overflow-y-auto bg-neutral-950 p-6">
                
                {/* MESSAGE + BOUTON GOD MODE */}
                <div className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Zap className="text-purple-400" size={36} />
                    <div>
                      <h3 className="text-xl font-bold text-white">Prêt pour l'analyse</h3>
                      <p className="text-gray-400 text-sm">Lancez GOD MODE pour analyser et obtenir les prédictions</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={runGodMode}
                    disabled={isComputing}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 text-base transition-all shadow-lg shadow-purple-500/20"
                  >
                    {isComputing ? (
                      <>
                        <Cpu size={20} className="animate-spin" /> ANALYSE...
                      </>
                    ) : (
                      <>
                        <Cpu size={20} /> LANCER GOD MODE
                      </>
                    )}
                  </button>
                </div>

                {/* TABLEAU */}
                <div className="w-full">
                  <GodModeTable report={currentReport} />
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl">
              Sélectionnez un match pour commencer.
            </div>
          )}
        </div>
      </div>

      {/* MODAL PRÉDICTIONS */}
      {showPredictionsModal && currentReport && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-purple-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* HEADER MODAL */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <Zap className="text-yellow-400" size={32} />
                PRÉDICTIONS IA
              </h3>
              <button 
                onClick={() => setShowPredictionsModal(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="text-gray-400" size={24} />
              </button>
            </div>

            {/* CONTENU MODAL */}
            <div className="p-8">
              
              {/* PROBABILITÉS */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-blue-500/40">
                  <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Probabilité de victoire</div>
                  <div className="text-6xl font-bold text-blue-400 mb-4">
                    {currentReport.prediction.probA}
                  </div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player1.name}</div>
                </div>
                
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-orange-500/40">
                  <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Probabilité de victoire</div>
                  <div className="text-6xl font-bold text-orange-400 mb-4">
                    {currentReport.prediction.probB}
                  </div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player2.name}</div>
                </div>
              </div>
              
              {/* RECOMMANDATION */}
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-green-500/40 mb-6">
                <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Recommandation</div>
                <div className="text-3xl font-bold text-green-400">
                  {currentReport.prediction.recoWinner}
                </div>
              </div>
              
              {/* RISQUE */}
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-yellow-500/40 mb-8">
                <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Niveau de risque</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {currentReport.prediction.risk}
                </div>
              </div>

              {/* BOUTON ENREGISTRER */}
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleSaveAnalysis}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-3 text-lg transition-all shadow-lg shadow-green-500/20 w-full max-w-md justify-center"
                >
                  <Save size={24}/> ENREGISTRER L'ANALYSE
                </button>
                
                {saveStatus && (
                  <div className="text-lg font-semibold animate-pulse">
                    {saveStatus}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
