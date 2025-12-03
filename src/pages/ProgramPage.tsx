import React, { useState } from 'react';
import { CustomMatchInput } from '../components/CustomMatchInput';
import { FullMatchDossier, GodModeReport } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable'; // ✅ On importe le tableau
import { Search, CheckCircle, Edit3 } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReport | null>(null);

  const handleManualAnalysis = (dossier: FullMatchDossier) => {
    // On convertit les données brutes en Rapport Complet pour le tableau
    const fullReport: GodModeReport = {
        identity: {
            p1: "Joueur 1 (Manuel)", p2: "Joueur 2 (Manuel)", 
            tournament: "Tournoi Inconnu", category: "N/A", surface: "N/A", format: "Bo3", time: "N/A"
        },
        playerA: {
            ...createEmptyProfile(),
            rank: dossier.p1.rank, age: dossier.p1.age, height: dossier.p1.height
        },
        playerB: {
            ...createEmptyProfile(),
            rank: dossier.p2.rank, age: dossier.p2.age, height: dossier.p2.height
        },
        h2h: { global: "Voir sources", surface: "-", sets: "-", games: "-", context: "-", styleMatchup: "-" },
        conditions: { 
            weather: dossier.context.weather, 
            temp: "-", wind: "-", humidity: "-", altitude: dossier.context.altitude, speed: "-", indoor: "-", advantage: "-" 
        },
        momentum: { p1: createEmptyMomentum(), p2: createEmptyMomentum() },
        bookmaker: { oddA: "-", oddB: "-", value: "-", movement: "-", trap: "-", volume: "-" },
        psychology: { p1: "-", p2: "-" },
        synthesis: { stat: "-", mental: "-", physical: "-", surface: "-", momentum: "-" },
        prediction: { probA: "-", probB: "-", probOver: "-", probTieBreak: "-", probUpset: "-", risk: "-", recoWinner: "-", recoOver: "-", recoSet: "-" }
    };

    setReport(fullReport);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-800 rounded-full text-neon">
              <Search size={24} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
              <p className="text-sm text-gray-400">Analysez n'importe quel match, même hors programme.</p>
          </div>
      </div>

      {/* Formulaire de recherche */}
      {!report && <CustomMatchInput onAnalysisComplete={handleManualAnalysis} />}

      {/* Si analyse faite, on affiche le TABLEAU COMPLET MODIFIABLE */}
      {report && (
          <div className="animate-fade-in">
              <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 mb-6">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                      <h4 className="font-bold text-white">Données Récupérées !</h4>
                      <p className="text-xs text-green-300">Vous pouvez maintenant corriger et compléter les infos manquantes ci-dessous.</p>
                  </div>
                  <button onClick={() => setReport(null)} className="ml-auto text-xs underline text-gray-400 hover:text-white">Nouvelle recherche</button>
              </div>

              {/* LE TABLEAU EST LÀ */}
              <GodModeTable 
                  report={report} 
                  onUpdate={(newData) => setReport(newData)} 
              />
          </div>
      )}
    </div>
  );
};

// Helpers pour initialiser les objets vides
function createEmptyProfile() {
    return { rank: "-", bestRank: "-", age: "-", height: "-", style: "-", hand: "-", strength: "-", weakness: "-", injury: "-", form: "-", matchesCount: "-", timeOnCourt: "-", winSeason: "-", winCareer: "-", winSurface: "-", tieBreak: "-", vsTop10: "-", motivation: "-", social: "-" };
}
function createEmptyMomentum() {
    return { last5: "-", results: "-", fatigue: "-", pointsToDefend: "-", motivation: "-" };
}
