import React, { useState } from 'react';
import { Match, PastMatch } from '../types';
import { X, Trophy, Clock, Zap, Calendar, BarChart3, Map, Swords, Wind, Thermometer, Gauge, TrendingDown } from 'lucide-react';

interface Props {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'FORM' | 'EXPERT'>('ANALYSIS');

  if (!match) return null;

  const TennisScoreboard = () => (
    <div className="bg-black border-y border-neutral-800 p-4">
        {/* En-têtes Sets */}
        <div className="flex justify-end gap-6 text-xs text-gray-500 mb-2 px-4">
            <span className="w-4 text-center">S1</span>
            <span className="w-4 text-center">S2</span>
            <span className="w-4 text-center">PTS</span>
        </div>
        {/* J1 */}
        <div className="flex items-center justify-between bg-surfaceHighlight/50 p-2 rounded mb-1">
            <div className="flex items-center gap-3">
                {match.status === 'LIVE' && <span className="text-neon text-[10px]">🎾</span>}
                <span className={`font-bold ${match.ai?.winner === match.player1.name ? 'text-neon' : 'text-white'}`}>
                    {match.player1.name}
                </span>
            </div>
            <div className="flex gap-6 font-mono font-bold text-lg">
                <span className="w-4 text-center text-white">0</span>
                <span className="w-4 text-center text-white">0</span>
                <span className="w-4 text-center text-neon">0</span>
            </div>
        </div>
        {/* J2 */}
        <div className="flex items-center justify-between p-2 rounded">
            <div className="flex items-center gap-3">
                <span className="w-3"></span>
                <span className={`font-bold ${match.ai?.winner === match.player2.name ? 'text-neon' : 'text-white'}`}>
                    {match.player2.name}
                </span>
            </div>
            <div className="flex gap-6 font-mono font-bold text-lg">
                <span className="w-4 text-center text-white">0</span>
                <span className="w-4 text-center text-white">0</span>
                <span className="w-4 text-center text-white">0</span>
            </div>
        </div>
    </div>
  );

  const SurfaceBar = ({ label, p1Val, p2Val, type }: { label: string, p1Val: number, p2Val: number, type: 'Hard'|'Clay'|'Grass' }) => {
      const isCurrentSurface = match.surface === type;
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
        
        <div className="bg-surface p-4 flex justify-between items-center">
           <div className="flex items-center gap-2 text-neon">
              <Trophy size={16} />
              <span className="text-xs font-bold tracking-widest uppercase">{match.tournament}</span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-xs text-white bg-neutral-800 px-2 py-0.5 rounded">{match.surface}</span>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
           </button>
        </div>

        {match.status === 'LIVE' ? <TennisScoreboard /> : (
            <div className="bg-black border-y border-neutral-800 p-6 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-neon text-xl font-bold">{match.date}</p>
                    <p className="text-white text-3xl font-bold mt-1">{match.time}</p>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Match à venir</p>
                </div>
            </div>
        )}

        {/* Navigation Onglets */}
        <div className="flex border-b border-neutral-800 bg-surface">
            <button onClick={() => setActiveTab('ANALYSIS')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'ANALYSIS' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Zap size={14} /> ORACLE
            </button>
            <button onClick={() => setActiveTab('FORM')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'FORM' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Calendar size={14} /> FORME & H2H
            </button>
            <button onClick={() => setActiveTab('EXPERT')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'EXPERT' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Gauge size={14} /> DATA EXPERT
            </button>
        </div>

        <div className="overflow-y-auto p-6 bg-carbon">
            
            {/* TAB 1 : ANALYSE */}
            {activeTab === 'ANALYSIS' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-neutral-900 to-black p-5 rounded-xl border border-neutral-700 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-10"><Zap size={100}/></div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Recommendation</p>
                            <p className="text-2xl font-bold text-white">{match.ai?.recommendedBet}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon" style={{width: `${match.ai?.confidence}%`}}></div>
                                </div>
                                <span className="text-xs text-neon font-bold">{match.ai?.confidence}% Safe</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase">Cote IA (Value)</p>
                            <p className="text-xl font-mono text-neon">{match.ai?.fairOdds?.p1.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 line-through">{match.odds.p1.toFixed(2)} bookie</p>
                        </div>
                    </div>

                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-white text-sm font-bold mb-3 border-l-2 border-neon pl-2">Analyse du match</h4>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">{match.ai?.qualitativeAnalysis}</p>
                        
                        {match.ai?.integrity?.isSuspicious && (
                            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-full text-red-500"><TrendingDown size={16}/></div>
                                <div>
                                    <p className="text-red-400 font-bold text-xs uppercase">Alerte Intégrité</p>
                                    <p className="text-red-300 text-xs">{match.ai.integrity.reason}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2 : FORME */}
            {activeTab === 'FORM' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <Map size={14} className="text-neon"/> Performance par Surface (Winrate)
                        </h4>
                        <SurfaceBar label="Terre Battue (Clay)" p1Val={match.player1.surfacePrefs.clay} p2Val={match.player2.surfacePrefs.clay} type="Clay" />
                        <SurfaceBar label="Dur (Hard)" p1Val={match.player1.surfacePrefs.hard} p2Val={match.player2.surfacePrefs.hard} type="Hard" />
                        <SurfaceBar label="Gazon (Grass)" p1Val={match.player1.surfacePrefs.grass} p2Val={match.player2.surfacePrefs.grass} type="Grass" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <h4 className="font-bold text-white text-sm">{match.player1.name}</h4>
                            </div>
                            <div className="bg-black/40 rounded-lg border border-neutral-800 overflow-hidden">
                                {match.player1.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-3 text-xs text-gray-500">Aucune donnée</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                <h4 className="font-bold text-white text-sm">{match.player2.name}</h4>
                            </div>
                            <div className="bg-black/40 rounded-lg border border-neutral-800 overflow-hidden">
                                {match.player2.lastMatches?.map((m, i) => <MatchHistoryRow key={i} m={m} />) || <p className="p-3 text-xs text-gray-500">Aucune donnée</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3 : DATA EXPERT (NOUVEAU) */}
            {activeTab === 'EXPERT' && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Conditions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800 flex items-center gap-3">
                            <div className="bg-neutral-800 p-2 rounded-full text-blue-400"><Wind size={18}/></div>
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase">Météo</p>
                                <p className="text-white font-bold text-sm">Vent Modéré (15km/h)</p>
                            </div>
                        </div>
                        <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800 flex items-center gap-3">
                            <div className="bg-neutral-800 p-2 rounded-full text-orange-400"><Thermometer size={18}/></div>
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase">Température</p>
                                <p className="text-white font-bold text-sm">24°C (Balle rapide)</p>
                            </div>
                        </div>
                    </div>

                    {/* Mouvements Cotes */}
                    <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                        <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <BarChart3 size={14} className="text-neon"/> Mouvements de Cotes (Dernières 24h)
                        </h4>
                        
                        {match.ai?.oddsAnalysis?.bookmakers.map((bookie, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded mb-2">
                                <span className="text-gray-400 text-xs font-bold w-20">{bookie.name}</span>
                                <div className="flex items-center gap-4 text-sm font-mono">
                                    <div className="text-center">
                                        <span className="text-gray-600 text-[10px] line-through block">{bookie.openingOdds?.p1}</span>
                                        <span className={`font-bold ${bookie.movement === 'DOWN' ? 'text-green-500' : 'text-white'}`}>{bookie.p1}</span>
                                    </div>
                                    <span className="text-gray-700">|</span>
                                    <div className="text-center">
                                        <span className="text-gray-600 text-[10px] line-through block">{bookie.openingOdds?.p2}</span>
                                        <span className={`font-bold ${bookie.movement === 'DOWN' ? 'text-white' : 'text-red-500'}`}>{bookie.p2}</span>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${bookie.movement === 'CRASH' ? 'bg-red-500 text-white' : 'bg-neutral-800 text-gray-500'}`}>
                                    {bookie.movement === 'CRASH' ? 'SUSPECT' : bookie.movement}
                                </span>
                            </div>
                        ))}
                        {(!match.ai?.oddsAnalysis?.bookmakers || match.ai.oddsAnalysis.bookmakers.length === 0) && (
                            <p className="text-xs text-gray-500 text-center py-4">Pas de données de mouvement disponibles.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
