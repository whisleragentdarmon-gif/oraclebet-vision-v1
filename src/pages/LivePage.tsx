import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match, Circuit } from '../types';
import { Clock, Filter } from 'lucide-react';

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ALL' | '6H' | '12H' | '24H'>('ALL');
  const [circuitFilter, setCircuitFilter] = useState<'ALL' | Circuit>('ALL');

  const getFilteredMatches = () => {
      let matches = MOCK_MATCHES.filter(m => {
        // Filtre Statut
        if (filter === 'LIVE' && m.status !== 'LIVE') return false;
        if (filter === 'TODAY' && (m.status !== 'TODAY' && m.status !== 'SCHEDULED')) return false;
        if (filter === 'UPCOMING' && (m.status !== 'UPCOMING' && m.status !== 'SCHEDULED')) return false;
        
        // Filtre Circuit
        if (circuitFilter !== 'ALL' && m.ai?.circuit !== circuitFilter) return false;

        return true;
      });
      return matches;
  };

  const matches = getFilteredMatches();

  return (
    <div>
      {/* En-tête simple */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold border-l-4 border-neon pl-4 flex items-center gap-3">
                {title}
            </h2>
            <span className="text-sm text-gray-500 font-mono ml-5">{matches.length} Matchs</span>
        </div>

        <div className="flex flex-col gap-2">
            {/* Filtres Circuit */}
            <div className="flex bg-surface border border-neutral-800 rounded-lg p-1 overflow-x-auto">
                {['ALL', 'ATP', 'WTA', 'CHALLENGER', 'ITF'].map((c) => (
                    <button 
                        key={c}
                        onClick={() => setCircuitFilter(c as any)}
                        className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap ${circuitFilter === c ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Filtres Horaires */}
            {filter !== 'LIVE' && (
                <div className="flex bg-surface border border-neutral-800 rounded-lg p-1">
                    {['ALL', '6H', '12H', '24H'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setTimeFilter(t as any)}
                            className={`px-3 py-1 text-xs font-bold rounded ${timeFilter === t ? 'bg-neutral-700 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            {t === 'ALL' ? 'Tout' : `+${t.replace('H', 'h')}`}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard 
                key={match.id} 
                match={match} 
                onClick={() => setSelectedMatch(match)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <Filter className="text-gray-600 mb-2" size={32} />
          <p className="text-gray-500">Aucun match ne correspond aux filtres.</p>
        </div>
      )}

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};
