import React, { useState, useEffect } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match, Circuit } from '../types';
import { Clock, Filter, Trophy, Zap } from 'lucide-react';
import { AutoValidator } from '../engine/AutoValidator';

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ALL' | '6H' | '12H' | '24H'>('ALL');
  const [circuitFilter, setCircuitFilter] = useState<'ALL' | Circuit>('ALL');
  const [autoLogs, setAutoLogs] = useState<string[]>([]);

  // Fonction pour lancer l'Auto-Validation (God Mode)
  const runAutoValidate = () => {
      const logs = AutoValidator.run(MOCK_MATCHES);
      if (logs.length > 0) {
          setAutoLogs(logs);
          setTimeout(() => setAutoLogs([]), 5000); // Efface après 5s
      } else {
          alert("Aucun match terminé en attente de validation.");
      }
  };

  const getFilteredMatches = () => {
      let matches = MOCK_MATCHES.filter(m => {
        // Filtre Statut
        if (filter === 'LIVE' && m.status !== 'LIVE') return false;
        if (filter === 'TODAY' && (m.status !== 'TODAY' && m.status !== 'SCHEDULED')) return false;
        if (filter === 'UPCOMING' && (m.status !== 'UPCOMING' && m.status !== 'SCHEDULED')) return false;
        
        // Filtre Circuit (ATP/WTA...)
        if (circuitFilter !== 'ALL' && m.ai?.circuit !== circuitFilter) return false;

        return true;
      });
      return matches;
  };

  const matches = getFilteredMatches();

  return (
    <div>
      {/* En-tête avec Bouton Auto-Validate */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold border-l-4 border-neon pl-4 flex items-center gap-3">
                {title}
                {filter === 'LIVE' && (
                    <button 
                        onClick={runAutoValidate}
                        className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/50 hover:bg-purple-500 hover:text-white transition-colors flex items-center gap-1"
                        title="Vérifier les résultats finis et mettre à jour l'IA"
                    >
                        <Zap size={10} /> Auto-Detect
                    </button>
                )}
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

      {/* Logs Auto-Validation */}
      {autoLogs.length > 0 && (
          <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/50 rounded-lg animate-fade-in">
              {autoLogs.map((log, i) => (
                  <p key={i} className="text-xs text-purple-300 font-mono">🤖 {log}</p>
              ))}
          </div>
      )}

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
