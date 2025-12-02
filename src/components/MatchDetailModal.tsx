import React, { useState } from 'react';
import { Match, PastMatch } from '../types';
import { useData } from '../context/DataContext';
import { X, Trophy, Clock, Zap, Calendar, BarChart3, Map, Swords } from 'lucide-react';

interface Props {
  match: Match | null;
  onClose: () => void;
}

// ✅ L'export est bien ici
export const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const { matches } = useData(); // Connexion au flux live
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'FORM' | 'STATS'>('ANALYSIS');

  if (!match) return null;

  // On récupère la version la plus à jour du match (pour le score live)
  const liveMatch = matches.find(m => m.id === match.id) || match;

  // Parsing du score (Ex: "6-4 3-2")
  const parseScore = (scoreStr?: string) => {
      if (!scoreStr) return { s1: [0,0,0], s2: [0,0,0] };
      const sets = scoreStr.split(' ');
      const s1 = [0,0,0];
      const s2 = [0,0,0];
      sets.forEach((set, i) => {
          if(i < 3 && set.includes('-')) {
              const p = set.split('-');
              s1[i] = parseInt(p[0]) || 0;
              s2[i] = parseInt(p[1]) || 0;
          }
      });
      return { s1, s2 };
  };

  const scores = parseScore(liveMatch.score);

  // --- 1. SCOREBOARD TV ---
  const TennisScoreboard = () => (
    <div className="bg-black border-y border-neutral-800 p-4">
        <div className="flex justify-end gap-6 text-xs text-gray-500 mb-2 px-4">
            <span className="w-4 text-center">S1</span>
            <span className="w-4 text-center">S2</span>
            <span className="w-4 text-center">S3</span>
        </div>
        {/* Joueur 1 */}
        <div className="flex items-center justify-between bg-surfaceHighlight/50 p-2 rounded mb-1">
            <div className="flex items-center gap-3">
                {liveMatch.status === 'LIVE' && <span className="text-neon text-[10px] animate-pulse">●</span>}
                <span className={`font-bold ${liveMatch.ai?.winner === liveMatch.player1.name ? 'text-neon' : 'text-white'}`}>
                    {liveMatch.player1.name}
                </span>
            </div>
            <div className="flex gap-6 font-mono font-bold text-lg">
                <span className="w-4 text-center text-white">{scores.s1[0]}</span>
                <span className="w-4 text-center text-white">{scores.s1[1]}</span>
                <span className="w-4 text-center text-white">{scores.s1[2]}</span>
            </div>
        </div>
        {/* Joueur 2 */}
        <div className="flex items-center justify-between p-2 rounded">
            <div className="flex items-center gap-3">
                <span className="w-3"></span>
                <span className={`font-bold ${liveMatch.ai?.winner === liveMatch.player2.name ? 'text-neon' : 'text-white'}`}>
                    {liveMatch.player2.name}
                </span>
            </div>
            <div className="flex gap-6 font-mono font-bold text-lg">
                <span className="w-4 text-center text-white">{scores.s2[0]}</span>
                <span className="w-4 text-center text-white">{scores.s2[1]}</span>
                <span className="w-4 text-center text-white">{scores.s2[2]}</span>
            </div>
        </div>
        {liveMatch.score && <div className="text-center text-xs text-gray-500 mt-2">Score: {liveMatch.score}</div>}
    </div>
  );

  // --- 2. BARRES DE SURFACE ---
  const SurfaceBar = ({ label, p1Val, p2Val, type }: { label: string, p1Val: number, p2Val: number, type: 'Hard'|'Clay'|'Grass' }) => {
      const isCurrentSurface = liveMatch.surface === type;
      return (
        <div className={`mb-3 ${isCurrentSurface ? 'opacity-100' : 'opacity-50 grayscale'}`}>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-300">{p1Val}%</span>
                <span className={`font-bold uppercase ${isCurrentSurface ? 'text-neon' : 'text-gray-500'}`}>{label}</span>
                <span className="font-bold text-gray-300">{p2Val}%</span>
            </div>
            <div className="flex w-full h-2 bg-neutral-800 rounded-full overflow-hidden gap-1">
                <div className="h-full bg-blue-500 justify-end flex" style={{width: `${p1Val}%`}}></div>
                <div className="h-full bg-neutral-700 flex-1"></div>
                <div className="h-full bg-orange-500" style={{width: `${p2Val}%`}}></div>
            </div>
        </div>
      );
  };

  const MatchHistoryRow = ({ m }: { m: PastMatch }) => (
    <div className="flex items-center justify-between text-xs p-2 border-b border-neutral-800 hover:bg-white/5">
        <div className="flex items-center gap-2 w-24">
            <span className="text-gray-500">{m.date}</span>
            <span className={`px-1 rounded text-[10px] font-bold ${m.surface === 'Clay' ? 'bg-orange-900 text-orange-200' : 'bg-blue-900 text-blue-200'}`}>
                {m.surface.substring(0, 1)}
            </span>
        </div>
        <div className="flex-1 font-medium text-gray-300 truncate px-2">{m.opponent}</div>
        <div className="flex items-center gap-3">
            <span className="font-mono text-white">{m.score}</span>
            <span className={`w-5 h-5 flex items-center justify-center rounded font-bold text-[10px] ${m.result === 'W' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                {m.result}
            </span>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-carbon border border-neutral-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-surface p-4 flex justify-between items-center">
           <div className="flex items-center gap-2 text-neon">
              <Trophy size={16} />
              <span className="text-xs font-bold tracking-widest uppercase">{liveMatch.tournament}</span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-xs text-white bg-neutral-800 px-2 py-0.5 rounded">{liveMatch.surface}</span>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
           </button>
        </div>

        {/* Scoreboard */}
        <TennisScoreboard />

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-surface">
            <button onClick={() => setActiveTab('ANALYSIS')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'ANALYSIS' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Zap size={14} /> ORACLE
            </button>
            <button onClick={() => setActiveTab('FORM')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'FORM' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Calendar size={14} /> FORME & H2H
            </button>
            <button onClick={() => setActiveTab('STATS')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'STATS' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <BarChart3 size={14} /> STATS LIVE
            </button>
        </div>

        <div className="overflow-y-auto p-6 bg-carbon">
            
            {/* TAB 1: ANALYSE */}
            {activeTab === 'ANALYSIS' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-neutral-900 to-black p-5 rounded-xl border border-neutral-700 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10"><Zap size={100}/></div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Recommendation</p>
                            <p className="text-2xl font-bold text-white">{liveMatch.ai?.recommendedBet}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon" style={{width: `${liveMatch.ai?.confidence}%`}}></div>
                                </div>
                                <span className="text-xs text-neon font-bold">{liveMatch.ai?.confidence}% Safe</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase">Cote IA (Value)</p>
                            <p className="text-xl font-mono text-neon">{liveMatch.ai?.fairOdds?.p1.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 line-through">{liveMatch.odds.p1.toFixed(2)} bookie</p>
                        </div>
                    </div>
                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-white text-sm font-bold mb-3 border-l-2 border-neon pl-2">Analyse du match</h4>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">{liveMatch.ai?.qualitativeAnalysis}</p>
                    </div>
                </div>
            )}

            {/* TAB 2: FORME */}
            {activeTab === 'FORM' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <Map size={14} className="text-neon"/> Performance par Surface (Winrate)
                        </h4>
                        <SurfaceBar label="Terre Battue" p1Val={liveMatch.player1.surfacePrefs.clay} p2Val={liveMatch.player2.surfacePrefs.clay} type="Clay" />
                        <SurfaceBar label="Dur" p1Val={liveMatch.player1.surfacePrefs.hard} p2Val={liveMatch.player2.surfacePrefs.hard} type="Hard" />
                        <SurfaceBar label="Gazon" p1Val={liveMatch.player1.surfacePrefs.grass} p2Val={liveMatch.player2.surfacePrefs.grass} type="Grass" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-bold text-white mb-2">{liveMatch.player1.name}</p>
                            <div className="bg-black/40 rounded-lg border border-neutral-800 overflow-hidden">
                                {liveMatch.player1.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-3 text-xs text-gray-500">Aucune donnée</p>}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white mb-2">{liveMatch.player2.name}</p>
                            <div className="bg-black/40 rounded-lg border border-neutral-800 overflow-hidden">
                                {liveMatch.player2.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-3 text-xs text-gray-500">Aucune donnée</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: STATS */}
            {activeTab === 'STATS' && (
                <div className="text-center p-8 text-gray-500 animate-fade-in">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Statistiques live disponibles uniquement pour les tournois majeurs.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
