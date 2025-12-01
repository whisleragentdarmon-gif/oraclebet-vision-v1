import React from 'react';
import { OddsAnalysis } from '../engine/types';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface Props {
  analysis: OddsAnalysis;
  fairOdds?: { p1: number; p2: number };
  player1: string;
  player2: string;
}

export const OddsComparator: React.FC<Props> = ({ analysis, fairOdds, player1, player2 }) => {
  // Trouver la meilleure cote absolue pour P1 et P2
  const maxP1 = Math.max(...analysis.bookmakers.map(b => b.p1));
  const maxP2 = Math.max(...analysis.bookmakers.map(b => b.p2));

  return (
    <div className="bg-surfaceHighlight rounded-xl border border-neutral-800 overflow-hidden">
      {/* En-tête */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-black/20">
        <h3 className="font-bold text-white flex items-center gap-2">
           <TrendingUp size={18} className="text-neon"/> Scanner de Cotes
        </h3>
        <span className="text-xs text-gray-400">
           Meilleur choix : <span className="text-white font-bold">{analysis.recommendedBookie}</span>
        </span>
      </div>

      {/* Colonnes */}
      <div className="grid grid-cols-4 text-[10px] text-gray-500 uppercase tracking-widest p-2 bg-neutral-900 border-b border-neutral-800">
          <div className="pl-2">Bookmaker</div>
          <div className="text-center">{player1.slice(0,10)}..</div>
          <div className="text-center">{player2.slice(0,10)}..</div>
          <div className="text-right pr-2">Marge</div>
      </div>

      {/* Liste des Bookmakers */}
      <div className="p-2 space-y-1">
        {analysis.bookmakers.map((bookie, idx) => {
          const isBestP1 = bookie.p1 === maxP1;
          const isBestP2 = bookie.p2 === maxP2;
          // Calcul simple de la marge du bookmaker (Payout)
          // Formule: 1 / ((1/p1) + (1/p2)) * 100
          const payout = Math.round((1 / ((1/bookie.p1) + (1/bookie.p2))) * 100);

          return (
            <div key={idx} className="grid grid-cols-4 items-center bg-black/20 p-3 rounded hover:bg-white/5 transition-colors">
               
               {/* 1. Nom Bookmaker */}
               <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${bookie.name === analysis.recommendedBookie ? 'text-neon' : 'text-gray-300'}`}>
                      {bookie.name}
                  </span>
               </div>
               
               {/* 2. Cote P1 */}
               <div className="text-center">
                   <div className={`inline-block px-2 py-1 rounded font-mono font-bold text-sm ${isBestP1 ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-neutral-800 text-gray-400'}`}>
                     {bookie.p1.toFixed(2)}
                   </div>
                   {/* Indicateur de value par rapport à l'IA */}
                   {fairOdds && bookie.p1 > fairOdds.p1 && isBestP1 && (
                       <span className="block text-[8px] text-green-400 mt-0.5">VALUE</span>
                   )}
               </div>

               {/* 3. Cote P2 */}
               <div className="text-center">
                   <div className={`inline-block px-2 py-1 rounded font-mono font-bold text-sm ${isBestP2 ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-neutral-800 text-gray-400'}`}>
                     {bookie.p2.toFixed(2)}
                   </div>
                   {fairOdds && bookie.p2 > fairOdds.p2 && isBestP2 && (
                       <span className="block text-[8px] text-green-400 mt-0.5">VALUE</span>
                   )}
               </div>

               {/* 4. Marge / Payout */}
               <div className="text-right pr-2">
                  <div className="flex flex-col items-end">
                      <span className={`text-xs font-bold ${payout > 95 ? 'text-green-500' : payout > 92 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {payout}%
                      </span>
                      <span className="text-[8px] text-gray-600">TRJ</span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
      
      {analysis.bookmakers.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-xs italic">
              Aucune donnée de cotes en temps réel pour ce match.
          </div>
      )}
    </div>
  );
};
