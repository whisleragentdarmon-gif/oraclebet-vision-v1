'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Cpu, Zap, Save, X } from 'lucide-react';

// ✅ IMPORTS AVEC TRY/CATCH
let useData: any = () => ({ matches: [] });
let useAnalysis: any = () => ({ saveAnalysis: () => {}, getAnalysis: () => null });
let MatchCard: any = ({ match, selected, onClick, compact }: any) => (
  <div onClick={onClick} className={`p-3 rounded-lg border ${selected ? 'bg-purple-900/30 border-purple-500' : 'bg-neutral-800 border-neutral-700'} cursor-pointer`}>
    <div className="font-bold">{match.player1?.name || 'Joueur 1'} vs {match.player2?.name || 'Joueur 2'}</div>
  </div>
);
let OracleReactor: any = ({ isVisible }: any) => isVisible ? <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"><div className="text-white text-2xl animate-pulse">Analyse en cours...</div></div> : null;
let GodModeTable: any = ({ report }: any) => (
  <div className="bg-neutral-800 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-4">Tableau d'analyse</h3>
    <div className="text-gray-400">
      {report ? 'Données chargées' : 'En attente des données...'}
    </div>
  </div>
);
let GodEngine: any = { 
  generateReportV2: async () => ({ 
    identity: {}, 
    p1: {}, 
    p2: {}, 
    h2h: {}, 
    prediction: { probA: '50%', probB: '50%', risk: 'MOYEN', recoWinner: 'À définir' } 
  }) 
};
let OracleAI: any = { predictor: null };

try {
  const DataContext = require('../context/DataContext');
  useData = DataContext.useData;
} catch (e) {
  console.warn('DataContext non trouvé, utilisation du fallback');
}

try {
  const AnalysisContext = require('../context/AnalysisContext');
  useAnalysis = AnalysisContext.useAnalysis;
} catch (e) {
  console.warn('AnalysisContext non trouvé, utilisation du fallback');
}

try {
  const MatchCardModule = require('../components/MatchCard');
  MatchCard = MatchCardModule.MatchCard;
} catch (e) {
  console.warn('MatchCard non trouvé, utilisation du fallback');
}

try {
  const OracleReactorModule = require('../components/OracleReactor');
  OracleReactor = OracleReactorModule.OracleReactor;
} catch (e) {
  console.warn('OracleReactor non trouvé, utilisation du fallback');
}

try {
  const GodModeTableModule = require('../components/GodModeTable');
  GodModeTable = GodModeTableModule.GodModeTable;
} catch (e) {
  console.warn('GodModeTable non trouvé, utilisation du fallback');
}

try {
  const GodEngineModule = require('../engine/market/GodEngine');
  GodEngine = GodEngineModule.GodEngine;
} catch (e) {
  console.warn('GodEngine non trouvé, utilisation du fallback');
}

try {
  const OracleAIModule = require('../engine');
  OracleAI = OracleAIModule.OracleAI;
} catch (e) {
  console.warn('OracleAI non trouvé, utilisation du fallback');
}

export const AnalysisPage: React.FC = () => {
  console.log('🎯 AnalysisPage: Début du rendu');
  
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  // ✅ SÉCURISATION DES CONTEXTS
  let contextMatches: any[] = [];
  let saveAnalysis: any = () => {};
  let getAnalysis: any = () => null;

  try {
    const dataContext = useData();
    contextMatches = dataContext?.matches || [];
  } catch (e) {
    console.warn('useData() erreur:', e);
  }

  try {
    const analysisContext = useAnalysis();
    saveAnalysis = analysisContext?.saveAnalysis || (() => {});
    getAnalysis = analysisContext?.getAnalysis || (() => null);
  } catch (e) {
    console.warn('useAnalysis() erreur:', e);
  }

  const activeMatches = contextMatches.filter((m: any) => m?.status !== 'FINISHED');

  useEffect(() => {
    console.log('📊 Matchs actifs:', activeMatches.length);
    setMatches(activeMatches);
    if (activeMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(activeMatches[0]);
    }
  }, [contextMatches.length]);

  useEffect(() => {
    if (selectedMatch) {
      try {
        const saved = getAnalysis(selectedMatch.id);
        if (saved?.identity) {
          setCurrentReport(saved);
        } else {
          setCurrentReport(null);
        }
        setShowPredictionsModal(false);
        setSaveStatus("");
      } catch (e) {
        console.error('Erreur getAnalysis:', e);
      }
    }
  }, [selectedMatch?.id]);

  const runGodMode = async () => {
    if (!selectedMatch) {
      alert('Aucun match sélectionné');
      return;
    }
    
    console.log('🚀 GOD MODE: Début');
    setIsComputing(true);
    
    try {
      const report = await GodEngine.generateReportV2(
        selectedMatch.player1?.name || 'Joueur 1',
        selectedMatch.player2?.name || 'Joueur 2',
        selectedMatch.tournament || 'Tournoi'
      );
      
      let refined: any = {
        confidence: 50,
        winner: "En attente",
        risk: "MOYEN",
        recoWinner: "À définir",
        updatedPredictionSection: {
          probA: "50%",
          probB: "50%",
          risk: "MOYEN",
          recoWinner: "À définir"
        }
      };
      
      if (OracleAI?.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
        try {
          refined = OracleAI.predictor.refinePrediction(report);
        } catch (e) {
          console.warn('Erreur refinePrediction:', e);
        }
      }

      const finalReport = {
        ...report,
        prediction: {
          probA: refined.updatedPredictionSection?.probA || "50%",
          probB: refined.updatedPredictionSection?.probB || "50%",
          risk: refined.updatedPredictionSection?.risk || "MOYEN",
          recoWinner: refined.recoWinner || "À définir"
        }
      };
      
      setCurrentReport(finalReport);
      
      setTimeout(() => {
        setShowPredictionsModal(true);
      }, 1500);
      
      console.log('✅ GOD MODE: Terminé');

    } catch (e) {
      console.error('❌ Erreur GOD MODE:', e);
      alert('Erreur lors de l\'analyse: ' + (e instanceof Error ? e.message : String(e)));
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

  console.log('🎯 AnalysisPage: Rendu OK');

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <OracleReactor isVisible={isComputing} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* LISTE GAUCHE */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0">
          <h2 className="text-2xl font-bold">Matchs Actifs</h2>
          <div className="overflow-y-auto pr-2 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {matches.length > 0 ? (
              matches.map((match: any, index: number) => (
                <MatchCard 
                  key={match?.id || index}
                  match={match}
                  selected={selectedMatch?.id === match?.id}
                  onClick={() => setSelectedMatch(match)}
                  compact
                />
              ))
            ) : (
              <div className="text-gray-500 border border-dashed border-neutral-800 p-4 rounded text-sm text-center">
                Aucun match actif
              </div>
            )}
          </div>
        </div>

        {/* ZONE PRINCIPALE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl">
              
              {/* HEADER */}
              <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-black/20 flex-shrink-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={14} className={getCircuitColor(selectedMatch.ai?.circuit || 'ATP')} />
                    <span className="text-xs font-bold text-gray-400">| {selectedMatch.tournament || 'Tournoi'}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{selectedMatch.player1?.name || 'Joueur 1'}</span>
                    <span className="text-orange-500 text-sm">vs</span>
                    <span className="truncate max-w-[200px]">{selectedMatch.player2?.name || 'Joueur 2'}</span>
                  </h2>
                </div>
              </div>

              {/* CONTENU */}
              <div className="flex-1 overflow-y-auto bg-neutral-950 p-6">
                
                {/* MESSAGE + BOUTON */}
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
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg"
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
              Sélectionnez un match pour commencer
            </div>
          )}
        </div>
      </div>

      {/* MODAL PRÉDICTIONS */}
      {showPredictionsModal && currentReport && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-purple-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900">
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

            <div className="p-8">
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-blue-500/40">
                  <div className="text-sm text-gray-400 mb-3">Probabilité de victoire</div>
                  <div className="text-6xl font-bold text-blue-400 mb-4">
                    {currentReport.prediction?.probA || '50%'}
                  </div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player1?.name}</div>
                </div>
                
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-orange-500/40">
                  <div className="text-sm text-gray-400 mb-3">Probabilité de victoire</div>
                  <div className="text-6xl font-bold text-orange-400 mb-4">
                    {currentReport.prediction?.probB || '50%'}
                  </div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player2?.name}</div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-green-500/40 mb-6">
                <div className="text-sm text-gray-400 mb-3">Recommandation</div>
                <div className="text-3xl font-bold text-green-400">
                  {currentReport.prediction?.recoWinner || 'À définir'}
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-yellow-500/40 mb-8">
                <div className="text-sm text-gray-400 mb-3">Niveau de risque</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {currentReport.prediction?.risk || 'MOYEN'}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleSaveAnalysis}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-3 text-lg transition-all shadow-lg w-full max-w-md justify-center"
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
    </div>
  );
};
