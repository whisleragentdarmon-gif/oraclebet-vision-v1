import React, { useState } from 'react';
import { CustomMatchInput } from '../components/CustomMatchInput';
import { FullMatchDossier } from '../engine/types';
import { CheckCircle, Search } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [lastDossier, setLastDossier] = useState<FullMatchDossier | null>(null);

  // ✅ C'est cette fonction qui manquait pour corriger l'erreur
  const handleManualAnalysis = (dossier: FullMatchDossier) => {
    console.log("Dossier manuel reçu :", dossier);
    setLastDossier(dossier);
    // Ici, plus tard, on pourra rediriger vers la page Analyse avec ces données
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-800 rounded-full text-neon">
              <Search size={24} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
              <p className="text-sm text-gray-400">Lancez le God Mode sur un match qui n'est pas dans la liste du jour.</p>
          </div>
      </div>

      {/* 👇 CORRECTION : On passe bien la prop onAnalysisComplete */}
      <CustomMatchInput onAnalysisComplete={handleManualAnalysis} />

      {/* Petit feedback visuel si un dossier est généré */}
      {lastDossier && (
          <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-xl flex items-start gap-4 animate-fade-in">
              <CheckCircle className="text-green-500 shrink-0" size={24} />
              <div>
                  <h4 className="font-bold text-white text-lg">Analyse Terminée</h4>
                  <p className="text-gray-300 text-sm mt-1">
                      Les données pour ce match ont été récupérées avec succès par le God Mode.
                  </p>
                  <div className="mt-4 p-3 bg-black/40 rounded border border-green-500/20 font-mono text-xs text-green-300">
                      Données prêtes : H2H, Météo: {lastDossier.context.weather}, Stats Surface...
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
