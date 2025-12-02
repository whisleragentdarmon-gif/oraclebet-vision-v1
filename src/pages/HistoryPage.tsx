import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MatchCard } from '../components/MatchCard';
import { History, ListChecks, BrainCircuit, CheckCircle } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AutoValidator } from '../engine/AutoValidator';

const accuracyData = [
  { month: 'Jan', acc: 65 }, { month: 'Fev', acc: 68 }, { month: 'Mar', acc: 72 },
  { month: 'Avr', acc: 70 }, { month: 'Mai', acc: 75 }, { month: 'Juin', acc: 78.5 }
];

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll(); // Contient l'historique de tes paris (déjà validés)
  const { matches } = useData();   // Contient tous les matchs de l'API
  const [autoLogs, setAutoLogs] = useState<string[]>([]);
  
  // 👇 LOGIQUE INTELLIGENTE :
  // On prend les matchs FINIS, mais on retire ceux qui sont DÉJÀ dans ta Bankroll (state.history)
  const matchesToValidate = matches.filter(m => {
      const isFinished = m.status === 'FINISHED';
      const alreadyValidated = state.history.some(bet => bet.matchId === m.id);
      return isFinished && !alreadyValidated;
  });

  const runAutoValidate = () => {
      const logs = AutoValidator.run(matches);
      if (logs.length > 0) {
          setAutoLogs(logs);
          setTimeout(() => setAutoLogs([]), 10000); 
      } else {
          alert("Aucun nouveau match à valider.");
      }
  };

  return (
    <div className="space-y-12">
      
      {/* Graphiques IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><BrainCircuit size={20}/></div>
                <div>
                    <h3 className="font-bold text-lg text-white">Évolution Précision IA</h3>
                    <p className="text-xs text-gray-500">Apprentissage continu</p>
                </div>
            </div>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accuracyData}>
                        <defs>
                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <YAxis domain={[50, 100]} stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Area type="monotone" dataKey="acc" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>
         
         {/* Stats rapides */}
         <div className="bg-surface border border-neutral-800 rounded-xl p-6">
             <h3 className="font-bold text-lg mb-4">Statut Validation</h3>
             <div className="text-center py-8">
                 <p className="text-4xl font-bold text-white">{matchesToValidate.length}</p>
                 <p className="text-gray-500 text-sm">Matchs en attente</p>
             </div>
         </div>
      </div>

      {/* Liste des matchs à valider */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-800 rounded-full text-neon"><ListChecks size={24} /></div>
                <div>
                    <h2 className="text-2xl font-bold">Validation ({matchesToValidate.length})</h2>
                    <p className="text-sm text-gray-400">Validez le résultat pour mettre à jour la Bankroll.</p>
                </div>
            </div>
        </div>

        {matchesToValidate.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesToValidate.map(match => (
                   <MatchCard key={match.id} match={match} />
                ))}
            </div>
        ) : (
            <div className="text-center p-12 text-gray-500 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center gap-2">
                <CheckCircle size={40} className="text-green-500 opacity-50"/>
                <p>Tout est à jour ! Aucun match en attente.</p>
            </div>
        )}
      </div>

      {/* Historique Financier */}
      <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-surfaceHighlight">
          <div className="flex items-center gap-3"><History className="text-neon" size={20} /><h3 className="font-bold text-lg">Journal des Paris</h3></div>
          <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-neutral-700">{state.history.length} paris</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 text-gray-200 uppercase text-xs tracking-wider">
                <tr><th className="p-4">Date</th><th className="p-4">Match</th><th className="p-4">Sélection</th><th className="p-4 text-center">Mise</th><th className="p-4 text-center">Cote</th><th className="p-4 text-right">Résultat</th><th className="p-4 text-right">P&L</th></tr>
            </thead>
            <tbody>
                {state.history.length > 0 ? state.history.map(bet => (
                <tr key={bet.id} className="border-t border-neutral-800 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs font-mono">{bet.date.split(',')[0]}</td>
                    <td className="p-4 font-medium text-white">{bet.matchTitle}</td>
                    <td className="p-4"><span className="text-neon font-bold">{bet.selection}</span></td>
                    <td className="p-4 text-center">{typeof bet.stake === 'number' ? bet.stake.toFixed(2) : bet.stake} €</td>
                    <td className="p-4 text-center font-bold text-white">{bet.odds.toFixed(2)}</td>
                    <td className="p-4 text-right"><span className={`px-2 py-1 rounded text-xs ${bet.status === 'WON' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{bet.status}</span></td>
                    <td className={`p-4 text-right font-bold ${bet.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>{bet.profit}€</td>
                </tr>
                )) : <tr><td colSpan={7} className="p-12 text-center text-gray-600">Historique vide.</td></tr>}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
