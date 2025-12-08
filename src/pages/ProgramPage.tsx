'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReportV2 } from '../engine/types';
import { Save, Calendar, FileEdit, RotateCcw, CheckCircle } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  // Matchs à venir uniquement
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Clé pour forcer le tableau à être vierge quand on change de match
  const [formKey, setFormKey] = useState(0);

  // 1. Sélection automatique
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // 2. Chargement : On vérifie si on a déjà commencé à remplir ce match
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        
        if (saved) {
            // Si on a déjà rempli des trucs, on les affiche pour continuer
            setCurrentReport(saved);
        } else {
            // Sinon, on affiche un tableau STRICTEMENT VIERGE (avec juste les noms)
            setCurrentReport(createBlankReport(selectedMatch));
        }
        
        // Reset visuel
        setFormKey(prev => prev + 1);
        setStatusMsg("");
    }
  }, [selectedMatch?.id]);

  // 3. Sauvegarde vers la page Analyse
  const handleSaveForAnalysis = () => {
    if (!currentReport || !selectedMatch) return;
    
    // On sauvegarde dans le contexte global
    saveAnalysis(selectedMatch.id, currentReport);
    
    setStatusMsg("✅ Données envoyées vers l'Analyse !");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  // 4. Reset total
  const handleReset = () => {
      if(!selectedMatch) return;
      if(confirm("Remettre le tableau à zéro ?")) {
          const blank = createBlankReport(selectedMatch);
          setCurrentReport(blank);
          setFormKey(prev => prev + 1);
      }
  };

  // Générateur de tableau vierge
  const createBlankReport = (match: Match): GodModeReportV2 => {
    return {
      identity: { 
          p1Name: match.player1.name, 
          p2Name: match.player2.name, 
          tournament: match.tournament, 
          surface: match.surface || '', 
          date: new Date().toLocaleDateString('fr-FR'), 
          time: '12:00' 
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { global: '', surface: '', lastMatches: '' },
      conditions: { weather: '', temp: '', wind: '' },
      bookmaker: { oddA: '1.90', oddB: '1.90' },
      synthesis: { risk: '', xFactor: '' },
      prediction: { probA: '', probB: '', recoWinner: '' } // Prédiction vide pour l'instant
    } as any;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* LISTE DES MATCHS (GAUCHE) */}
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
        </div>

        {/* TABLEAU DE SAISIE (DROITE) */}
        <div className="flex-1 h-full overflow-hidden flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl relative">
          {selectedMatch && currentReport ? (
            <>
              {/* Header */}
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

              {/* Tableau Editable */}
              <div className="flex-1 overflow-hidden relative">
                  <GodModeTable 
                      key={formKey} // Force le reset visuel
                      report={currentReport} 
                      onUpdate={setCurrentReport} 
                      onSave={handleSaveForAnalysis}
                  />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">Sélectionnez un match pour saisir les données.</div>
          )}
        </div>
    </div>
  );
};

// Helper cases vides
function createEmptyProfile() {
    const d: any = { rank: '', form: '', hand: '', nationality: '' };
    for(let i=1; i<=20; i++) d[`match${i}_date`] = '', d[`match${i}_score`] = '', d[`match${i}_opponent`] = '';
    return d;
}
