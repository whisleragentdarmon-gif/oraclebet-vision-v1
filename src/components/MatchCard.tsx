
import React from 'react';
import { Match } from '../types';
import { Trophy, Clock, Activity, TrendingUp, ShieldAlert, Siren, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, selected, compact }) => {
  const isLive = match.status === 'LIVE';
  
  // Access Bankroll Context safely
  let validateBet: any;
  try {
     const ctx = useBankroll();
     validateBet = ctx.validateBet;
  } catch(e) {}

  const handleValidation = (e: React.MouseEvent, isWin: boolean) => {
      e.stopPropagation();
      if (validateBet && match.ai) {
          const winnerIsP1 = match.ai.winner === match.player1.name;
          const odds = winnerIsP1 ? match.odds.p1 : match.odds.p2; 
          validateBet(match, match.ai.recommendedBet, odds, isWin);
      }
  };

  const getCircuitBadgeColor = (circuit: string) => {
      switch(circuit) {
          case 'WTA': return 'bg-pink-500/20 text-pink-500 border-pink-500/50';
          case 'CHALLENGER': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
          case 'ITF': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
          default: return 'bg-blue-500/20 text-blue-500 border-blue-500/50'; // ATP
      }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer group
        ${selected 
          ? 'bg-surfaceHighlight border-neon shadow-[0_0_15px_rgba(255,122,0,0.3)]' 
          : 'bg-surface border-neutral-800 hover:border-neutral-600 hover:bg-surfaceHighlight'
        }
      `}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${selected ? 'bg-neon' : 'bg-transparent group-hover:bg-neon/50'}`} />

      <div className={`${compact ? 'p-3' : 'p-5'} flex flex-col gap-3`}>
        
        {/* Header */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-medium tracking-wide uppercase">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {match.ai && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] border ${getCircuitBadgeColor(match.ai.circuit)}`}>
                    {match.ai.circuit}
                </span>
            )}
            <Trophy size={12} className="text-neon shrink-0" />
            <span className="truncate max-w-[120px]">{match.tournament}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isLive ? (
              <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                <Activity size={12} /> EN DIRECT
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {match.time}
              </span>
            )}
          </div>
        </div>

        {/* Players & Scores */}
        <div className="flex flex-col gap-2">
          {/* Player 1 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs w-4">{match.player1.rank}</span>
              <span className={`font-semibold ${selected ? 'text-white' : 'text-gray-200'}`}>
                {match.player1.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
               {isLive && match.score && (
                 <span className="text-neon font-mono text-sm">{match.score.split('|')[0]}</span>
               )}
               <span className="text-xs bg-black/40 px-2 py-1 rounded text-gray-400 min-w-[40px] text-center">
                 {match.odds.p1.toFixed(2)}
               </span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs w-4">{match.player2.rank}</span>
              <span className={`font-semibold ${selected ? 'text-white' : 'text-gray-200'}`}>
                {match.player2.name}
              </span>
            </div>
             <div className="flex items-center gap-4">
               {isLive && match.score && (
                 <span className="text-neon font-mono text-sm">{match.score.split('|')[1]}</span>
               )}
               <span className="text-xs bg-black/40 px-2 py-1 rounded text-gray-400 min-w-[40px] text-center">
                 {match.odds.p2.toFixed(2)}
               </span>
            </div>
          </div>
        </div>

        {/* Footer: AI Hint & Actions */}
        {!compact && match.ai && (
          <div className="mt-2 pt-3 border-t border-neutral-800">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-neon transition-all duration-500" style={{ width: `${match.ai.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400">{match.ai.confidence}% Conf.</span>
                </div>
                <div className="flex gap-2">
                  {match.ai.trap && match.ai.trap.isTrap && <ShieldAlert size={14} className="text-red-500 animate-pulse" title="Méfiance" />}
                  {match.ai.integrity && match.ai.integrity.isSuspicious && <Siren size={14} className="text-orange-500 animate-pulse" title="Suspicion" />}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-[10px] text-neon font-bold uppercase tracking-wider">
                        <TrendingUp size={12} />
                        <span>{match.ai.marketType === 'WINNER' ? 'Vainqueur' : match.ai.marketType}</span>
                    </div>
                    <span className="text-xs text-white font-bold">{match.ai.recommendedBet}</span>
                </div>
                
                {/* Validation Buttons */}
                <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
                    <button 
                        onClick={(e) => handleValidation(e, true)}
                        className="p-1.5 rounded hover:bg-green-500 hover:text-white text-green-500 transition-all flex items-center gap-1" 
                        title="Passé (Win)"
                    >
                        <ThumbsUp size={14} />
                        <span className="text-[10px] font-bold hidden group-hover:inline">Passé</span>
                    </button>
                    <div className="w-px bg-neutral-700 mx-1"></div>
                    <button 
                        onClick={(e) => handleValidation(e, false)}
                        className="p-1.5 rounded hover:bg-red-500 hover:text-white text-red-500 transition-all flex items-center gap-1" 
                        title="Raté (Loss)"
                    >
                        <ThumbsDown size={14} />
                        <span className="text-[10px] font-bold hidden group-hover:inline">Raté</span>
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
