import React, { useState, useEffect } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal'; // Import du modal
import { Match } from '../types';
import { Clock, Filter } from 'lucide-react';
import { AutoValidator } from '../engine/AutoValidator';

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ALL' | '6H' | '12H' | '24H'>('ALL');

  // Au chargement de la page, on lance l'auto-validation (Mode Vacances)
  useEffect(() => {
      const logs = AutoValidator.run(MOCK_MATCHES);
      if (logs.length > 0) {
          console.log("🤖 Auto-Validation exécutée :", logs);
          // On pourrait afficher une notification ici
      }
  }, []);

  // Filtrage avancé
  const getFilteredMatches = () => {
      let matches = MOCK_MATCHES.filter(m => {
        if (filter === 'LIVE') return m.status === 'LIVE';
        if (filter === 'TODAY') return m.status === 'TODAY' || m.status === 'SCHEDULED'; 
        if (filter === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'SCHEDULED';
        return true;
      });

      // Simulation du filtre horaire (puisqu'on n'a pas de vraies dates JS dans le mock, on simule)
      if (timeFilter !== 'ALL' && filter !== 'LIVE') {
          // Ici, avec une vraie API, on comparerait new Date(m.date) avec Date.now() + 6h
          // Pour l'exemple, on ne filtre pas vraiment les mocks statiques pour ne pas tout vider
          console.log(`Filtre horaire ${timeFilter} appliqué`); 
      }

      return matches;
  };

  const matches = getFilteredMatches();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold border-l-4 border-neon pl-4">{title}</h2>
            <span className="text-sm text-gray-500 font-mono ml-5">{matches.length} Matchs disponibles</span>
        </div>

        {/* Filtres horaires */}
        {filter !== 'LIVE' && (
            <div className="flex bg-surface border border-neutral-800 rounded-lg p-1">
                <button 
                    onClick={() => setTimeFilter('ALL')}
                    className={`px-3 py-1 text-xs font-bold rounded ${timeFilter === 'ALL' ? 'bg-neutral-700 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    Tout
                </button>
                <button 
                    onClick={() => setTimeFilter('6H')}
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 ${timeFilter === '6H' ? 'bg-neon text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    <Clock size={12} /> +6h
                </button>
                <button 
                    onClick={() => setTimeFilter('12H')}
                    className={`px-3 py-1 text-xs font-bold rounded ${timeFilter === '12H' ? 'bg-neutral-700 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    +12h
                </button>
                <button 
                    onClick={() => setTimeFilter('24H')}
                    className={`px-3 py-1 text-xs font-bold rounded ${timeFilter === '24H' ? 'bg-neutral-700 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    +24h
                </button>
            </div>
        )}
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard 
                key={match.id} 
                match={match} 
                onClick={() => setSelectedMatch(match)} // Ouvre le modal
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <Filter className="text-gray-600 mb-2" size={32} />
          <p className="text-gray-500">Aucun match ne correspond à vos filtres.</p>
        </div>
      )}

      {/* LE MODAL QUI S'OUVRE PAR DESSUS */}
      <MatchDetailModal 
        match={selectedMatch} 
        onClose={() => setSelectedMatch(null)} 
      />
    </div>
  );
};
