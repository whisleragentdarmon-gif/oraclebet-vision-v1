import React from 'react';
import { OddsAnalysis } from '../engine/types';
import { ExternalLink, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Props {
  analysis: OddsAnalysis;
  fairOdds?: { p1: number; p2: number };
  player1: string;
  player2: string;
}

export const OddsComparator: React.FC<Props> = ({ analysis, fairOdds, player1, player2 }) => {
  return (
    <div className="bg-surfaceHighlight rounded-xl border border-neutral-800 overflow-hidden">
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
           Scanneur de Cotes
        </h3>
        <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded border border-green-500/30">
           {analysis.recommendedBookie} Recommandé
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 gap-2">
        {analysis.bookmakers.map((bookie, idx) => (
          <div key={idx} className="flex items-center justify-between bg-black/20 p-3 rounded hover:bg-black/40 transition-colors">
             <div className="flex items-center gap-3 w-1/3">
                <span className="font-bold text-sm text-gray-300">{bookie.name}</span>
                {bookie.isValue && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1 rounded">VALUE</span>}
             </div>
             
             <div className="flex gap-4 text-sm font-mono">
                <div className="flex flex-col items-center">
                   <span className={bookie.p1 >= (fairOdds?.p1 || 0) ? "text-green-400 font-bold" : "text-gray-500"}>
                     {bookie.p1.toFixed(2)}
                   </span>
                </div>
                <div className="flex flex-col items-center">
                   <span className={bookie.p2 >= (fairOdds?.p2 || 0) ? "text-green-400 font-bold" : "text-gray-500"}>
                     {bookie.p2.toFixed(2)}
                   </span>
                </div>
             </div>

             <div className="w-1/4 flex justify-end">
                <button className="text-gray-500 hover:text-white transition-colors">
                   <ExternalLink size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
