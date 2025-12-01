import React, { useState } from 'react';
import { OracleAI } from '../engine';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { useData } from '../context/DataContext';
import { BetRecord } from '../engine/types';
import { jsPDF } from 'jspdf';
import { ShieldCheck, Scale, DollarSign, Star, Copy, Send, FileText, Save, ExternalLink, RefreshCw } from 'lucide-react';

export const ComboPage: React.FC = () => {
  const { matches } = useData();
  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();

  // On ne garde que les matchs futurs pour les combinés
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
  const strategies = OracleAI.combo.generateStrategies(upcomingMatches);

  const [activeTab, setActiveTab] = useState<'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium'>('Balanced');
  const activeStrategy = strategies.find(s => s.type === activeTab);

  const handleCopy = () => {
    if (!activeStrategy) return;
    let msg = `🔥 OracleBet Ticket ${activeStrategy.type} 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 ${s.selection} @ ${s.odds.toFixed(2)}\n📝 Confiance: ${s.confidence}%\n\n`;
    });
    msg += `💰 Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}`;
    navigator.clipboard.writeText(msg);
    alert('✅ Ticket copié !');
  };

  const handleTelegram = async () => {
    if (!activeStrategy) return;
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      alert('⚠️ Config Telegram manquante (Page VIP).');
      return;
    }
    let msg = `🔥 <b>OracleBet - Ticket ${activeStrategy.type}</b> 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 <b>${s.selection}</b> @ ${s.odds.toFixed(2)}\n<i>${s.reason}</i>\n\n`;
    });
    msg += `💰 <b>Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}</b>`;
    
    try {
      await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramConfig.chatId, text: msg, parse_mode: 'HTML' })
      });
      alert('🚀 Envoyé sur Telegram !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur Telegram.');
    }
  };

  const handleArchive = () => {
    if (!activeStrategy) return;
    const id = Date.now().toString();
    const ticket: BetRecord = {
      id,
      matchId: 'combo-' + id,
      matchTitle: `Combiné ${activeStrategy.type} (${activeStrategy.selections.length} matchs)`,
      selection: 'Combiné',
      odds: activeStrategy.combinedOdds,
      stake: 0,
      status: 'PENDING',
      profit: 0,
      date: new Date().toLocaleString(),
      confidenceAtTime: activeStrategy.successProbability
    };
    addPendingTicket(ticket);
    alert('💾 Archivé dans Ma Bankroll.');
  };

  const tabs = [
    { id: 'Safe', label: 'Safe', icon: ShieldCheck, color: 'text-green-500', border: 'border-green-500' },
    { id: 'Balanced', label: 'Équilibré', icon: Scale, color: 'text-blue-500', border: 'border-blue-500' },
    { id: 'Value', label: 'Value Bet', icon: DollarSign, color: 'text-yellow-500', border: 'border-yellow-500' },
    { id: 'Oracle Ultra Premium', label: 'Ultra Premium', icon: Star, color: 'text-neon', border: 'border-neon' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Générateur de Combinés IA</h2>
        <p className="text-sm text-gray-400">Analyse de {upcomingMatches.length} matchs à venir pour trouver les meilleures combinaisons.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${activeTab === tab.id ? `bg-surfaceHighlight ${tab.border} shadow-lg` : 'bg-surface border-neutral-800 hover:bg-neutral-800'}`}
          >
            <tab.icon size={24} className={`mb-2 ${tab.color}`} />
            <span className={`font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>{tab.label}</span>
          </button>
        ))}
      </div>

      {!activeStrategy ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-xl border border-neutral-800 border-dashed">
            <Scale size={48} className="text-gray-600 mb-4"/>
            <p className="text-gray-500">Pas assez de matchs sûrs pour cette stratégie.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
                {activeStrategy.selections.map((sel, idx) => (
                    <div key={idx} className="bg-surface border border-neutral-800 rounded-xl p-4 flex justify-between items-center hover:border-neon/30 transition-colors">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{sel.player1} vs {sel.player2}</p>
                            <p className="text-white font-bold text-lg">{sel.selection}</p>
                            <p className="text-xs text-neon mt-1 flex items-center gap-1"><Star size={10}/> {sel.reason}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-bold text-white">{sel.odds.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">{sel.confidence}% Conf.</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full lg:w-80 space-y-4">
                <div className="bg-surfaceHighlight p-6 rounded-xl border border-neutral-700">
                    <p className="text-gray-400 text-xs uppercase mb-1">Cote Totale</p>
                    <p className="text-4xl font-mono font-bold text-white mb-4">{activeStrategy.combinedOdds.toFixed(2)}</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Probabilité</span><span className="text-white font-bold">{activeStrategy.successProbability}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Risque</span><span className={`font-bold ${activeStrategy.riskScore === 'Low' ? 'text-green-500' : 'text-orange-500'}`}>{activeStrategy.riskScore}</span></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleCopy} className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"><Copy size={16} className="text-blue-400"/> Copier</button>
                    <button onClick={handleTelegram} className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"><Send size={16} className="text-blue-500"/> Telegram</button>
                    <button onClick={handleArchive} className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"><Save size={16} className="text-green-400"/> Archiver</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
