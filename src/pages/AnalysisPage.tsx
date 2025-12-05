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

import { Globe, Cpu, CheckCircle2, RotateCcw, Zap } from 'lucide-react';

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
    
    console.log("🚀 DÉBUT runGodMode pour:", selectedMatch.player1.name, "vs", selectedMatch.player2.name);
    setIsComputing(true); 
    
    try {
       console.log("📡 Appel GodEngine.generateReportV2...");
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
       console.log("📊 RAPPORT BRUT REÇU:", report);
       console.log("📊 Structure du rapport:", {
         hasIdentity: !!report?.identity,
         hasP1: !!report?.p1,
         hasP2: !!report?.p2,
         hasH2H: !!report?.h2h,
         hasPrediction: !!report?.prediction
       });
       
       // Calcul Prédiction
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
       
       console.log("🤖 Vérification OracleAI.predictor...");
       if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
           console.log("✅ predictor disponible, calcul de la prédiction...");
           refined = OracleAI.predictor.refinePrediction(report);
           console.log("🎯 REFINED PREDICTION:", refined);
       } else {
           console.warn("⚠️ OracleAI.predictor NON DISPONIBLE");
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

       console.log("💾 FINAL REPORT:", finalReport);
       
       saveAnalysis(selectedMatch.id, finalReport);
       setCurrentReport(finalReport);
       console.log("✅ GOD MODE TERMINÉ AVEC SUCCÈS!");

    } catch (e) {
       console.error("❌ ERREUR dans runGodMode:", e);
       alert("Erreur lors de la génération du rapport: " + (e instanceof Error ? e.message : String(e)));
    }
    
    setIsComputing(false);
  };

  // --- 2. SCAN SCREENSHOT ---
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

  const handleReset = () => {
      // ❌ SUPPRESSION DU POPUP CONFIRM - RESET DIRECT
      setCurrentReport(null);
      setSaveStatus("");
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
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      {/* ✅ LAYOUT CORRIGÉ - STRUCTURE PROPRE */}
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* LISTE GAUCHE */}
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

        {/* ZONE PRINCIPALE DROITE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col bg-surface border border-neutral-800 rounded-2xl shadow-2xl">
              
              {/* ✅ HEADER FIXE AVEC BOUTON GOD MODE TOUJOURS VISIBLE */}
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
                 
                 {/* ✅ BOUTONS TOUJOURS VISIBLES */}
                 <div className="flex gap-2 items-center flex-shrink-0">
                   {currentReport && (
                       <button 
                         onClick={handleReset} 
                         className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-400 transition-colors" 
                         title="Réinitialiser"
                       >
                           <RotateCcw size={16}/>
                       </button>
                   )}
                   
                   <button 
                     onClick={runGodMode} 
                     disabled={isComputing}
                     className={`${currentReport ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500 animate-pulse'} disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg`}
                   >
                     {isComputing ? (
                       <>
                         <Cpu size={18} className="animate-spin" /> ANALYSE...
                       </>
                     ) : (
                       <>
                         {currentReport ? <Zap size={18} /> : <Cpu size={18} />}
                         {currentReport ? 'RE-ANALYSER' : 'LANCER GOD MODE'}
                       </>
                     )}
                   </button>
                   
                   {saveStatus && (
                     <span className="text-xs text-green-400 animate-pulse ml-2">
                       {saveStatus}
                     </span>
                   )}
                 </div>
              </div>

              {/* ✅ ZONE DE CONTENU - SANS SUPERPOSITION */}
              <div className="flex-1 overflow-y-auto bg-neutral-950 p-6">
                  {currentReport ? (
                      <div className="w-full">
                          <GodModeTable 
                              report={currentReport} 
                              onUpdate={handleReportUpdate}
                              onSave={handleManualSave}
                          />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="border-2 border-dashed border-neutral-800 rounded-xl bg-black/10 p-12 flex flex-col items-center max-w-lg">
                              <div className="mb-6">
                                  <Zap size={64} className="text-purple-400" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">Prêt pour l'analyse</h3>
                              <p className="text-sm text-gray-400 text-center">
                                  Cliquez sur "LANCER GOD MODE" pour récupérer les données et générer les prédictions.
                              </p>
                          </div>
                      </div>
                  )}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                Sélectionnez un match pour commencer.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
