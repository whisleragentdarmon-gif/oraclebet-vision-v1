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
import { ImageEngine } from '../engine/ImageEngine'; // Assure-toi que c'est bien la version "BANNED_WORDS" que je t'ai donnée
import { GodModeReportV2 } from '../engine/types';
import { OracleAI } from '../engine';

// Icons
import { Globe, Cpu, Save, X, Zap } from 'lucide-react';

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
    // Sélectionne le premier match par défaut si rien n'est sélectionné au démarrage
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // Quand on change de match dans la sidebar
  useEffect(() => {
    if (selectedMatch) {
        // On regarde si on a déjà une analyse sauvegardée
        const saved = getAnalysis(selectedMatch.id);
        
        // On reset l'affichage pour éviter de montrer les données du match précédent
        if (saved && saved.identity) {
            setCurrentReport(saved);
        } else {
            setCurrentReport(null);
        }
        
        setSaveStatus("");
        setShowModal(false);
        // On incrémente le compteur pour être sûr que React redessine le tableau à zéro
        setUploadCounter(prev => prev + 1);
    }
  }, [selectedMatch?.id]); 

  // --- 1. SCAN WEB (GOD MODE) ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    
    setIsComputing(true); 
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       
       // Simulation/Raffinement via OracleAI si disponible
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
       setUploadCounter(c => c + 1); // Force refresh
       
       setTimeout(() => {
         setShowModal(true);
       }, 1000);

    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération du rapport.");
    }
    
    setIsComputing(false);
  };

  // --- 2. SCAN SCREENSHOT (UPLOAD CORRIGÉ & BLINDÉ) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📸 DÉBUT UPLOAD SCREENSHOT');
    
    // ÉTAPE 1 : Nettoyage immédiat de l'interface (Ecran noir)
    setIsComputing(true);
    setCurrentReport(null); 
    setShowModal(false);
    
    // Petit délai pour laisser React faire le vide visuellement
    await new Promise(r => setTimeout(r, 150));

    try {
        // ÉTAPE 2 : Analyse via ImageEngine
        // IMPORTANT : On passe 'null' en 2ème argument pour dire "Oublie le match d'avant"
        // Cela force l'OCR à ne se baser QUE sur l'image
        const reportFromImage = await ImageEngine.analyzeScreenshot(file, null);
        
        console.log('✅ Données reçues:', reportFromImage.identity.p1Name, 'vs', reportFromImage.identity.p2Name);

        // ÉTAPE 3 : Gestion de l'ID de sauvegarde
        // Si un match est sélectionné dans la liste, on écrase ses données.
        // Sinon, on crée un ID temporaire.
        const targetId = selectedMatch ? selectedMatch.id : `scan-${Date.now()}`;
        
        // On sauvegarde dans le contexte
        saveAnalysis(targetId, reportFromImage);
        
        // ÉTAPE 4 : Mise à jour de l'état
        setCurrentReport(reportFromImage);
        
        // CRUCIAL : On incrémente le compteur.
        // Grâce à la prop "key" dans le tableau, React va DÉTRUIRE l'ancien tableau et en CRÉER un nouveau.
        // C'est ce qui règle le bug des "données qui restent en mémoire".
        setUploadCounter(prev => prev + 1); 

    } catch (e) {
        console.error("❌ Erreur lecture image", e);
        alert("Impossible de lire l'image. Vérifiez qu'elle est nette.");
    } finally {
        setIsComputing(false);
        // ÉTAPE 5 : Reset de l'input file 
        // Permet de ré-uploader exactement la même image si on veut réessayer
        if (event.target) event.target.value = '';
    }
  };

  const handleReportUpdate = (newReport: GodModeReportV2) => {
      setCurrentReport(newReport);
  };

  // --- 3. SAUVEGARDE MANUELLE ---
  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    try {
      // Logique simple de raffinement avant sauvegarde
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

  // Helper couleur circuit
  const getCircuitColor = (c: string) => {
    if (!c) return 'text-blue-500';
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    if (c.includes('ITF')) return 'text-purple-500';
    return 'text-blue-500';
  };

  // Génération d'un rapport vide par défaut
  const getEmptyReport = (): GodModeReportV2 => {
    return {
      identity: { p1Name: 'Joueur 1', p2Name: 'Joueur 2', tournament: '-', surface: '-', date: '', time: '' },
      p1: { rank: '-', form: '-' },
      p2: { rank: '-', form: '-' },
      h2h: {},
      conditions: {},
      bookmaker: {},
      synthesis: {},
      prediction: { probA: '-', probB: '-', risk: 'LOW', recoWinner: '-' }
    } as any;
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />
      
      {/* Input file caché mais connecté */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden">
        
        {/* LISTE GAUCHE (SIDEBAR) */}
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

        {/* TABLEAU DROITE (MAIN) */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col overflow-hidden bg-surface border border-neutral-800 rounded-2xl shadow-2xl relative">
              
              {/* HEADER DU TABLEAU */}
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
                    {/* BOUTON UPLOAD SCREENSHOT */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isComputing}
                      className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-all border border-neutral-700"
                    >
                      📸 SCAN IMAGE
                    </button>

                    {/* BOUTON GOD MODE */}
                    <button 
                      onClick={runGodMode} 
                      disabled={isComputing}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-purple-500/20"
                    >
                      <Cpu size={18} /> {currentReport ? 'RELANCER' : 'LANCER'} GOD MODE
                    </button>
                    
                    {/* STATUT SAVE */}
                    {currentReport && saveStatus && (
                         <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold animate-pulse">
                            {saveStatus}
                         </div>
                    )}
                  </div>
              </div>

              {/* CONTENU TABLEAU */}
              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                      
                      {/* Message d'attente si pas de rapport */}
                      {!currentReport && (
                          <div className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 flex items-center gap-4">
                              <Zap className="text-purple-400" size={36} />
                              <div>
                                  <h3 className="text-xl font-bold text-white">Prêt pour l'analyse</h3>
                                  <p className="text-gray-400 text-sm">Lancez GOD MODE ou Scannez un Screenshot pour commencer.</p>
                              </div>
                          </div>
                      )}
                      
                      {/* Rendu du Tableau (GodModeTable) */}
                      {(() => {
                        const reportToUse = currentReport || getEmptyReport();
                        
                        // --- ASTUCE CLÉ POUR FORCER LE RESET DES INPUTS ---
                        // En incluant 'uploadCounter' dans la key, React va détruire l'ancien tableau
                        // et en créer un tout neuf à chaque nouvel upload.
                        // Plus de données fantômes !
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

      {/* MODAL PRÉDICTIONS (Popup après analyse) */}
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

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-black/50 p-6 rounded-2xl border border-blue-500/30">
                        <div className="text-gray-400 text-sm mb-2">VICTOIRE {currentReport.identity.p1Name}</div>
                        <div className="text-5xl font-bold text-blue-400">{currentReport.prediction.probA}</div>
                    </div>
                    <div className="bg-black/50 p-6 rounded-2xl border border-orange-500/30">
                        <div className="text-gray-400 text-sm mb-2">VICTOIRE {currentReport.identity.p2Name}</div>
                        <div className="text-5xl font-bold text-orange-400">{currentReport.prediction.probB}</div>
                    </div>
                </div>

                <div className="bg-neutral-800/50 p-4 rounded-xl mb-8">
                    <div className="text-gray-400 text-sm mb-1">CONSEIL DE L'ORACLE</div>
                    <div className="text-2xl font-bold text-green-400">{currentReport.prediction.recoWinner}</div>
                    <div className="text-sm text-yellow-500 mt-2 font-mono">RISQUE: {currentReport.prediction.risk}</div>
                </div>

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
