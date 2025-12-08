'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReportV2 } from '../engine/types';
import { Save, CheckCircle, RotateCcw, Brain, Calendar } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  // Filtre les matchs finis
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentReport, setCurrentReport] = useState<GodModeReportV2 | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  
  // Clé pour forcer le rafraichissement du tableau quand on change de match
  const [formKey, setFormKey] = useState(0);

  // 1. Sélection automatique du premier match au chargement
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(activeMatches[0]);
    }
  }, [matches]);

  // 2. Chargement des données quand on clique sur un match
  useEffect(() => {
    if (selectedMatch) {
        console.log("🔄 Chargement match:", selectedMatch.player1.name);
        const saved = getAnalysis(selectedMatch.id);
        
        if (saved) {
            console.log("✅ Données trouvées en mémoire");
            setCurrentReport(saved);
        } else {
            console.log("✨ Nouveau rapport vierge");
            setCurrentReport(getEmptyReport(selectedMatch));
        }
        
        setSaveStatus("");
        // Force le tableau à se redessiner complètement avec les nouvelles données
        setFormKey(prev => prev + 1);
    }
  }, [selectedMatch?.id]); 

  // 3. Fonction de Sauvegarde Manuelle
  const handleManualSave = () => {
    if (!currentReport || !selectedMatch) return;
    
    console.log("💾 Sauvegarde en cours...");
    saveAnalysis(selectedMatch.id, currentReport);
    
    setSaveStatus("✅ Sauvegardé !");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // 4. Fonction de Reset (Remettre à zéro)
  const handleReset = () => {
      if(!selectedMatch) return;
      if(confirm("Voulez-vous effacer toutes les données de ce match ?")) {
          const empty = getEmptyReport(selectedMatch);
          setCurrentReport(empty);
          saveAnalysis(selectedMatch.id, empty);
          setFormKey(prev => prev + 1);
      }
  };

  // Helper pour créer un rapport vide mais pré-rempli avec les noms
  const getEmptyReport = (match: Match): GodModeReportV2 => {
    return {
      identity: { 
          p1Name: match.player1.name, 
          p2Name: match.player2.name, 
          tournament: match.tournament, 
          surface: match.surface || 'Dur', 
          date: new Date().toLocaleDateString('fr-FR'), 
          time: '12:00' 
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { global: '' },
      conditions: { weather: '', temp: '' },
      bookmaker: { oddA: match.odds?.p1?.toString() || '', oddB: match.odds?.p2?.toString() || '' },
      synthesis: { risk: 'HIGH' },
      prediction: { probA: '50%', probB: '50%', recoWinner: 'À définir' }
    } as any;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        
        {/* --- COLONNE GAUCHE : LISTE DES MATCHS --- */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="p-4 border-b border-neutral-800 bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-neon" size={18}/> Matchs ({activeMatches.length})
            </h2>
          </div>
          
          <div className="overflow-y-auto p-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-neutral-700">
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
              <div className="text-gray-500 text-center p-4 text-sm">Aucun match disponible.</div>
            )}
          </div>
        </div>

        {/* --- COLONNE DROITE : TABLEAU DE SAISIE --- */}
        <div className="flex-1 h-full overflow-hidden flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl relative">
          {selectedMatch && currentReport ? (
            <>
              {/* Header Actions */}
              <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black/20 shrink-0">
                  <div>
                      <h2 className="text-xl font-bold text-white flex gap-2 items-center">
                          <span className="text-blue-400">{currentReport.identity.p1Name}</span>
                          <span className="text-gray-600 text-sm">VS</span>
                          <span className="text-orange-400">{currentReport.identity.p2Name}</span>
                      </h2>
                      <p className="text-xs text-gray-500">{currentReport.identity.tournament}</p>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                      {saveStatus && (
                          <span className="text-green-400 text-sm font-bold animate-pulse flex items-center gap-1">
                              <CheckCircle size={14}/> {saveStatus}
                          </span>
                      )}
                      
                      <button 
                        onClick={handleReset}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Réinitialiser"
                      >
                          <RotateCcw size={18}/>
                      </button>

                      <button 
                        onClick={handleManualSave}
                        className="bg-neon hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold flex gap-2 items-center shadow-lg shadow-orange-500/20 transition-all"
                      >
                          <Save size={18}/> SAUVEGARDER
                      </button>
                  </div>
              </div>

              {/* Le Tableau */}
              <div className="flex-1 overflow-hidden relative">
                  <GodModeTable 
                      key={formKey} // LA CLÉ MAGIQUE : Force le refresh quand on change de match
                      report={currentReport} 
                      onUpdate={setCurrentReport} // Met à jour le state local quand tu tapes
                      onSave={handleManualSave}
                  />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 flex-col gap-4">
                <Brain size={48} className="opacity-20"/>
                <p>Sélectionnez un match à gauche pour commencer l'analyse manuelle.</p>
            </div>
          )}
        </div>
    </div>
  );
};

// Helper pour initialiser les champs vides
function createEmptyProfile() {
    const d: any = { rank: '', form: '', hand: '', nationality: '' };
    for(let i=1; i<=20; i++) {
        d[`match${i}_date`] = ''; d[`match${i}_score`] = ''; d[`match${i}_opponent`] = '';
    }
    return d;
}
