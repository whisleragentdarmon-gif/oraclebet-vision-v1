import React from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { History, ListChecks } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll();
  // On filtre pour ne garder que les matchs finis (pour la validation IA)
  const matches = MOCK_MATCHES.filter(m => m.status === 'FINISHED');

  return (
    <div className="space-y-12">
      
      {/* SECTION 1 : VALIDATION DES MATCHS IA */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-neutral-800 rounded-full text-neon">
                <ListChecks size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold">Validation des Prédictions</h2>
                <p className="text-sm text-gray-400">Validez les matchs terminés pour entraîner l'IA.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
            <MatchCard key={match.id} match={match} />
            ))}
        </div>

        {matches.length === 0 && (
            <div className="text-center p-8 text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                Aucun match en attente de validation IA.
            </div>
        )}
      </div>

      {/* SECTION 2 : HISTORIQUE FINANCIER (LE TABLEAU DÉPLACÉ) */}
      <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-surfaceHighlight">
          <div className="flex items-center gap-3">
             <History className="text-neon" size={20} />
             <h3 className="font-bold text-lg">Journal des Paris Réels</h3>
          </div>
          <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-neutral-700">
              {state.history.length} paris enregistrés
          </span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 text-gray-200 uppercase text-xs tracking-wider">
                <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Match</th>
                <th className="p-4">Sélection</th>
                <th className="p-4 text-center">Mise</th>
                <th className="p-4 text-center">Cote</th>
                <th className="p-4 text-right">Résultat</th>
                <th className="p-4 text-right">P&L</th>
                </tr>
            </thead>
            <tbody>
                {state.history.length > 0 ? state.history.map(bet => (
                <tr key={bet.id} className="border-t border-neutral-800 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs font-mono">{bet.date.split(',')[0]}</td>
                    <td className="p-4 font-medium text-white">{bet.matchTitle}</td>
                    <td className="p-4">
                        <span className="text-neon font-bold">{bet.selection}</span>
                    </td>
                    <td className="p-4 text-center">
                        {typeof bet.stake === 'number' ? bet.stake.toFixed(2) : bet.stake} €
                    </td>
                    <td className="p-4 text-center font-bold text-white">
                        {bet.odds.toFixed(2)}
                    </td>
                    <td className={`p-4 text-right font-bold text-xs`}>
                         <span className={`px-2 py-1 rounded ${bet.status === 'WON' ? 'bg-green-900/30 text-green-400' : bet.status === 'LOST' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {bet.status}
                         </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${bet.status === 'WON' ? 'text-green-500' : bet.status === 'LOST' ? 'text-red-500' : 'text-gray-500'}`}>
                        {bet.profit > 0 ? '+' : ''}
                        {typeof bet.profit === 'number' ? bet.profit.toFixed(2) : bet.profit} €
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-600 italic">
                            Votre historique est vide. Placez des paris depuis la page "Matchs" pour remplir ce journal.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};
