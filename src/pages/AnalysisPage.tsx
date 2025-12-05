'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';

// IMPORTS DES MOTEURS
import { GodEngine } from '../engine/market/GodEngine';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReportV2 } from '../engine/types';
import { OracleAI } from '../engine';

import { Globe, Cpu, CheckCircle2, Lock, Upload, Image as ImageIcon } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  // Filtre les matchs jouables
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-sélection du premier match si aucun sélectionné
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]); // On garde la dépendance sur 'matches'

  // Chargement de la mémoire (Persistance)
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
  }, [selectedMatch]); // On ne déclenche que si le match change

  // --- 1. SCAN WEB ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    setIsComputing(true);
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       saveAnalysis(selectedMatch.id, report);
       setCurrentReport(report);
    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération du rapport Web");
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

  // Mise à jour locale (à chaque frappe)
  const handleReportUpdate = (newReport: GodModeReportV2) => {
      setCurrentReport(newReport);
  };

  // --- 3. SAUVEGARDE ET RE-CALCUL IA ---
  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;

    try {
      let refinedPrediction = { 
          confidence: 50, 
          winner: currentReport.identity.p1Name, 
          risk: 'MEDIUM',
          recoWinner: 'Analyse en cours...'
      };

      // Protection contre l'absence du moteur
      if (OracleAI.predictor && typeof OracleAI.predictor.refinePrediction === 'function') {
          // @ts-ignore : On ignore l'erreur de type potentielle si les types ne sont pas encore sync
          refinedPrediction = OracleAI.predictor.refinePrediction(currentReport);
      } else {
          console.warn("⚠️ Fonction refinePrediction introuvable, sauvegarde simple.");
      }

      // Mise à jour du rapport avec la nouvelle prédiction
      const finalReport: GodModeReportV2 = {
        ...currentReport,
        prediction: {
          ...currentReport.prediction,
          confidence: refinedPrediction.confidence?.toString() || "50%",
          risk: (refinedPrediction.risk || "MEDIUM") as string,
          recoWinner: refinedPrediction.recoWinner || "N/A"
        }
      };

      // Sauvegarde
      saveAnalysis(selectedMatch.id, finalReport);
      setCurrentReport(finalReport);

      // Feedback visuel
      setSaveStatus("✅ IA mise à jour!");
      setTimeout(() => setSaveStatus(""), 3000);

    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus("❌ Erreur sauvegarde");
      setTimeout(() => setSaveStatus(""), 3000);
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
            <div className="w-full h-full flex flex-col overflow-hidden bg-surface border border-neutral-800 rounded-2xl shadow-2xl">
              
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
                     <div className="flex gap-2">
                       <button 
                         onClick={() => fileInputRef.current?.click()} 
                         className="bg-blue-900/50 hover:bg-blue-600 border border-blue-500/50 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-xs transition-all"
                       >
                         <Upload size={16} /> IMAGE
                       </button>
                       <button 
                         onClick={runGodMode} 
                         disabled={isComputing}
                         className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-xs transition-all"
                       >
                         <Cpu size={16} /> WEB
                       </button>
                     </div>
                   ) : (
                       <div className="flex flex-col items-end">
                           <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                               <CheckCircle2 size={14} /> PRÊT
                           </div>
                           {saveStatus && <span className="text-[10px] text-neon animate-pulse mt-1">{saveStatus}</span>}
                       </div>
                   )}
                 </div>
              </div>

              {/* CONTENU - GODMODETABLE */}
              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  {currentReport ? (
                      <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                          <GodModeTable 
                              report={currentReport} 
                              onUpdate={handleReportUpdate}
                              onSave={handleManualSave}
                          />
                          <div className="h-10"></div> {/* Espace vide en bas pour le scroll */}
                      </div>
                  ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                          <div className="border-2 border-dashed border-neutral-800 rounded-xl bg-black/10 p-8 flex flex-col items-center">
                              <ImageIcon size={48} className="mb-4 opacity-30"/>
                              <p className="text-sm font-bold">En attente d'analyse</p>
                              <p className="text-xs mt-1 opacity-70">Importez une image ou lancez le scan Web.</p>
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
