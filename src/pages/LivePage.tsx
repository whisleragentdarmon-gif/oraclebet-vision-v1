import React from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { MatchStatus } from '../types';

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const matches = MOCK_MATCHES.filter(m => {
     if (filter === 'LIVE') return m.status === 'LIVE';
     if (filter === 'TODAY') return m.status === 'TODAY';
     if (filter === 'UPCOMING') return m.status === 'UPCOMING';
     return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-neon pl-4">{title}</h2>
        <span className="text-sm text-gray-500 font-mono">{matches.length} Matchs trouvés</span>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <p className="text-gray-500">Aucun match disponible pour cette catégorie.</p>
        </div>
      )}
    </div>
  );
};
