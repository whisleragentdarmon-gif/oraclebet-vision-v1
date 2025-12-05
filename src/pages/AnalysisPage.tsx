'use client';

import React, { useState, useEffect } from 'react';

export const AnalysisPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  useEffect(() => {
    try {
      console.log('✅ AnalysisPage montée');
      // Test d'import du contexte
      const { useData } = require('../context/DataContext');
      const dataContext = useData();
      console.log('✅ DataContext:', dataContext);
      setMatches(dataContext?.matches?.filter((m: any) => m.status !== 'FINISHED') || []);
    } catch (e) {
      console.error('❌ Erreur chargement:', e);
      setError('Erreur: ' + (e instanceof Error ? e.message : String(e)));
    }
  }, []);

  if (error) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">ERREUR DÉTECTÉE</h1>
        <pre className="bg-neutral-900 p-4 rounded text-sm overflow-auto">
          {error}
        </pre>
        <p className="mt-4 text-gray-400">Ouvrez la console (F12) pour plus de détails.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-4 min-h-screen bg-neutral-950 text-white">
      
      {/* LISTE MATCHS */}
      <div className="w-1/4">
        <h2 className="text-2xl font-bold mb-4">Matchs Actifs</h2>
        <div className="space-y-2">
          {matches.length > 0 ? (
            matches.map((match: any, index: number) => (
              <div 
                key={match?.id || index}
                onClick={() => setSelectedMatch(match)}
                className={`p-3 rounded-lg border cursor-pointer ${
                  selectedMatch?.id === match?.id 
                    ? 'bg-purple-900/30 border-purple-500' 
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                <div className="font-bold text-sm">
                  {match?.player1?.name || 'Joueur 1'} vs {match?.player2?.name || 'Joueur 2'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {match?.tournament || 'Tournoi'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 border border-dashed border-neutral-700 rounded text-center text-gray-500">
              {matches.length === 0 ? 'Aucun match actif' : 'Chargement...'}
            </div>
          )}
        </div>
      </div>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1">
        {selectedMatch ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              {selectedMatch.player1?.name} vs {selectedMatch.player2?.name}
            </h2>
            
            {/* MESSAGE + BOUTON */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Prêt pour l'analyse</h3>
              <p className="text-gray-400 text-sm mb-4">
                Lancez GOD MODE pour analyser et obtenir les prédictions
              </p>
              <button 
                onClick={() => alert('GOD MODE - Fonctionnalité en cours de test')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl"
              >
                🚀 LANCER GOD MODE
              </button>
            </div>

            {/* PLACEHOLDER TABLEAU */}
            <div className="bg-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Tableau d'analyse</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Joueur 1</div>
                    <div className="text-lg font-bold">{selectedMatch.player1?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Joueur 2</div>
                    <div className="text-lg font-bold">{selectedMatch.player2?.name}</div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm italic">
                  Le tableau complet s'affichera ici après analyse...
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-neutral-800 rounded-xl text-gray-500">
            Sélectionnez un match pour commencer
          </div>
        )}
      </div>
    </div>
  );
};
