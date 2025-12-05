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

// ✅ AJOUT DE 'Zap' DANS LES IMPORTS
import { Globe, Cpu, CheckCircle2, Lock, Upload, Image as ImageIcon, RotateCcw, Zap } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");

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
        setSaveStatus("");
    }
  }, [selectedMatch]);

  // --- 1. SCAN WEB ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    setIsComputing(true); 
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
       // Calcul Prédiction
       let refined = { confidence: 50, winner: "Analyse...", risk: "HIGH", recoWinner: "-" };
       if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
           // @ts-ignore
           refined = OracleAI.predictor.refinePrediction(report);
       }

       const finalReport: GodModeReportV2 = {
           ...report,
           prediction: {
               ...report.prediction,
               probA: refined.updatedPredictionSection?.probA || "50%",
               probB: refined.updatedPredictionSection?.probB || "50%",
               risk: (refined.risk || "MEDIUM") as string,
               recoWinner: refined.recoWinner || "En attente"
           }
       };

       saveAnalysis(selectedMatch.id, finalReport);
       setCurrentReport(finalReport);

    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération du rapport.");
    }
    
    setIsComputing(false);
  };

  // --- 2. SCAN SCREENSHOT (Nécessaire pour éviter l'erreur TS) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedMatch) return;

    setIsComputing(true);
    try {
        const reportFromImage = await ImageEngine.analyzeScreenshot(file, selectedMatch);
        saveAnalysis(selectedMatch.id, reportFromImage);
        setCurrentReport(reportFromImage);
    } catch (e) {
        console.error("Erreur lecture image", e);
        alert("Impossible de lire l'image.");
    }
    setIsComputing(false);
  };

  const handleReportUpdate = (newReport: GodModeReportV2) => {
      setCurrentReport(newReport);
  };

  // --- 3. SAUVEGARDE ---
  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    try {
      let refined = { confidence: 50, winner: "", risk: "", recoWinner: "", updatedPredictionSection: { probA: "50%", probB: "50%", risk: "MEDIUM", recoWinner: "-" } };
      
      // @ts-ignore
      if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
          // @ts-ignore
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
    } catch (error) { console.error(error); }
  };

  const handleReset = () => {
      if (window.confirm("Effacer les données et relancer une analyse ?")) {
          setCurrentReport(null);
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
      
      {/* Input caché nécessaire */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden">
        
        {/* LISTE GAUCHE */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden">
          <h2 className="text-2xl font-bold mb-2 flex-shrink-0">Matchs Actifs</h2>
          <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
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

        {/* TABLEAU DROITE */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col overflow-hidden bg-surface border border-neutral-800 rounded-2xl shadow-2xl relative">
              
              {/* HEADER */}
              <div className="flex justify-between items-start p-6 border-b border-neutral-800 flex-shrink-0 bg-black/20">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Globe size={14} className={getCircuitColor(selectedMatch.ai?.circuit || 'ATP')} />
                        <span className="text-xs font-bold text-gray-400">| {selectedMatch.tournament}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 truncate">
                      <span className="truncate max-w-[200px]">{selectedMatch.player1.name}</span> 
                      <span className="text-orange-500 text-sm">vs</span> 
                      <span className="truncate max-w-[200px]">{selectedMatch.player2.name}</span>
                    </h2>
                 </div>
                 
                 <div className="flex gap-2 items-center flex-shrink-0">
                   {!currentReport ? (
                     <button 
                       onClick={runGodMode} 
                       disabled={isComputing}
                       className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-purple-500/20 animate-pulse"
                     >
                       <Cpu size={18} /> LANCER GOD MODE
                     </button>
                   ) : (
                       <div className="flex flex-col items-end gap-1">
                           <div className="flex gap-2">
                               <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                                   <CheckCircle2 size={14} /> ANALYSE TERMINÉE
                               </div>
                               <button onClick={handleReset} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-400 transition-colors" title="Réinitialiser">
                                   <RotateCcw size={14}/>
                               </button>
                           </div>
                           {saveStatus && <span className="text-[10px] text-neon animate-pulse mt-1">{saveStatus}</span>}
                       </div>
                   )}
                 </div>
              </div>

              {/* CONTENU */}
              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  {currentReport ? (
                      <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                          <GodModeTable 
                              report={currentReport} 
                              onUpdate={handleReportUpdate}
                              onSave={handleManualSave}
                          />
                          <div className="h-10"></div>
                      </div>
                  ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
                          <div className="border-2 border-dashed border-neutral-800 rounded-xl bg-black/10 p-12 flex flex-col items-center max-w-lg w-full">
                              <div className="relative mb-6">
                                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                                  <Lock size={64} className="text-purple-400 relative z-10" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">ANALYSE REQUISE</h3>
                              <p className="text-sm text-gray-400 text-center mb-6">
                                  Lancez le God Mode pour scanner le web, récupérer le H2H, la météo et les alertes blessure.
                              </p>
                              <button 
                                onClick={runGodMode}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:scale-105 transition-transform"
                              >
                                {/* ✅ UTILISATION CORRECTE DE ZAP */}
                                <Zap size={18}/> DÉVERROUILLER
                              </button>
                          </div>
                      </div>
                  )}
              </div>

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
