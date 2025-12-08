'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';

import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReportV2 } from '../engine/types';

import { Save, Camera, RotateCcw } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // --- ETAT DOUBLE : SAUVEGARDÉ vs BROUILLON ---
  // savedReport = Ce qui est en base
  // draftReport = Ce qu'on est en train d'éditer ou qu'on vient de scanner
  const [draftReport, setDraftReport] = useState<GodModeReportV2 | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Initialisation
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // 2. Changement de match -> Chargement depuis la base
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        if (saved && saved.identity) {
            setDraftReport(saved); // On charge la sauvegarde en tant que brouillon éditable
        } else {
            setDraftReport(null); // Pas de données
        }
        setStatusMsg("");
    }
  }, [selectedMatch?.id]);

  // 3. FONCTION UPLOAD (Mode Brouillon)
  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsComputing(true);
      setDraftReport(null); // On vide l'écran visuellement (Blackout)
      setStatusMsg("Analyse Image en cours...");

      // Délai cosmétique pour le reset
      await new Promise(r => setTimeout(r, 200));

      try {
          // Analyse pure (Ne sauvegarde RIEN en base pour l'instant)
          const newReport = await ImageEngine.analyzeScreenshot(file);
          
          // On injecte les noms du match sélectionné en fallback si l'OCR échoue
          if (newReport.identity.p1Name.includes('Inconnu') && selectedMatch) {
              newReport.identity.p1Name = selectedMatch.player1.name;
          }
          if (newReport.identity.p2Name.includes('Inconnu') && selectedMatch) {
              newReport.identity.p2Name = selectedMatch.player2.name;
          }

          setDraftReport(newReport);
          setStatusMsg("✅ Scan terminé (Brouillon non sauvegardé)");

      } catch (err) {
          console.error(err);
          alert("Erreur analyse");
      } finally {
          setIsComputing(false);
          if (e.target) e.target.value = ''; // Reset input
      }
  };

  // 4. SAUVEGARDE FINALE
  const handleSave = () => {
      if (!selectedMatch || !draftReport) return;
      
      // C'est SEULEMENT ICI qu'on écrit en mémoire persistante
      saveAnalysis(selectedMatch.id, draftReport);
      
      setStatusMsg("💾 Sauvegarde effectuée !");
      setTimeout(() => setStatusMsg(""), 2000);
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleScan} />

      <div className="flex h-full w-full gap-4 overflow-hidden">
          
          {/* SIDEBAR MATCHS */}
          <div className="w-1/5 flex flex-col gap-2 overflow-hidden h-full">
              <h2 className="text-xl font-bold p-2">Matchs</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-2">
                  {activeMatches.map(m => (
                      <MatchCard 
                        key={m.id} 
                        match={m} 
                        selected={selectedMatch?.id === m.id} 
                        onClick={() => setSelectedMatch(m)} 
                        compact
                      />
                  ))}
              </div>
          </div>

          {/* MAIN */}
          <div className="flex-1 flex flex-col overflow-hidden h-full border border-neutral-800 rounded-xl bg-surface relative">
              
              {/* TOP BAR */}
              <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black/20 shrink-0">
                  <div className="font-bold text-lg text-white">
                      {selectedMatch ? `${selectedMatch.player1.name} vs ${selectedMatch.player2.name}` : 'Sélectionnez un match'}
                  </div>
                  
                  <div className="flex gap-3 items-center">
                      <span className="text-xs text-yellow-400 animate-pulse">{statusMsg}</span>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!selectedMatch || isComputing}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded flex gap-2 text-sm disabled:opacity-50"
                      >
                          <Camera size={16}/> SCAN PHOTO
                      </button>
                  </div>
              </div>

              {/* TABLEAU */}
              <div className="flex-1 overflow-hidden relative bg-neutral-950">
                  {selectedMatch && draftReport ? (
                      // LA CLÉ EST ICI : On utilise un timestamp dans la clé pour forcer le remount si besoin
                      // Mais avec l'architecture "controlled props", draftReport suffit.
                      <GodModeTable 
                          report={draftReport} 
                          onUpdate={setDraftReport} 
                          onSave={handleSave} 
                      />
                  ) : (
                      <div className="flex h-full items-center justify-center text-gray-600 flex-col gap-4">
                          <RotateCcw size={48} className="opacity-20"/>
                          <p>Aucune analyse. Scannez une image ou lancez l'IA.</p>
                      </div>
                  )}
              </div>

          </div>
      </div>
    </>
  );
};
