import React, { useState } from 'react';
import { Match, PastMatch } from '../types';
import { X, Trophy, Clock, Activity, Zap, TrendingUp, AlertTriangle, Calendar, FileText, BarChart3 } from 'lucide-react';

interface Props {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'FORM' | 'STATS'>('ANALYSIS');

  if (!match) return null;

  // Composant pour afficher une ligne de match passé (Style Flashscore)
  const MatchHistoryRow = ({ m }: { m: PastMatch }) => (
    <div className="flex items-center justify-between text-xs p-2 border-b border-neutral-800 hover:bg-white/5">
        <div className="flex items-center gap-2 w-24">
            <span className="text-gray-500">{m.date}</span>
            <span className={`px-1 rounded text-[10px] ${m.surface === 'Clay' ? 'bg-orange-700 text-orange-100' : 'bg-blue-800 text-blue-100'}`}>
                {m.surface.substring(0, 1)}
            </span>
        </div>
        <div className="flex-1 font-medium text-gray-300 truncate px-2">
            {m.opponent}
        </div>
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-surface border border-neutral-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Compact */}
        <div className="bg-surfaceHighlight p-4 border-b border-neutral-700 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-4">
              <div className="text-right">
                  <p className="text-xl font-bold text-white">{match.player1.name}</p>
                  <p className="text-xs text-gray-500">#{match.player1.rank} • {match.player1.country}</p>
              </div>
              <div className="bg-black/50 px-3 py-1 rounded text-neon font-mono font-bold text-xl">
                  {match.score || "VS"}
              </div>
              <div>
                  <p className="text-xl font-bold text-white">{match.player2.name}</p>
                  <p className="text-xs text-gray-500">#{match.player2.rank} • {match.player2.country}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
           </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-neutral-700 bg-black/20 shrink-0">
            <button 
                onClick={() => setActiveTab('ANALYSIS')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'ANALYSIS' ? 'border-neon text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
                <Zap size={16} /> Analyse IA
            </button>
            <button 
                onClick={() => setActiveTab('FORM')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'FORM' ? 'border-neon text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
                <Calendar size={16} /> Forme & H2H
            </button>
            <button 
                onClick={() => setActiveTab('STATS')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'STATS' ? 'border-neon text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
                <BarChart3 size={16} /> Stats Live
            </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-6">
            
            {/* TAB 1: ANALYSE IA (L'ancien contenu) */}
            {activeTab === 'ANALYSIS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-gradient-to-br from-neutral-900 to-black p-4 rounded-xl border border-neutral-700 relative overflow-hidden md:col-span-2">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={64}/></div>
                        <p className="text-gray-400 text-xs uppercase mb-2">Verdict Oracle</p>
                        <p className="text-2xl font-bold text-white mb-1">{match.ai?.recommendedBet}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-neon" style={{width: `${match.ai?.confidence}%`}}></div>
                            </div>
                            <span className="text-xs text-neon">{match.ai?.confidence}% Confiance</span>
                        </div>
                    </div>
                    
                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-neon text-sm font-bold mb-2 flex items-center gap-2"><FileText size={14}/> Analyse Qualitative</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{match.ai?.qualitativeAnalysis}</p>
                    </div>

                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2"><TrendingUp size={14}/> Fair Odds (Valeur)</h4>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Cote IA</span>
                            <span className="font-mono font-bold text-white">{match.ai?.fairOdds?.p1.toFixed(2)} vs {match.ai?.fairOdds?.p2.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Bookmaker</span>
                            <span className="font-mono font-bold text-neon">{match.odds.p1.toFixed(2)} vs {match.odds.p2.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: FORME (Le style Flashscore) */}
            {activeTab === 'FORM' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    {/* Player 1 Form */}
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-neutral-700 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon"></span>
                                <h4 className="font-bold text-white">{match.player1.name}</h4>
                            </div>
                            <span className="text-xs text-gray-500">5 derniers matchs</span>
                        </div>
                        <div className="bg-black/20 rounded-xl overflow-hidden border border-neutral-800">
                            {match.player1.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-4 text-xs text-gray-500">Pas de données.</p>}
                        </div>
                    </div>

                    {/* Player 2 Form */}
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-neutral-700 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <h4 className="font-bold text-white">{match.player2.name}</h4>
                            </div>
                            <span className="text-xs text-gray-500">5 derniers matchs</span>
                        </div>
                        <div className="bg-black/20 rounded-xl overflow-hidden border border-neutral-800">
                            {match.player2.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-4 text-xs text-gray-500">Pas de données.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: STATS */}
            {activeTab === 'STATS' && (
                <div className="text-center p-8 text-gray-500 animate-fade-in">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Les statistiques en direct (Service, Fautes directes) seront connectées via l'API.</p>
                    <p className="text-xs mt-2">Pour l'instant, l'IA utilise les données saisies en interne.</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
