'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor'; // Assure-toi que ce composant existe bien

import { GodEngine } from '../engine/market/GodEngine';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReportV2 } from '../engine/types';
import { OracleAI } from '../engine';

import { Globe, Cpu, Save, X, Zap } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // État de chargement
  const [isComputing, setIsComputing] = useState(false);
  
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  
  // Compteur pour forcer le refresh (Clé React)
  const [uploadCounter, setUploadCounter] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // RESET QUAND ON CHANGE DE MATCH
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        
        // Si on a des données sauvegardées, on les met, sinon NULL
        // IMPORTANT : Si NULL, le tableau disparaît
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

  // --- GOD MODE ---
  const runGodMode = async () => {
    if (!selectedMatch) return;
    setIsComputing(true); 
    // ON CACHE LE TABLEAU PENDANT LE CALCUL
    setCurrentReport(null); 
    
    try {
       const report = await GodEngine.generateReportV2(selectedMatch.player1.name, selectedMatch.player2.name, selectedMatch.tournament);
       // ... logique de prédiction ...
       const finalReport: GodModeReportV2 = {
           ...report,
           prediction: { ...report.prediction, probA: "50%", probB: "50%", risk: "MEDIUM", recoWinner: "En attente" }
       };

       saveAnalysis(selectedMatch.id, finalReport);
       setCurrentReport(finalReport);
       setUploadCounter(c => c + 1);
       
       setTimeout(() => setShowModal(true), 1000);
    } catch (e) {
       console.error("Erreur God Mode:", e);
       alert("Erreur lors de la génération.");
    }
    setIsComputing(false);
  };

  // --- UPLOAD IMAGE (CORRIGÉ) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. DISPARITION DU TABLEAU
    setIsComputing(true);
    setCurrentReport(null); 
    setShowModal(false);
    
    // Pause dramatique pour laisser React vider le DOM
    await new Promise(r => setTimeout(r, 200));

    try {
        console.log('📸 ANALYSE EN COURS...');
        const reportFromImage = await ImageEngine.analyzeScreenshot(file, null);
        
        const targetId = selectedMatch ? selectedMatch.id : `scan-${Date.now()}`;
        saveAnalysis(targetId, reportFromImage);
        
        // 2. APPARITION DES NOUVELLES DONNÉES
        setCurrentReport(reportFromImage);
        setUploadCounter(prev => prev + 1); 

    } catch (e) {
        console.error("❌ Erreur", e);
        alert("Erreur lecture image.");
    } finally {
        setIsComputing(false);
        if (event.target) event.target.value = '';
    }
  };

  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    saveAnalysis(selectedMatch.id, currentReport);
    setSaveStatus("✅ Sauvegardé !");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const getCircuitColor = (c: string) => {
    if (!c) return 'text-blue-500';
    if (c.includes('WTA')) return 'text-pink-500';
    return 'text-blue-500';
  };

  // --- RENDU ---
  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden">
          <h2 className="text-2xl font-bold mb-2 flex-shrink-0">Matchs</h2>
          <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-thin">
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

        {/* MAIN AREA */}
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
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isComputing}
                      className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm border border-neutral-700"
                    >
                      📸 SCAN
                    </button>

                    <button 
                      onClick={runGodMode} 
                      disabled={isComputing}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-purple-500/20"
                    >
                      <Cpu size={18} /> GOD MODE
                    </button>
                    
                    {saveStatus && <span className="text-green-400 text-xs font-bold">{saveStatus}</span>}
                  </div>
              </div>

              {/* TABLEAU (CACHE SI EN COURS DE CALCUL) */}
              <div className="flex-1 overflow-hidden bg-neutral-950 relative">
                  <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-700">
                      
                      {!currentReport && !isComputing && (
                          <div className="mb-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
                              <h3 className="text-xl font-bold text-white">En attente d'analyse...</h3>
                              <p className="text-gray-400 text-sm">Sélectionnez une action ci-dessus.</p>
                          </div>
                      )}
                      
                      {/* ASTUCE: On n'affiche le tableau que si currentReport existe ET qu'on ne calcule pas */}
                      {currentReport && !isComputing && (
                          <GodModeTable 
                              key={`reset-${uploadCounter}-${selectedMatch.id}`} // Clé de reset ultime
                              report={currentReport} 
                              onUpdate={(r) => setCurrentReport(r)}
                              onSave={handleManualSave}
                          />
                      )}
                      <div className="h-10"></div>
                  </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                Sélectionnez un match.
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && currentReport && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-purple-500 rounded-2xl p-8 max-w-lg w-full text-center">
             <h3 className="text-2xl font-bold text-white mb-4">Analyse Terminée</h3>
             <button onClick={() => setShowModal(false)} className="bg-green-600 text-white py-2 px-6 rounded-lg">OK</button>
          </div>
        </div>
      )}
    </>
  );
};
