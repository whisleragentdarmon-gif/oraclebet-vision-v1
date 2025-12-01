import React, { useState } from 'react';
import { OracleAI } from '../engine';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext'; // On utilise la mémoire
import { BetRecord } from '../engine/types';
import { jsPDF } from 'jspdf';
import { ShieldCheck, Scale, DollarSign, Star, Copy, Send, FileText, Save, ExternalLink, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

export const ComboPage: React.FC = () => {
  const { matches } = useData();
  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();
  const { saveAnalysis, getAnalysis } = useAnalysis(); // Pour stocker les scans

  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // 1. ENRICHISSEMENT DES DONNÉES
  // On prend les matchs et on regarde si une analyse God Mode existe en mémoire
  const enrichedMatches = matches.map(m => {
      const savedAnalysis = getAnalysis(m.id);
      if (savedAnalysis) {
          // Si analyse existe, on l'injecte dans le match pour que le générateur le voie
          return { ...m, ai: { ...m.ai, godModeAnalysis: savedAnalysis } };
      }
      return m;
  });

  // On ne garde que les matchs futurs
  const upcomingMatches = enrichedMatches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
  
  // 2. GÉNÉRATION DES STRATÉGIES (Basée sur les données enrichies)
  const strategies = OracleAI.combo.generateStrategies(upcomingMatches);

  const [activeTab, setActiveTab] = useState<'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium'>('Balanced');
  const activeStrategy = strategies.find(s => s.type === activeTab);

  // --- FONCTION DE SCAN MASSIF ---
  const runBatchScan = async () => {
      setScanning(true);
      
      // On simule un scan rapide sur tous les matchs (sans l'API Web pour aller vite, juste les moteurs internes)
      // Dans le futur, on pourrait faire l'appel Web sur les 3-4 meilleurs matchs seulement
      for (const match of upcomingMatches) {
          // On lance les moteurs internes (rapide)
          const analysis = OracleAI.predictor.runGodModeAnalysis(match);
          
          // On sauvegarde dans la mémoire globale
          saveAnalysis(match.id, analysis);
          
          // Petit délai pour l'effet visuel
          await new Promise(r => setTimeout(r, 50));
      }

      setScanning(false);
      setScanComplete(true);
      // On bascule auto sur l'onglet Premium si dispo
      setActiveTab('Oracle Ultra Premium');
  };

  // --- ACTIONS (Copy, Telegram, etc.) ---
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
      alert('⚠️ Config Telegram manquante.');
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
    } catch (err) { console.error(err); alert('❌ Erreur Telegram.'); }
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
      
      {/* HEADER AVEC LE BOUTON SCAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Générateur de Combinés IA</h2>
            <p className="text-sm text-gray-400">Analyse de {upcomingMatches.length} matchs à venir.</p>
          </div>

          <button 
            onClick={runBatchScan}
            disabled={scanning}
            className={`
                px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all
                ${scanning ? 'bg-neutral-800 text-gray-400' : scanComplete ? 'bg-green-900/50 text-green-400 border border-green-500/50' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'}
            `}
          >
            {scanning ? <RefreshCw className="animate-spin"/> : scanComplete ? <CheckCircle/> : <Cpu/>}
            {scanning ? 'Analyse du marché...' : scanComplete ? 'Marché Scanné' : 'Scanner le Marché (God Mode)'}
          </button>
      </div>

      {/* Onglets */}
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

      {/* Contenu */}
      {!activeStrategy ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-xl border border-neutral-800 border-dashed">
            <Scale size={48} className="text-gray-600 mb-4"/>
            <p className="text-gray-500">Aucun combiné disponible pour cette stratégie.</p>
            {activeTab === 'Oracle Ultra Premium' && !scanComplete && (
                <p className="text-xs text-neon mt-2 animate-pulse">Lancez le Scan God Mode pour débloquer le Premium.</p>
            )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            <div className="flex-1 space-y-4">
                {activeStrategy.analysis && (
                    <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg text-xs text-purple-300 mb-4">
                        💡 <b>IA Insight :</b> {activeStrategy.analysis}
                    </div>
                )}
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
                    <button onClick={() => {}} className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"><FileText size={16} className="text-red-400"/> PDF</button>
                    <button onClick={handleArchive} className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"><Save size={16} className="text-green-400"/> Archiver</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
