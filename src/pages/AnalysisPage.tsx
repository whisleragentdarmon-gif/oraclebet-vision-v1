'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';

// ✅ IMPORTS DU NOUVEAU SYSTÈME GOD MODE
import { GodEngine } from '../engine/market/GodEngine';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReport } from '../engine/types';

import { Globe, Cpu, Zap, CheckCircle2, Lock, Upload } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis(); // Mémoire
  
  // Filtre les matchs jouables
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // ✅ On stocke le Rapport Complet ici
  const [currentReport, setCurrentReport] = useState<GodModeReport | null>(null);

  // ✅ Référence pour le fichier upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-sélection
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // Chargement de la mémoire (Persistance)
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        // On vérifie si la sauvegarde est bien un rapport GodMode
        if (saved && saved.identity) {
            setCurrentReport(saved);
        } else {
            setCurrentReport(null);
        }
    }
  }, [selectedMatch]);

  // --- FONCTION GOD MODE WEB ---
  const runGodMode = async () => {
    setIsComputing(true);
    if (selectedMatch) {
        const p1 = selectedMatch.player1.name;
        const p2 = selectedMatch.player2.name;
        
        try {
           // ✅ Appel à generateReportV2
           const report = await GodEngine.generateReportV2(p1, p2, selectedMatch.tournament);
           
           // Sauvegarde
           saveAnalysis(selectedMatch.id, report);
           setCurrentReport(report);
        } catch (e) {
           console.error("Erreur God Mode:", e);
        }
    }
    setIsComputing(false);
  };

  // ✅ FONCTION SCREENSHOT UPLOAD
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

  // Gestion de la mise à jour manuelle du tableau
  const handleReportUpdate = (newReport: GodModeReport) => {
      setCurrentReport(newReport);
      if (selectedMatch) {
          saveAnalysis(selectedMatch.id, newReport); // Sauvegarde à chaque frappe
      }
  };

  const getCircuitColor = (c: string) => {
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    if (c.includes('ITF')) return 'text-purple-500';
    return 'text-blue-500';
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />

      {/* ✅ INPUT CACHÉ POUR L'UPLOAD */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileUpload}
      />

      <div className="flex flex-col lg:flex-row gap-6 w-full h-full overflow-hidden">
        
        {/* COLONNE GAUCHE : LISTE */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0 overflow-hidden">
          <h2 className="text-2xl font-bold mb-2 flex-shrink-0">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3">
            {activeMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                selected={selectedMatch?.id === match.id} 
                onClick={() => setSelectedMatch(match)} 
                compact 
              />
            ))}
            {activeMatches.length === 0 && <p className="text-gray-500 border border-dashed border-neutral-800 p-4 rounded text-sm">Aucun match à venir.</p>}
          </div>
        </div>

        {/* COLONNE DROITE : TABLEAU GOD MODE */}
        <div className="flex-1 overflow-hidden">
          {selectedMatch ? (
            <div className="w-full h-full flex flex-col overflow-hidden">
              
              {/* EN-TÊTE */}
              <div className="flex justify-between items-start mb-4 border-b border-neutral-800 pb-4 flex-shrink-0 px-2">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Globe size={14} className={getCircuitColor(selectedMatch.ai?.circuit || 'ATP')} />
                        <span className={`text-xs font-bold ${getCircuitColor(selectedMatch.ai?.circuit || 'ATP')}`}>{selectedMatch.ai?.circuit || 'ATP'}</span>
                        <span className="text-gray-400 text-xs">| {selectedMatch.tournament}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      {selectedMatch.player1.name} <span className="text-orange-500">vs</span> {selectedMatch.player2.name}
                    </h2>
                 </div>
                 
                 <div className="flex-shrink-0 ml-4 flex gap-2">
                   {/* ✅ BOUTON SCREENSHOT */}
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="bg-blue-900/50 hover:bg-blue-600 border border-blue-500/50 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                   >
                     <Upload size={20} /> SCREENSHOT
                   </button>

                   {/* BOUTON SCAN WEB (si pas de rapport) */}
                   {!currentReport && (
                     <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105">
                        <Cpu size={20} /> SCAN WEB
                     </button>
                   )}
                   
                   {currentReport && (
                       <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                           <CheckCircle2 size={14} /> GÉNÉRÉ
                       </div>
                   )}
                 </div>
              </div>

              {/* 🔒 ECRAN DE VERROUILLAGE */}
              {!currentReport && (
                  <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-neutral-800 rounded-xl bg-black/20 m-2">
                      <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                          <Lock size={64} className="text-blue-400 relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white mt-6">FICHE MATCH VERROUILLÉE</h3>
                      <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
                          Importez une capture d'écran ou lancez Scan Web pour remplir la fiche.
                      </p>
                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                          <Upload size={18}/> Importer Image
                        </button>
                        <span className="text-gray-500 py-3">ou</span>
                        <button 
                          onClick={runGodMode}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                          <Cpu size={18}/> Scan Web
                        </button>
                      </div>
                  </div>
              )}

              {/* 🔓 TABLEAU VISIBLE */}
              {currentReport && (
                  <div className="animate-fade-in flex-1 overflow-hidden">
                      <GodModeTable 
                          report={currentReport} 
                          onUpdate={handleReportUpdate} 
                      />
                      
                      <div className="mt-2 text-center pb-2 flex-shrink-0">
                          <p className="text-[10px] text-gray-500 uppercase">Toutes les données sont modifiables manuellement pour affiner la prédiction.</p>
                      </div>
                  </div>
              )}

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
