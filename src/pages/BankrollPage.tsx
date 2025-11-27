import React, { useState } from 'react';
import { useBankroll } from '../context/BankrollContext';
import { OracleAI } from '../engine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, PlayCircle, RefreshCcw } from 'lucide-react';

export const BankrollPage: React.FC = () => {
  const { state, resetBankroll, lastLearningLog } = useBankroll();
  const [newBudget, setNewBudget] = useState(20);
  const [simResults, setSimResults] = useState<any>(null);

  const runSimulation = () => {
    // Determine win rate from history or default to 60% if no history
    const winRate = state.totalBets > 0 ? (state.wins / state.totalBets) * 100 : 60;
    const avgOdds = state.history.length > 0 
        ? state.history.reduce((acc, curr) => acc + curr.odds, 0) / state.history.length 
        : 1.85;

    const results = OracleAI.bankroll.simulateFuture(state.currentBalance, winRate, avgOdds);
    setSimResults(results);
  };

  // Prepare chart data (reverse history for chronological order)
  const chartData = [...state.history].reverse().map((bet, index) => {
      // Reconstruct balance history simplified
      return { 
          name: `Bet ${index + 1}`, 
          profit: bet.profit 
      };
  });
  
  // Create cumulative balance array for chart
  let runningBalance = state.startBalance;
  const balanceCurve = chartData.map(d => {
      runningBalance += d.profit;
      return { name: d.name, balance: runningBalance };
  });
  // Add start point
  balanceCurve.unshift({ name: 'Start', balance: state.startBalance });

  return (
    <div className="space-y-8">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
                <Wallet className="text-neon" size={32} /> 
                Ma Bankroll
            </h2>
            <p className="text-gray-400 text-sm mt-1">Gestion, Suivi P&L et Simulation Monte Carlo</p>
        </div>
        <div className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-neutral-800">
            <span className="text-gray-400 text-xs uppercase px-2">Budget</span>
            <input 
                type="number" 
                value={newBudget} 
                onChange={(e) => setNewBudget(Number(e.target.value))}
                className="w-20 bg-black/40 border border-neutral-700 rounded px-2 py-1 text-white text-sm"
            />
            <button 
                onClick={() => resetBankroll(newBudget)}
                className="bg-neutral-700 hover:bg-neutral-600 p-2 rounded-lg text-white"
                title="Réinitialiser"
            >
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={48}/></div>
              <p className="text-gray-500 text-xs uppercase font-bold">Solde Actuel</p>
              <p className={`text-3xl font-mono font-bold mt-2 ${state.currentBalance >= state.startBalance ? 'text-green-500' : 'text-red-500'}`}>
                  {state.currentBalance.toFixed(2)} €
              </p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
              <p className="text-gray-500 text-xs uppercase font-bold">ROI Global</p>
              <p className={`text-3xl font-mono font-bold mt-2 ${state.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {state.roi > 0 ? '+' : ''}{state.roi}%
              </p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
              <p className="text-gray-500 text-xs uppercase font-bold">Winrate</p>
              <p className="text-3xl font-mono font-bold mt-2 text-white">
                  {state.totalBets > 0 ? ((state.wins / state.totalBets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{state.wins}V - {state.losses}D</p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
              <p className="text-gray-500 text-xs uppercase font-bold">Dernier Apprentissage</p>
              <p className="text-xs text-neon mt-3 italic leading-relaxed">
                  {lastLearningLog || "En attente de validation..."}
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
             <h3 className="font-bold text-lg mb-6">Évolution du Capital</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceCurve}>
                        <defs>
                            <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" hide />
                        <YAxis stroke="#666" fontSize={12} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Area type="monotone" dataKey="balance" stroke="#FF7A00" fillOpacity={1} fill="url(#colorBal)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Monte Carlo Simulator */}
          <div className="bg-surfaceHighlight border border-neutral-700 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <PlayCircle className="text-neon" /> Simulation
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                  Projeter votre bankroll sur 100 paris futurs basés sur vos stats actuelles.
              </p>
              
              <button 
                onClick={runSimulation}
                className="w-full bg-neon hover:bg-neonHover text-white font-bold py-3 rounded-lg mb-6 transition-colors"
              >
                  Lancer Simulation Monte Carlo
              </button>

              {simResults && (
                  <div className="space-y-4 animate-fade-in">
                      <div className="flex justify-between text-sm border-b border-neutral-700 pb-2">
                          <span className="text-gray-400">Bankroll Finale (Médiane)</span>
                          <span className="font-bold text-white">{simResults.finalBankroll} €</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-neutral-700 pb-2">
                          <span className="text-gray-400">Risque de Ruine</span>
                          <span className={`font-bold ${simResults.riskOfRuin > 5 ? 'text-red-500' : 'text-green-500'}`}>
                              {simResults.riskOfRuin}%
                          </span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-neutral-700 pb-2">
                          <span className="text-gray-400">Volatilité</span>
                          <span className="font-bold text-orange-400">{simResults.volatility}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Potentiel Max</span>
                          <span className="font-bold text-green-500">{simResults.maxBankroll} €</span>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* Bet History Table */}
      <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="font-bold">Historique de Paris</h3>
          <span className="text-xs text-gray-500">{state.history.length} paris validés</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 text-gray-200">
                <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Match</th>
                <th className="p-4">Sélection</th>
                <th className="p-4 text-center">Mise</th>
                <th className="p-4 text-center">Cote</th>
                <th className="p-4 text-right">Résultat</th>
                <th className="p-4 text-right">Gain</th>
                </tr>
            </thead>
            <tbody>
                {state.history.length > 0 ? state.history.map(bet => (
                <tr key={bet.id} className="border-t border-neutral-800 hover:bg-white/5">
                    <td className="p-4 text-xs font-mono">{bet.date.split(',')[0]}</td>
                    <td className="p-4 font-medium text-white">{bet.matchTitle}</td>
                    <td className="p-4">
                        <span className="text-neon">{bet.selection}</span>
                    </td>
                    <td className="p-4 text-center">{bet.stake.toFixed(2)} €</td>
                    <td className="p-4 text-center font-bold text-white">{bet.odds.toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold ${bet.status === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                          {bet.status}
                    </td>
                    <td className={`p-4 text-right font-bold ${bet.status === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                        {bet.profit > 0 ? '+' : ''}{bet.profit.toFixed(2)} €
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-600 italic">
                            Aucun pari validé pour le moment. Utilisez les boutons 👍/👎 sur les cartes de match.
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
