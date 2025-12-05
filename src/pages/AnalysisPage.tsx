'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';

// IMPORTS MOTEURS
import { GodEngine } from '../engine/market/GodEngine';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReportV2 } from '../engine/types';
import { OracleAI } from '../engine';

import { Globe, Cpu, Zap, Save, X } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

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
  }, [selectedMatch]);

  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    console.log("🚀 DÉBUT runGodMode");
    setIsComputing(true); 
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
       let refined: any = { 
        confidence: 50, 
        winner: "Analyse...", 
        risk: "HIGH", 
        recoWinner: "-", 
        updatedPredictionSection: { 
          probA: "50%", 
          probB: "50%", 
          risk: "MEDIUM", 
          recoWinner: "-" 
        } 
       };
       
       if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
           refined = OracleAI.predictor.refinePrediction(report);
       }

       const finalReport: GodModeReportV2 = {
           ...report,
           prediction: {
               ...report.prediction,
               probA: refined.updatedPredictionSection?.probA || "50%",
               probB: refined.updatedPredictionSection?.probB || "50%",
               risk: (refined.updatedPredictionSection?.risk || "MEDIUM") as string,
               recoWinner: refined.recoWinner || "En attente"
           }
       };
       
       setCurrentReport(finalReport);
       
       setTimeout(() => {
           setShowPredictionsModal(true);
       }, 1500);
       
       console.log("✅ GOD MODE TERMINÉ");

    } catch (e) {
       console.error("❌ ERREUR:", e);
       alert("Erreur lors de la génération du rapport: " + (e instanceof Error ? e.message : String(e)));
    }
    
    setIsComputing(false);
  };

  const handleReportUpdate = (newReport: GodModeReportV2) => {
      setCurrentReport(newReport);
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
      console.error("Erreur sauvegarde:", error);
      setSaveStatus("❌ Erreur");
    }
  };

  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    try {
      let refined: any = { 
        confidence: 50, 
        winner: "", 
        risk: "MEDIUM", 
        recoWinner: "", 
        updatedPredictionSection: { 
          probA: "50%", 
          probB: "50%", 
          risk: "MEDIUM", 
          recoWinner: "-" 
        } 
      };
      
      if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
          refined = OracleAI.predictor.refinePrediction(currentReport);
      }

      const finalReport = {
        ...currentReport,
        prediction: {
          ...currentReport.prediction,
          probA: refined.updatedPredictionSection?.probA || "50%",
          probB: refined.updatedPredictionSection?.probB || "50%",
          risk: refined.updatedPredictionSection?.risk || "MEDIUM",
          recoWinner: refined.recoWinner || "N/A"
        }
      };

      saveAnalysis(selectedMatch.id, finalReport);
      setCurrentReport(finalReport);
      setSaveStatus("✅ IA mise à jour !");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) { 
      console.error("Erreur handleManualSave:", error); 
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

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />

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
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 text-base transition-all shadow-lg"
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

                  {/* TABLEAU (DÉJÀ REMPLI) */}
                  <div className="w-full">
                      <GodModeTable 
                          report={currentReport} 
                          onUpdate={handleReportUpdate}
                          onSave={handleManualSave}
                      />
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
                  <div className={`text-2xl font-bold ${
                      currentReport.prediction.risk === 'FAIBLE' ? 'text-green-400' :
                      currentReport.prediction.risk === 'MOYEN' ? 'text-yellow-400' :
                      'text-red-400'
                  }`}>
                      {currentReport.prediction.risk}
                  </div>
              </div>

              {/* BOUTON ENREGISTRER */}
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
    </>
  );
};
