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

// Ajout de Save et X pour le modal
import { Globe, Cpu, CheckCircle2, Lock, Upload, Image as ImageIcon, RotateCcw, Zap, Save, X } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  
  // ✅ NOUVEAU : Compteur pour forcer le refresh de GodModeTable
  const [uploadCounter, setUploadCounter] = useState(0);
  
  // AJOUT: state pour le modal
  const [showModal, setShowModal] = useState(false);

  // Créer un rapport vide pour afficher le tableau avant l'analyse
  const getEmptyReport = (): GodModeReportV2 | null => {
    if (!selectedMatch) return null;
    return {
      identity: {
        p1Name: selectedMatch.player1.name,
        p2Name: selectedMatch.player2.name,
        tournament: selectedMatch.tournament,
        surface: selectedMatch.surface || "Hard",
        date: new Date().toISOString()
      },
      p1: {
        rank: "-",
        bestRank: "-",
        ageHeight: "-",
        nationality: "-",
        hand: "-",
        winrateCareer: "-",
        winrateSeason: "-",
        winrateSurface: "-",
        aces: "-",
        doubleFaults: "-",
        firstServe: "-",
        style: "-",
        form: "-",
        injury: "-",
        motivation: "-",
        last5: "-"
      },
      p2: {
        rank: "-",
        bestRank: "-",
        ageHeight: "-",
        nationality: "-",
        hand: "-",
        winrateCareer: "-",
        winrateSeason: "-",
        winrateSurface: "-",
        aces: "-",
        doubleFaults: "-",
        firstServe: "-",
        style: "-",
        form: "-",
        injury: "-",
        motivation: "-",
        last5: "-"
      },
      h2h: {
        global: "-",
        surface: "-",
        advantage: "-",
        lastMatches: "-"
      },
      conditions: {
        weather: "-",
        temp: "-",
        wind: "-",
        altitude: "-"
      },
      bookmaker: {
        oddA: "-",
        oddB: "-",
        movement: "STABLE"
      },
      synthesis: {
        tech: "-",
        mental: "-",
        physical: "-",
        surface: "-",
        momentum: "-",
        xFactor: "-",
        risk: "-"
      },
      prediction: {
        probA: "-",
        probB: "-",
        probOver: "-",
        probTieBreak: "-",
        probUpset: "-",
        risk: "MODERATE",
        recoWinner: "-",
        recoOver: "-",
        recoSet: "-"
      }
    };
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // ✅ NOUVEAU : Réinitialiser le rapport quand on change de match
  useEffect(() => {
    if (selectedMatch) {
      console.log('🔄 Changement de match détecté, nettoyage du rapport');
      setCurrentReport(null);
      setShowModal(false);
    }
  }, [selectedMatch?.id]); // Déclenche quand l'ID du match change

  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        if (saved && saved.identity) {
            setCurrentReport(saved);
        } else {
            setCurrentReport(null);
        }
        setSaveStatus("");
        setShowModal(false); // Fermer le modal
    }
  }, [selectedMatch]);

  // --- 1. SCAN WEB ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    setIsComputing(true); 
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
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
       
       // Ouvrir le modal après 1 seconde
       setTimeout(() => {
         setShowModal(true);
       }, 1000);

    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération du rapport.");
    }
    
    setIsComputing(false);
  };

  // --- 2. SCAN SCREENSHOT ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedMatch) return;

    console.log('========================================');
    console.log('📸 DÉBUT UPLOAD SCREENSHOT');
    console.log('Fichier:', file.name);
    console.log('Match sélectionné:', selectedMatch.id);
    console.log('========================================');
    
    // ✅ FORCER le nettoyage du rapport actuel
    console.log('🧹 Nettoyage currentReport...');
    setCurrentReport(null);
    setShowModal(false);
    
    // ✅ Incrémenter le compteur pour forcer le refresh de GodModeTable
    setUploadCounter(prev => {
      console.log('📊 Compteur upload:', prev, '->', prev + 1);
      return prev + 1;
    });
    
    setIsComputing(true);
    try {
        console.log('🔄 Appel ImageEngine.analyzeScreenshot...');
        const reportFromImage = await ImageEngine.analyzeScreenshot(file, selectedMatch);
        
        console.log('✅ ImageEngine retourné:');
        console.log('  - Joueur 1:', reportFromImage.identity.p1Name);
        console.log('  - Joueur 2:', reportFromImage.identity.p2Name);
        console.log('  - P1 Rank:', reportFromImage.p1.rank);
        console.log('  - P2 Rank:', reportFromImage.p2.rank);
        
        // ✅ CORRECTION : Générer un ID unique basé sur les noms + timestamp
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const uniqueMatchId = `screenshot-${reportFromImage.identity.p1Name.replace(/\s/g, '-')}-vs-${reportFromImage.identity.p2Name.replace(/\s/g, '-')}-${timestamp}-${randomSuffix}`;
        
        console.log('💾 ID unique généré:', uniqueMatchId);
        console.log('💾 Sauvegarde dans AnalysisContext...');
        
        saveAnalysis(uniqueMatchId, reportFromImage);
        
        console.log('✅ setCurrentReport avec nouveau rapport...');
        setCurrentReport(reportFromImage);
        
        console.log('========================================');
        console.log('✅ FIN UPLOAD SCREENSHOT');
        console.log('========================================');
    } catch (e) {
        console.error("❌ Erreur lecture image", e);
        alert("Impossible de lire l'image.");
    }
    setIsComputing(false);
    
    // ✅ Reset le input file pour permettre de réuploader
    if (event.target) event.target.value = '';
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
    } catch (error) { 
      console.error("Erreur handleManualSave:", error); 
      setSaveStatus("❌ Erreur");
    }
  };

  const handleReset = () => {
      setCurrentReport(null);
      setShowModal(false);
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
                   {/* BOUTON GOD MODE - TOUJOURS VISIBLE */}
                   <button 
                     onClick={runGodMode} 
                     disabled={isComputing}
                     className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-purple-500/20"
                   >
                     <Cpu size={18} /> {currentReport ? 'RELANCER' : 'LANCER'} GOD MODE
                   </button>
                   
                   {/* STATUT */}
                   {currentReport && (
                       <div className="flex flex-col items-end gap-1">
                           <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                               <CheckCircle2 size={14} /> ANALYSE OK
                           </div>
                           {saveStatus && <span className="text-[10px] text-neon animate-pulse mt-1">{saveStatus}</span>}
                       </div>
                   )}
                 </div>
              </div>

              {/* CONTENU */}
              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                      {!currentReport && (
                          <div className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                              <div className="flex items-center gap-4">
                                  <Zap className="text-purple-400" size={36} />
                                  <div>
                                      <h3 className="text-xl font-bold text-white">Prêt pour l'analyse</h3>
                                      <p className="text-gray-400 text-sm">Lancez GOD MODE pour analyser et obtenir les prédictions</p>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      <GodModeTable 
                          key={`godmode-${uploadCounter}-${currentReport?.identity.p1Name || 'p1'}-vs-${currentReport?.identity.p2Name || 'p2'}`}
                          report={currentReport || getEmptyReport()} 
                          onUpdate={handleReportUpdate}
                          onSave={handleManualSave}
                      />
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

      {/* AJOUT: MODAL PRÉDICTIONS */}
      {showModal && currentReport && selectedMatch && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-neutral-900 border-2 border-purple-500/50 rounded-2xl max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <Zap className="text-yellow-400" size={32} />
                PRÉDICTIONS IA
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-800 rounded-lg">
                <X className="text-gray-400" size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-blue-500/40">
                  <div className="text-sm text-gray-400 mb-3">PROBABILITÉ DE VICTOIRE</div>
                  <div className="text-6xl font-bold text-blue-400 mb-4">{currentReport.prediction.probA}</div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player1.name}</div>
                </div>
                
                <div className="bg-black/50 rounded-2xl p-8 border-2 border-orange-500/40">
                  <div className="text-sm text-gray-400 mb-3">PROBABILITÉ DE VICTOIRE</div>
                  <div className="text-6xl font-bold text-orange-400 mb-4">{currentReport.prediction.probB}</div>
                  <div className="text-xl text-white font-semibold">{selectedMatch.player2.name}</div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-green-500/40 mb-6">
                <div className="text-sm text-gray-400 mb-3">RECOMMANDATION</div>
                <div className="text-3xl font-bold text-green-400">{currentReport.prediction.recoWinner}</div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border-2 border-yellow-500/40 mb-8">
                <div className="text-sm text-gray-400 mb-3">NIVEAU DE RISQUE</div>
                <div className="text-2xl font-bold text-yellow-400">{currentReport.prediction.risk}</div>
              </div>

              <button 
                onClick={() => {
                  saveAnalysis(selectedMatch.id, currentReport);
                  setShowModal(false);
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-3 text-lg mx-auto"
              >
                <Save size={24}/> ENREGISTRER L'ANALYSE
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
