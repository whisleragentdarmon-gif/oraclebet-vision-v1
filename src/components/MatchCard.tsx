import React from 'react';
import { Match } from '../types';
import { Trophy, Clock, Zap } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, selected, onClick, compact }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-neon/50
        ${selected ? 'border-neon ring-1 ring-neon shadow-[0_0_15px_rgba(255,122,0,0.2)]' : 'border-neutral-800'}
        ${compact ? 'py-3' : 'py-4'}
      `}
    >
      {/* En-tête : Tournoi et Heure */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Trophy size={12} className="text-neon" />
          <span className="truncate max-w-[120px]">{match.tournament}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs">
           {match.status === 'LIVE' ? (
             <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
               <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE
             </span>
           ) : (
             <span className="flex items-center gap-1 text-gray-500">
               <Clock size={12} /> {match.time}
             </span>
           )}
        </div>
      </div>

      {/* Les Joueurs */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`font-medium ${match.ai?.winner === match.player1.name ? 'text-neon' : 'text-white'}`}>
            {match.player1.name}
          </span>
          <span className="text-sm font-mono text-gray-400">{match.odds.p1.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className={`font-medium ${match.ai?.winner === match.player2.name ? 'text-neon' : 'text-white'}`}>
            {match.player2.name}
          </span>
          <span className="text-sm font-mono text-gray-400">{match.odds.p2.toFixed(2)}</span>
        </div>
      </div>

      {/* Badges IA (Si non compact) */}
      {!compact && match.ai && (
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-neon">
            <Zap size={12} />
            <span>IA: {match.ai.confidence}%</span>
          </div>
          <span className="text-[10px] bg-neutral-800 text-gray-400 px-2 py-1 rounded border border-neutral-700">
            {match.ai.riskLevel}
          </span>
        </div>
      )}
    </div>
  );
};
