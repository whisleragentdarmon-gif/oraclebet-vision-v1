'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { GodModeTable } from '../components/GodModeTable';
import { GodModeReportV2 } from '../engine/types';
import { Cpu, CheckCircle, Brain, Lock } from 'lucide-react';
import { OracleReactor } from '../components/OracleReactor';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { getAnalysis, saveAnalysis } = useAnalysis();
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [report, setReport] = useState<GodModeReportV2 | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // On affiche les matchs qui ont des données sauvegardées (ou tous, au choix)
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');

  // Chargement des données saisies dans ProgramPage
  useEffect(() => {
    if (selectedMatch) {
        const savedData = getAnalysis(selectedMatch.id);
        if (savedData) {
            setReport(savedData);
        } else {
            setReport(null); // Pas encore de données saisies
        }
        setShowResult(false);
    }
  }, [selectedMatch]);

  // --- LE CERVEAU : C'est ici que l'IA prend tes données manuelles ---
  const runGodAnalysis = async () => {
      if (!report || !selectedMatch) return;
      
      setIsComputing(true);
      
      // Simulation du temps de réflexion
      await new Promise(r => setTimeout(r, 2000));

      // 🧠 ALGORITHME DE DÉCISION (Basé sur tes saisies)
      // Ici, on fait semblant que l'IA réfléchit sur tes données
      const p1Score = calculateScore(report.p1);
      const p2Score = calculateScore(report.p2);
      
      const total = p1Score + p2Score;
      const probA = Math.round((p1Score / total) * 100);
      const probB = 100 - probA;

      // ✅ CORRECTION ICI : On remplit TOUS les champs requis par TypeScript
      const newReport: GodModeReportV2 = { 
          ...report,
          prediction: {
              probA: `${probA}%`,
              probB: `${probB}%`,
              risk: Math.abs(probA - 50) < 10 ? 'HIGH' : 'MEDIUM',
              recoWinner: probA > probB ? report.identity.p1Name : report.identity.p2Name,
              
              // Champs obligatoires ajoutés pour corriger l'erreur TS2739
              probOver: '55%',       
              probTieBreak: '30%',   
              probUpset: '20%',      
              recoOver: 'Analyse Over requise',
              recoSet: '2 Sets'
          }
      };

      // Sauvegarde du résultat final
      saveAnalysis(selectedMatch.id, newReport);
      setReport(newReport);
      setIsComputing(false);
      setShowResult(true);
  };

  // Petite fonction bidon pour simuler un calcul de score (à remplacer par ton vrai algo)
  const calculateScore = (profile: any) => {
      let score = 50;
      // On convertit en nombre ou on prend 0 si vide
      const rank = parseInt(profile.rank) || 100;
      
      if (rank < 50) score += 10;
      if (profile.form === '8/10' || profile.form === '9/10') score += 15;
      if (profile.hand === 'Gaucher') score += 5;
      return score;
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => {}} />
      
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-hidden p-4">
        {/* LISTE */}
        <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="p-4 border-b border-neutral-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="text-purple-500" size={18}/> Analyses Prêtes
                </h2>
            </div>
            <div className="overflow-y-auto p-2 space-y-2 flex-1">
                {activeMatches.map(m => (
                    <MatchCard key={m.id} match={m} selected={selectedMatch?.id === m.id} onClick={() => setSelectedMatch(m)} compact />
                ))}
            </div>
        </div>

        {/* CENTRE DE COMMANDE */}
        <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col relative">
            {selectedMatch && report ? (
                <>
                    <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black/20 shrink-0">
                        <div className="text-white font-bold text-lg">
                            Analyse IA : {report.identity.p1Name} vs {report.identity.p2Name}
                        </div>
                        <button 
                            onClick={runGodAnalysis}
                            disabled={isComputing}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold flex gap-2 items-center shadow-lg shadow-purple-500/20"
                        >
                            <Cpu size={18}/> LANCER GOD ANALYSE
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {/* Si le résultat est là, on affiche un overlay ou on met à jour le tableau */}
                        {showResult && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-900 border-2 border-green-500 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce-in">
                                <CheckCircle className="text-green-500" size={32}/>
                                <div>
                                    <div className="text-green-400 font-bold text-lg">PRÉDICTION TERMINÉE</div>
                                    <div className="text-white text-sm">Vainqueur probable : <span className="font-bold text-yellow-400">{report.prediction.recoWinner}</span></div>
                                </div>
                            </div>
                        )}
                        
                        <GodModeTable report={report} onUpdate={setReport} onSave={() => {}} />
                    </div>
                </>
            ) : (
                <div className="flex h-full items-center justify-center text-gray-500 flex-col gap-4">
                    <Lock size={48} className="opacity-20"/>
                    {selectedMatch ? (
                        <p>Aucune donnée saisie pour ce match. Allez dans l'onglet "Programme" d'abord.</p>
                    ) : (
                        <p>Sélectionnez un match pour lancer l'analyse.</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </>
  );
};
