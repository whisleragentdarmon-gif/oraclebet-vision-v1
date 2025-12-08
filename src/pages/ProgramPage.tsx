'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReportV2 } from '../engine/types';
import { Save, Calendar, FileEdit, RotateCcw, CheckCircle, Database } from 'lucide-react';
import { DEMO_MATCHES } from '../data/demoData'; // Assure-toi que le fichier est bien créé

export const ProgramPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [formKey, setFormKey] = useState(0);

  // --- CHARGER LA DEMO (RANDOM parmi les 6) ---
  const handleLoadDemo = () => {
      // Choisi un match au hasard parmi les 6 démos
      const randomIndex = Math.floor(Math.random() * DEMO_MATCHES.length);
      const demo = DEMO_MATCHES[randomIndex]; 
      
      const fakeMatch: any = {
          id: demo.id,
          player1: { name: demo.identity.p1Name },
          player2: { name: demo.identity.p2Name },
          tournament: demo.identity.tournament,
          surface: demo.identity.surface,
          date: demo.identity.date,
          status: 'LIVE',
          odds: { p1: 1.90, p2: 1.90 }
      };

      setSelectedMatch(fakeMatch);
      setCurrentReport(demo as any); // On force le rapport rempli
      setFormKey(prev => prev + 1);
      
      saveAnalysis(demo.id, demo); // On sauvegarde
      alert(`✅ Match démo chargé : ${demo.identity.p1Name} vs ${demo.identity.p2Name}`);
  };

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  useEffect(() => {
    if (selectedMatch) {
        if (selectedMatch.id.startsWith('demo_')) return; // Ne pas écraser la démo

        const saved = getAnalysis(selectedMatch.id);
        if (saved) setCurrentReport(saved);
        else setCurrentReport(createBlankReport(selectedMatch));
        
        setFormKey(prev => prev + 1);
        setSaveStatus("");
    }
  }, [selectedMatch?.id]);

  const handleSaveForAnalysis = () => {
    if (!currentReport || !selectedMatch) return;
    saveAnalysis(selectedMatch.id, currentReport);
    setSaveStatus("✅ Données sauvegardées !");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleReset = () => {
      if(!selectedMatch) return;
      if(confirm("Remettre à zéro ?")) {
          const blank = createBlankReport(selectedMatch);
          setCurrentReport(blank);
          saveAnalysis(selectedMatch.id, blank);
          setFormKey(prev => prev + 1);
      }
  };

  const createBlankReport = (match: Match): GodModeReportV2 => {
    return {
      identity: { 
          p1Name: match.player1.name, p2Name: match.player2.name, 
          tournament: match.tournament, surface: match.surface || '', 
          date: new Date().toLocaleDateString('fr-FR'), time: '12:00' 
      },
      p1: createEmptyProfile(), p2: createEmptyProfile(),
      h2h: { global: '' }, conditions: { weather: '' },
      bookmaker: { oddA: '1.90', oddB: '1.90' },
      synthesis: { risk: '' }, prediction: { probA: '', probB: '', recoWinner: '' }
    } as any;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* LISTE GAUCHE */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="p-4 border-b border-neutral-800 bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-blue-500" size={18}/> Programme
            </h2>
          </div>
          
          <div className="overflow-y-auto p-2 space-y-2 flex-1">
            {activeMatches.map((match) => (
              <MatchCard 
                key={match.id} match={match} 
                selected={selectedMatch?.id === match.id} 
                onClick={() => setSelectedMatch(match)} 
                compact 
              />
            ))}
          </div>

          {/* BOUTON DÉMO */}
          <div className="p-4 border-t border-neutral-800">
              <button onClick={handleLoadDemo} className="w-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs py-3 rounded border border-purple-700 flex items-center justify-center gap-2 font-bold transition-all">
                  <Database size={16}/> CHARGER SCÉNARIO IA
              </button>
          </div>
        </div>

        {/* TABLEAU DROITE */}
        <div className="flex-1 h-full overflow-hidden flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl relative">
          {selectedMatch && currentReport ? (
            <>
              <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black/20 shrink-0">
                  <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded text-blue-400"><FileEdit size={20}/></div>
                      <div>
                          <h2 className="font-bold text-white text-lg">Saisie Manuelle</h2>
                          <p className="text-xs text-gray-500">Remplissez les données pour l'IA</p>
                      </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                      <span className="text-green-400 text-xs font-bold animate-pulse">{statusMsg}</span>
                      <button onClick={handleReset} className="p-2 text-gray-500 hover:text-white" title="Effacer"><RotateCcw size={18}/></button>
                      <button onClick={handleSaveForAnalysis} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex gap-2 items-center">
                          <Save size={18}/> SAUVEGARDER
                      </button>
                  </div>
              </div>

              <div className="flex-1 overflow-hidden relative">
                  <GodModeTable 
                      key={formKey} 
                      report={currentReport} 
                      onUpdate={setCurrentReport} 
                      onSave={handleSaveForAnalysis}
                  />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">Sélectionnez un match.</div>
          )}
        </div>
    </div>
  );
};

function createEmptyProfile() {
    const d: any = { rank: '', form: '', hand: '', nationality: '' };
    for(let i=1; i<=20; i++) d[`match${i}_date`] = '', d[`match${i}_score`] = '', d[`match${i}_opponent`] = '';
    return d;
}
