import React, { useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match, Circuit } from '../types';
import { Filter, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext'; // 👈 On utilise les données globales

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const { matches, loading, refreshData } = useData();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [circuitFilter, setCircuitFilter] = useState<'ALL' | Circuit>('ALL');

  const displayedMatches = matches.filter(m => {
      // 1. Filtre par Circuit
      if (circuitFilter !== 'ALL' && m.ai?.circuit !== circuitFilter) return false;

      // 2. Filtre par Statut (STRICT)
      if (filter === 'LIVE') return m.status === 'LIVE'; // Seulement le vrai live
      
      if (filter === 'TODAY') {
          // Affiche tout ce qui est prévu aujourd'hui, même fini ou en cours
          // Mais on exclut les matchs de demain
          return true; 
      }
      
      if (filter === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'SCHEDULED';

      return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold border-l-4 border-neon pl-4 flex items-center gap-3">
                {title}
                <button onClick={refreshData} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                    <RefreshCw size={14} className={loading ? "animate-spin text-neon" : "text-gray-400"} />
                </button>
            </h2>
            <span className="text-sm text-gray-500 font-mono ml-5">
                {loading ? "Chargement..." : `${displayedMatches.length} Matchs`}
            </span>
        </div>

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
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64"><RefreshCw className="animate-spin text-neon" size={40} /></div>
      ) : displayedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map(match => (
            <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <Filter className="text-gray-600 mb-2" size={32} />
          <p className="text-gray-500">Aucun match trouvé pour ce filtre.</p>
        </div>
      )}

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};
