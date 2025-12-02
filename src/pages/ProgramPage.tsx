import React, { useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match, Circuit } from '../types';
import { Filter, RefreshCw, Trophy, Globe, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ProgramPage: React.FC = () => {
  const { matches, loading, refreshData, scrapeWebMatches } = useData();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [circuitFilter, setCircuitFilter] = useState<'ALL' | Circuit>('ALL');

  // On affiche TOUT ce qui n'est pas fini
  const displayedMatches = matches.filter(m => {
      if (m.status === 'FINISHED') return false;

      if (circuitFilter !== 'ALL') {
          if (circuitFilter === 'ITF' && !m.tournament.includes('ITF')) return false;
          if (circuitFilter === 'CHALLENGER' && !m.tournament.includes('Challenger')) return false;
          if (circuitFilter === 'WTA' && !m.tournament.includes('WTA')) return false;
          if (circuitFilter === 'ATP' && !m.tournament.includes('ATP')) return false;
      }
      return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-neon rounded-lg text-black">
                    <Calendar size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Programme & Analyse</h2>
                    <p className="text-sm text-gray-400">Sélectionnez un match pour lancer le God Mode.</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={refreshData} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700" title="Sync API">
                <RefreshCw size={16} className={loading ? "animate-spin text-neon" : "text-gray-400"} />
            </button>
            
            <button onClick={scrapeWebMatches} className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg hover:bg-blue-900/50 text-blue-400 text-sm font-bold transition-colors">
                <Globe size={16} /> SCANNER LE WEB
            </button>
        </div>
      </div>

      <div className="flex bg-surface border border-neutral-800 rounded-lg p-1 overflow-x-auto mb-6 w-full md:w-auto">
            {['ALL', 'ATP', 'WTA', 'CHALLENGER', 'ITF'].map((c) => (
                <button key={c} onClick={() => setCircuitFilter(c as any)} className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap flex items-center gap-1 transition-colors ${circuitFilter === c ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                    {c === 'ALL' && <Trophy size={12} />} {c}
                </button>
            ))}
      </div>

      {displayedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map(match => (
            <MatchCard 
                key={match.id} 
                match={match} 
                onClick={() => setSelectedMatch(match)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <Filter className="text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 font-bold">Aucun match au programme.</p>
          <p className="text-xs text-gray-600 mt-2">L'API est vide ? Essayez le bouton "Scanner le Web".</p>
        </div>
      )}

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};
