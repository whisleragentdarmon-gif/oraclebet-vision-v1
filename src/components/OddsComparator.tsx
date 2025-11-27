
import React from 'react';
import { OddsAnalysis, BookmakerOdds } from '../engine/types';
import { TrendingUp, TrendingDown, Minus, CheckCircle, ExternalLink, DollarSign, AlertTriangle } from 'lucide-react';

interface OddsComparatorProps {
  analysis: OddsAnalysis;
  fairOdds: { p1: number; p2: number };
  player1: string;
  player2: string;
}

export const OddsComparator: React.FC<OddsComparatorProps> = ({ analysis, fairOdds, player1, player2 }) => {
  
  const getLogoColor = (name: string) => {
      switch(name) {
          case 'Winamax': return 'text-red-600';
          case 'Betclic': return 'text-yellow-500';
          case 'Unibet': return 'text-green-500';
          case 'Pinnacle': return 'text-orange-500';
          case '1xBet': return 'text-blue-400';
          case 'Bet365': return 'text-green-600';
          default: return 'text-gray-300';
      }
  };

  const openBookmaker = (name: string) => {
      const urls: Record<string, string> = {
          'Winamax': 'https://www.winamax.fr/paris-sportifs',
          'Betclic': 'https://www.betclic.fr/',
          'Unibet': 'https://www.unibet.fr/sport',
          'ParionsSport': 'https://www.enligne.parionssport.fdj.fr/',
          'Pinnacle': 'https://www.pinnacle.com/',
          '1xBet': 'https://1xbet.com/',
          'Bet365': 'https://www.bet365.com/'
      };
      if (urls[name]) window.open(urls[name], '_blank');
  };

  return (
    <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in mt-8">
      
      {/* Header */}
      <div className="bg-surfaceHighlight p-4 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
            <DollarSign className="text-neon" size={20} />
            <h3 className="font-bold text-white text-lg">Comparateur Pro & Arbitrage</h3>
        </div>
        
        {/* Arbitrage Badge */}
        {analysis.arbitrage.isSurebet ? (
            <div className="bg-green-500/20 border border-green-500 px-3 py-1 rounded text-green-400 text-xs font-bold animate-pulse flex items-center gap-2">
                <CheckCircle size={14} />
                {analysis.arbitrage.msg}
            </div>
        ) : (
             <div className="text-gray-500 text-xs flex items-center gap-1">
                <Minus size={12} /> Pas de Surebet détecté
             </div>
        )}
      </div>

      {/* Recommendation Panel */}
      <div className="p-4 bg-black/20 border-b border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between border-r border-neutral-800 pr-4">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase">Bookmaker Recommandé</span>
                <span className={`text-xl font-bold ${getLogoColor(analysis.recommendedBookie)}`}>
                    {analysis.recommendedBookie}
                </span>
             </div>
             <button 
                onClick={() => openBookmaker(analysis.recommendedBookie)}
                className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded text-xs text-white flex items-center gap-1 transition-colors"
             >
                Ouvrir <ExternalLink size={12} />
             </button>
          </div>
          <div className="flex items-center justify-between pl-4">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase">Meilleure Value</span>
                 <span className="block text-neon font-bold">
                    + {((analysis.bestOdds.p1 / analysis.marketAverage.p1 - 1) * 100).toFixed(1)}% vs Moy.
                </span>
             </div>
             <div className="text-right">
                <span className="text-xs text-gray-500 block">Conseil Mise (Kelly)</span>
                <span className="text-white font-mono text-sm">{analysis.kelly.advice}</span>
             </div>
          </div>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-surfaceHighlight">
                <tr>
                    <th className="px-4 py-3">Bookmaker</th>
                    <th className="px-4 py-3 text-center">{player1}</th>
                    <th className="px-4 py-3 text-center">{player2}</th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">Mvt</th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">Payout</th>
                    <th className="px-4 py-3 text-right">Site</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
                
                {/* AI Fair Odds Row */}
                <tr className="bg-neon/5 border-l-4 border-neon">
                    <td className="px-4 py-3 font-bold text-neon flex items-center gap-2">
                        <BrainIcon /> FAIR ODDS (ORACLE)
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-neon">{fairOdds.p1}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-neon">{fairOdds.p2}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">-</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">-</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500 italic">Reference</td>
                </tr>

                {analysis.bookmakers.map((bookie, idx) => {
                    const isBestP1 = bookie.p1 === analysis.bestOdds.p1;
                    const isBestP2 = bookie.p2 === analysis.bestOdds.p2;
                    const isWorstP1 = bookie.p1 < analysis.marketAverage.p1 * 0.95;
                    const isWorstP2 = bookie.p2 < analysis.marketAverage.p2 * 0.95;

                    return (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                            <td className={`px-4 py-3 font-bold ${getLogoColor(bookie.name)}`}>
                                {bookie.name}
                                {bookie.isTrap && <span className="ml-2 text-[10px] bg-red-500/20 text-red-500 px-1 rounded border border-red-500/50">PIÈGE?</span>}
                            </td>
                            
                            {/* Player 1 Odds Cell */}
                            <td className={`px-4 py-3 text-center font-mono relative 
                                ${isBestP1 ? 'text-green-400 font-bold bg-green-900/10' : 'text-gray-300'}
                                ${isWorstP1 ? 'text-red-500 opacity-60' : ''}
                            `}>
                                {bookie.p1.toFixed(2)}
                                {bookie.p1 > fairOdds.p1 && !bookie.isTrap && (
                                    <div className="absolute top-1 right-1 text-[8px] bg-neon text-black px-1 rounded font-bold" title="Value Bet">
                                        VAL
                                    </div>
                                )}
                            </td>

                            {/* Player 2 Odds Cell */}
                            <td className={`px-4 py-3 text-center font-mono relative
                                ${isBestP2 ? 'text-green-400 font-bold bg-green-900/10' : 'text-gray-300'}
                                ${isWorstP2 ? 'text-red-500 opacity-60' : ''}
                            `}>
                                {bookie.p2.toFixed(2)}
                                {bookie.p2 > fairOdds.p2 && !bookie.isTrap && (
                                    <div className="absolute top-1 right-1 text-[8px] bg-neon text-black px-1 rounded font-bold" title="Value Bet">
                                        VAL
                                    </div>
                                )}
                            </td>
                            
                            {/* Movement */}
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                                {bookie.movement === 'UP' && <TrendingUp size={14} className="text-green-500 inline" />}
                                {bookie.movement === 'DOWN' && <TrendingDown size={14} className="text-red-500 inline" />}
                                {bookie.movement === 'STABLE' && <Minus size={14} className="text-gray-600 inline" />}
                            </td>

                            <td className="px-4 py-3 text-center text-gray-500 text-xs hidden md:table-cell">
                                {bookie.payout}%
                            </td>

                            <td className="px-4 py-3 text-right">
                                <button onClick={() => openBookmaker(bookie.name)} className="text-gray-400 hover:text-neon transition-colors">
                                    <ExternalLink size={14} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

      {/* Footer Alerts */}
      <div className="bg-black/40 p-3 text-xs flex gap-4 overflow-x-auto whitespace-nowrap">
         {analysis.arbitrage.isSurebet && (
             <div className="flex items-center gap-2 text-green-400">
                 <DollarSign size={12} />
                 <span>Miser sur {analysis.arbitrage.bookmakerP1} (P1) et {analysis.arbitrage.bookmakerP2} (P2)</span>
             </div>
         )}
         
         {analysis.bookmakers.some(b => b.isValue) && (
             <div className="flex items-center gap-2 text-neon">
                 <TrendingUp size={12} />
                 <span>Value Bets disponibles sur {analysis.bookmakers.filter(b => b.isValue).map(b => b.name).slice(0,2).join(', ')}</span>
             </div>
         )}
      </div>
    </div>
  );
};

const BrainIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
);
