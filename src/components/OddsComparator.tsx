import React from 'react';
import { ArrowRight, BarChart } from 'lucide-react';

interface OddsAnalysis {
  provider: string;
  p1: number;
  p2: number;
}

interface OddsComparatorProps {
  analysis?: OddsAnalysis[];
  fairOdds?: { p1: number; p2: number };
  player1: string;
  player2: string;
}

export const OddsComparator: React.FC<OddsComparatorProps> = ({ analysis, fairOdds, player1, player2 }) => {
  // Mock data if analysis is missing (to prevent crash)
  const oddsData = analysis || [
    { provider: 'Betclic', p1: 1.85, p2: 1.95 },
    { provider: 'Winamax', p1: 1.88, p2: 1.92 },
    { provider: 'Unibet', p1: 1.82, p2: 2.00 },
  ];

  return (
    <div className="bg-surfaceHighlight rounded-xl p-6 border border-neutral-700">
      <div className="flex items-center gap-2 mb-4">
         <BarChart className="text-neon" size={20} />
         <h3 className="font-bold text-white">Comparateur de Cotes</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-neutral-700">
              <th className="text-left pb-2">Bookmaker</th>
              <th className="text-center pb-2">{player1}</th>
              <th className="text-center pb-2">{player2}</th>
              <th className="text-right pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {oddsData.map((book, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-3 font-bold text-gray-300">{book.provider}</td>
                <td className="py-3 text-center">
                   <span className={`px-2 py-1 rounded ${fairOdds && book.p1 > fairOdds.p1 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-400'}`}>
                     {book.p1.toFixed(2)}
                   </span>
                </td>
                <td className="py-3 text-center">
                   <span className={`px-2 py-1 rounded ${fairOdds && book.p2 > fairOdds.p2 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-400'}`}>
                     {book.p2.toFixed(2)}
                   </span>
                </td>
                <td className="py-3 text-right">
                   <button className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto transition-colors">
                     Parier <ArrowRight size={12} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {fairOdds && (
          <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between text-xs text-gray-500">
              <span>Fair Odds (IA): {fairOdds.p1.toFixed(2)} vs {fairOdds.p2.toFixed(2)}</span>
              <span className="text-neon">Détection de Value Bet active</span>
          </div>
      )}
    </div>
  );
};
