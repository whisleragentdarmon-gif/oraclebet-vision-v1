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

// Icons
import { Globe, Cpu, CheckCircle2, Save, X, Zap } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  
  // Compteur CRUCIAL pour forcer le re-rendu complet du tableau et vider la mémoire visuelle
  const [uploadCounter, setUploadCounter] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- GESTION DU MATCH SÉLECTIONNÉ ---

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
        setShowModal(false);
        setUploadCounter(prev => prev + 1);
    }
  }, [selectedMatch?.id]); 

  // --- 1. SCAN WEB (GOD MODE) ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    setIsComputing(true); 
    setCurrentReport(null); // Reset visuel
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
       let refined: any = { 
        confidence: 50, 
        winner: "Analyse...", 
        risk: "HIGH", 
        updatedPredictionSection: { probA: "50%", probB: "50%", risk: "MEDIUM", recoWinner: "-" } 
       };
       
       // @ts-ignore
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
               risk: (refined.updatedPredictionSection?.risk || "MEDIUM") as string,
               recoWinner: refined.recoWinner || "En attente"
           }
       };

       saveAnalysis(selectedMatch.id, finalReport);
       setCurrentReport(finalReport);
       setUploadCounter(c => c + 1); 
       
       setTimeout(() => {
         setShowModal(true);
       }, 1000);

    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération du rapport.");
    }
    
    setIsComputing(false);
  };

  // --- 2. SCAN SCREENSHOT (UPLOAD CORRIGÉ) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📸 DÉBUT UPLOAD SCREENSHOT');
    
    setIsComputing(true);
    setCurrentReport(null); 
    setShowModal(false);
    
    await new Promise(r => setTimeout(r, 150));

    try {
        const reportFromImage = await ImageEngine.analyzeScreenshot(file, null);
        
        console.log('✅ Données reçues:', reportFromImage.identity.p1Name);

        const targetId = selectedMatch ? selectedMatch.id : `scan-${Date.now()}`;
        saveAnalysis(targetId, reportFromImage);
        
        setCurrentReport(reportFromImage);
        setUploadCounter(prev => prev + 1); 

    } catch (e) {
        console.error("❌ Erreur lecture image", e);
        alert("Impossible de lire l'image. Vérifiez qu'elle est nette.");
    } finally {
        setIsComputing(false);
        if (event.target) event.target.value = '';
    }
  };

  const handleReportUpdate = (newReport: GodModeReportV2) => {
      setCurrentReport(newReport);
  };

  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    try {
      let refinedRisk = "MEDIUM";
      // @ts-ignore
      if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
           // @ts-ignore
          const refined = OracleAI.predictor.refinePrediction(currentReport);
          refinedRisk = refined.updatedPredictionSection?.risk || "MEDIUM";
      }

      const finalReport = {
        ...currentReport,
        prediction: {
          ...currentReport.prediction,
          risk: refinedRisk
        }
      };

      saveAnalysis(selectedMatch.id, finalReport);
      setCurrentReport(finalReport);
      setSaveStatus("✅ Sauvegardé !");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) { 
      console.error("Erreur Save:", error); 
      setSaveStatus("❌ Erreur");
    }
  };

  const getCircuitColor = (c: string) => {
    if (!c) return 'text-blue-500';
    if (c.includes('WTA')) return 'text-pink-500';
    return 'text-blue-500';
  };

  const getEmptyReport = (): GodModeReportV2 => {
    return {
      identity: { p1Name: 'Joueur 1', p2Name: 'Joueur 2', tournament: '-', surface: '-', date: '', time: '' },
      p1: { rank: '-', form: '-' },
      p2: { rank: '-', form: '-' },
      h2h: {}, conditions: {}, bookmaker: {}, synthesis: {}, prediction: { probA: '-', probB: '-', risk: 'LOW', recoWinner: '-' }
    } as any;
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden">
        
        {/* SIDEBAR */}
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
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col overflow-hidden bg-surface border border-neutral-800 rounded-2xl shadow-2xl relative">
              
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
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isComputing}
                      className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm border border-neutral-700"
                    >
                      📸 SCAN IMAGE
                    </button>

                    <button 
                      onClick={runGodMode} 
                      disabled={isComputing}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-purple-500/20"
                    >
                      <Cpu size={18} /> GOD MODE
                    </button>
                    
                    {currentReport && saveStatus && (
                         <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold animate-pulse">
                            {saveStatus}
                         </div>
                    )}
                  </div>
              </div>

              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                      
                      {!currentReport && (
                          <div className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 flex items-center gap-4">
                              <Zap className="text-purple-400" size={36} />
                              <div>
                                  <h3 className="text-xl font-bold text-white">Prêt pour l'analyse</h3>
                                  <p className="text-gray-400 text-sm">Lancez GOD MODE ou Scannez un Screenshot.</p>
                              </div>
                          </div>
                      )}
                      
                      {(() => {
                        const reportToUse = currentReport || getEmptyReport();
                        const dynamicKey = `godmode-reset-${uploadCounter}-${selectedMatch.id}`;
                        
                        return (
                          <GodModeTable 
                              key={dynamicKey}
                              report={reportToUse} 
                              onUpdate={handleReportUpdate}
                              onSave={handleManualSave}
                          />
                        );
                      })()}
                      <div className="h-10"></div>
                  </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl m-4">
                Sélectionnez un match pour commencer.
            </div>
          )}
        </div>
      </div>

      {showModal && currentReport && selectedMatch && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-neutral-900 border-2 border-purple-500/50 rounded-2xl max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded-lg">
                <X className="text-gray-400" size={24} />
            </button>
            <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
                   <Zap className="text-yellow-400" /> PRÉDICTIONS IA
                </h3>
                <button 
                  onClick={() => { saveAnalysis(selectedMatch.id, currentReport); setShowModal(false); }}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 mx-auto"
                >
                  <Save size={20}/> ENREGISTRER ET FERMER
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
