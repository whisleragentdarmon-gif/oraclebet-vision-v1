import React from 'react';
import { Match } from '../types';
import { X, Trophy, Clock, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fond flouté sombre */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* La Carte Modale */}
      <div className="relative bg-surface border border-neutral-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-surfaceHighlight p-6 border-b border-neutral-700 flex justify-between items-start">
           <div>
              <div className="flex items-center gap-2 text-neon mb-1">
                 <Trophy size={16} />
                 <span className="text-xs font-bold tracking-widest uppercase">{match.tournament}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                  {match.player1.name} <span className="text-gray-500 text-lg">vs</span> {match.player2.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                 <Clock size={14} />
                 <span>{match.date} à {match.time}</span>
                 <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs border border-neutral-700">{match.surface}</span>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
           </button>
        </div>

        {/* Score Board (Si Live ou Fini) */}
        {(match.status === 'LIVE' || match.status === 'FINISHED') && (
            <div className="bg-black/40 p-6 flex justify-center items-center gap-8 border-b border-neutral-800">
                <div className="text-right">
                    <p className="font-bold text-lg text-white">{match.player1.name}</p>
                    {match.status === 'LIVE' && <p className="text-xs text-green-500 animate-pulse">Service ●</p>}
                </div>
                <div className="text-3xl font-mono font-bold text-neon tracking-widest">
                    {match.score || "0-0"}
                </div>
                <div>
                    <p className="font-bold text-lg text-white">{match.player2.name}</p>
                </div>
            </div>
        )}

        {/* AI Analysis Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Prediction Box */}
            <div className="bg-gradient-to-br from-neutral-900 to-black p-4 rounded-xl border border-neutral-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={64}/></div>
                <p className="text-gray-400 text-xs uppercase mb-2">Prédiction Oracle</p>
                <p className="text-xl font-bold text-white mb-1">{match.ai?.recommendedBet}</p>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-neon" style={{width: `${match.ai?.confidence}%`}}></div>
                    </div>
                    <span className="text-xs text-neon">{match.ai?.confidence}% Confiance</span>
                </div>
            </div>

            {/* Stats / Cotes */}
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-surfaceHighlight p-3 rounded-lg border border-neutral-800">
                    <span className="text-sm text-gray-400">Cote Réelle (Fair Odds)</span>
                    <div className="flex gap-4 font-mono text-sm font-bold text-white">
                        <span>1: <span className="text-neon">{match.ai?.fairOdds?.p1}</span></span>
                        <span>2: <span className="text-neon">{match.ai?.fairOdds?.p2}</span></span>
                    </div>
                </div>
                {match.ai?.integrity?.isSuspicious && (
                    <div className="flex items-center gap-2 bg-red-900/20 p-3 rounded-lg border border-red-500/50 text-red-400 text-xs">
                        <AlertTriangle size={16} />
                        <span>Alerte Intégrité : {match.ai.integrity.reason}</span>
                    </div>
                )}
            </div>

            {/* Live Stats (Simulées) */}
            <div className="md:col-span-2">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500"/> Dynamique du match
                </h3>
                <div className="h-24 bg-black/30 rounded-xl border border-neutral-800 flex items-end px-2 pb-2 gap-1">
                    {/* Fake Momentum Chart Bars */}
                    {[40, 50, 60, 45, 30, 20, 50, 70, 80, 60, 55, 40, 50, 60, 75].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t-sm ${h > 50 ? 'bg-neon' : 'bg-gray-700'}`} style={{height: `${h}%`}}></div>
                    ))}
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">Graphique de domination (Momentum)</p>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surfaceHighlight border-t border-neutral-700 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300">Fermer</button>
            <button className="px-4 py-2 rounded-lg bg-neon hover:bg-neonHover text-black font-bold text-sm flex items-center gap-2">
                <TrendingUp size={16} /> Voir sur le Bookmaker
            </button>
        </div>

      </div>
    </div>
  );
};
