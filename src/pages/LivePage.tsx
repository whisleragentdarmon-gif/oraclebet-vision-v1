import React, { useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match, Circuit } from '../types';
import { Filter, RefreshCw, CheckCircle, AlertTriangle, Trophy, Globe } from 'lucide-react';
import { useData } from '../context/DataContext';

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  // On récupère scrapeWebMatches ici
  const { matches, loading, refreshData, scrapeWebMatches } = useData();
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [circuitFilter, setCircuitFilter] = useState<'ALL' | Circuit>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | '6H' | '12H' | '24H'>('ALL');

  // --- LOGIQUE DE FILTRAGE ---
  const displayedMatches = matches.filter(m => {
      // 1. Filtre par Circuit
      if (circuitFilter !== 'ALL') {
          if (circuitFilter === 'ITF' && !m.tournament.includes('ITF')) return false;
          if (circuitFilter === 'CHALLENGER' && !m.tournament.includes('Challenger')) return false;
          if (circuitFilter === 'WTA' && !m.tournament.includes('WTA')) return false;
          if (circuitFilter === 'ATP' && !m.tournament.includes('ATP')) return false;
      }

      // 2. Filtre par Statut (Page)
      if (filter === 'LIVE') return m.status === 'LIVE';
      if (filter === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'SCHEDULED';
      
      // Pour "Aujourd'hui", on affiche tout ce qui n'est pas fini hier
      if (filter === 'TODAY') {
          // On simplifie la date pour comparaison
          const matchDate = new Date(m.date.split('/').reverse().join('-')); // Si format FR
          const today = new Date();
          const isToday = matchDate.getDate() === today.getDate() || m.date === "Auj.";
          return isToday || m.status === 'LIVE';
      }

      return true;
  });

  const countLive = matches.filter(m => m.status === 'LIVE').length;
  const countTotal = matches.length;

  return (
    <div>
      {/* BANDEAU DIAGNOSTIC */}
      <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${countTotal > 0 ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-300'}`}>
          <div className="flex items-center gap-2">
              {countTotal > 0 ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
              <span>
                  SOURCE: {loading ? "CHARGEMENT..." : "CONNECTÉ"} | 
                  MATCHS EN MÉMOIRE: {countTotal} | 
                  EN DIRECT: {countLive}
              </span>
          </div>
          {countTotal === 0 && !loading && <span>Aucun match. Lancez un scan.</span>}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold border-l-4 border-neon pl-4">
                    {title}
                </h2>
                
                {/* BOUTON API OFFICIELLE */}
                <button 
                    onClick={refreshData} 
                    className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                    title="Actualiser via SportScore (API)"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-neon" : "text-gray-400"} />
                </button>

                {/* BOUTON GUÉRILLA (SCAN WEB) */}
                <button 
                    onClick={scrapeWebMatches} 
                    className="p-2 bg-blue-900/30 border border-blue-500/30 rounded-full hover:bg-blue-900/50 transition-colors"
                    title="Scanner le Web (Guérilla - Si API vide)"
                >
                    <Globe size={14} className="text-blue-400" />
                </button>
            </div>
            
            <span className="text-sm text-gray-500 font-mono ml-5 mt-1 block">
                {displayedMatches.length} affichés
            </span>
        </div>

        {/* Filtres Compétitions */}
        <div className="flex bg-surface border border-neutral-800 rounded-lg p-1 overflow-x-auto">
            {['ALL', 'ATP', 'WTA', 'CHALLENGER', 'ITF'].map((c) => (
                <button 
                    key={c}
                    onClick={() => setCircuitFilter(c as any)}
                    className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap flex items-center gap-1 ${circuitFilter === c ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    {c === 'ALL' && <Trophy size={10} />}
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
          <p className="text-xs text-gray-600 mt-2">Essayez le bouton Globe 🌍 pour chercher sur le web.</p>
        </div>
      )}

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};
