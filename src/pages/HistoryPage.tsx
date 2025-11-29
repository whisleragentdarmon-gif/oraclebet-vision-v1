import React from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { CheckCircle2, History } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  // On filtre pour ne garder que les matchs finis
  const matches = MOCK_MATCHES.filter(m => m.status === 'FINISHED');

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-neutral-800 rounded-full text-neon">
            <History size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold">Résultats & Apprentissage</h2>
            <p className="text-sm text-gray-400">Validez les résultats pour rendre l'IA plus intelligente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {matches.length === 0 && (
          <div className="text-center p-12 text-gray-500 border border-dashed border-neutral-800 rounded-xl">
              Aucun match terminé pour le moment.
          </div>
      )}
    </div>
  );
};
