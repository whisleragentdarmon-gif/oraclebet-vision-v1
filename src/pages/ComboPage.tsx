import React, { useState, useEffect } from 'react';
import { OracleAI } from '../engine';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { BetRecord, ComboStrategy } from '../engine/types';
import { ShieldCheck, Scale, DollarSign, Star, Copy, Send, FileText, Save, ExternalLink, RefreshCw, Cpu, CheckCircle, Lock, Ticket } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const ComboPage: React.FC = () => {
  const { matches } = useData();
  const { telegramConfig } = useConfig();
  const { addPendingTicket, state } = useBankroll();
  const { saveAnalysis, getAnalysis } = useAnalysis();

  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [strategies, setStrategies] = useState<ComboStrategy[]>([]);
  const [activeTab, setActiveTab] = useState<'Value' | 'Oracle Ultra Premium' | 'Lotto'>('Oracle Ultra Premium');

  // ✅ CORRECTION : Filtre élargi pour inclure tous les matchs actifs
  const getActiveMatches = () => matches.filter(m => m.status !== 'FINISHED');

  useEffect(() => {
    const activeMatches = getActiveMatches();
    const hasMemory = activeMatches.some(m => getAnalysis(m.id));
    if (hasMemory) { 
      setScanComplete(true); 
      generate(activeMatches); 
    }
  }, [matches]);

  const generate = (matchList: any[]) => {
      console.log('🎯 Generate appelé avec', matchList.length, 'matchs');
      
      const enriched = matchList.map((m: any) => {
          const mem = getAnalysis(m.id);
          console.log('📊 Match', m.id, '- Analyse:', mem ? 'OUI' : 'NON');
          return mem ? { ...m, ai: { ...m.ai, godModeAnalysis: mem } } : m;
      });
      
      console.log('🔄 Matchs enrichis:', enriched.filter(m => m.ai?.godModeAnalysis).length);
      
      const generatedStrategies = OracleAI.combo.generateStrategies(enriched);
      console.log('✅ Stratégies générées:', generatedStrategies);
      
      setStrategies(generatedStrategies);
  };

  const runBatchScan = async () => {
      setScanning(true);
      const activeMatches = getActiveMatches();
      for (const match of activeMatches) {
          const analysis = OracleAI.predictor.runGodModeAnalysis(match);
          saveAnalysis(match.id, analysis);
          await new Promise(r => setTimeout(r, 100));
      }
      generate(activeMatches);
      setScanning(false);
      setScanComplete(true);
      setActiveTab('Oracle Ultra Premium');
  };

  const activeStrategy = strategies.find(s => s.type === activeTab);

  // CALCUL DE LA MISE CONSEILLÉE
  const suggestedStake = activeStrategy ? OracleAI.bankroll.calculateStake(state.currentBalance, activeStrategy.type) : 0;
  const potentialWin = activeStrategy ? (suggestedStake * activeStrategy.combinedOdds).toFixed(2) : 0;

  const handleCopy = () => { 
    if (!activeStrategy) return;
    const text = activeStrategy.selections.map(s => `${s.player1} vs ${s.player2} - ${s.selection} @ ${s.odds}`).join('\n');
    navigator.clipboard.writeText(text);
    alert("Ticket copié !"); 
  };
  
  const handleArchive = () => {
      if (!activeStrategy) return;
      const id = Date.now().toString();
      const ticket: BetRecord = {
        id, 
        matchId: 'combo-'+id, 
        matchTitle: `Combiné ${activeStrategy.type}`,
        selection: 'Combiné', 
        odds: activeStrategy.combinedOdds, 
        stake: suggestedStake,
        status: 'PENDING', 
        profit: 0, 
        date: new Date().toLocaleString(), 
        confidenceAtTime: activeStrategy.successProbability
      };
      addPendingTicket(ticket);
      alert('Ticket archivé avec succès !');
  };
  
  const handleTelegram = async () => { 
    alert('Fonction Telegram à implémenter');
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-neutral-800 p-6 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-white">Générateur de Combinés IA</h2>
            <p className="text-sm text-gray-400">
              {scanComplete 
                ? `${getActiveMatches().filter(m => getAnalysis(m.id)).length} matchs analysés disponibles` 
                : "En attente d'analyses"}
            </p>
          </div>
          <button 
            onClick={runBatchScan} 
            disabled={scanning || scanComplete} 
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
              scanning 
                ? 'bg-neutral-800 text-gray-400' 
                : scanComplete 
                  ? 'bg-green-900/20 text-green-400 border border-green-500/50' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 animate-pulse'
            }`}
          >
            {scanning ? <RefreshCw className="animate-spin"/> : scanComplete ? <CheckCircle/> : <Cpu/>}
            {scanning ? 'Analyse...' : scanComplete ? 'Marché Validé' : 'SCANNER LE MARCHÉ'}
          </button>
      </div>

      {!scanComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-black/20 min-h-[300px]">
              <Lock size={64} className="text-purple-400 opacity-50"/>
              <p className="text-gray-500 mt-4">Lancez le scan ou analysez des matchs individuellement</p>
              <p className="text-xs text-gray-600 mt-2">Astuce : Les matchs analysés dans "Analyse IA" apparaîtront ici automatiquement</p>
          </div>
      ) : (
        <>
            {/* Onglets */}
            <div className="flex gap-4 border-b border-neutral-800 pb-1 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('Oracle Ultra Premium')} 
                  className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                    activeTab === 'Oracle Ultra Premium' 
                      ? 'bg-neon text-black' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                    <Star size={14} className="inline mr-2"/> PREMIUM
                </button>
                <button 
                  onClick={() => setActiveTab('Value')} 
                  className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                    activeTab === 'Value' 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                    <DollarSign size={14} className="inline mr-2"/> VALUE
                </button>
                <button 
                  onClick={() => setActiveTab('Lotto')} 
                  className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                    activeTab === 'Lotto' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                    <Ticket size={14} className="inline mr-2"/> LOTO
                </button>
            </div>

            {activeStrategy ? (
                <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
                    <div className="flex-1 space-y-4">
                        {/* MATCHS DU TICKET */}
                        {activeStrategy.selections.map((sel, idx) => (
                            <div key={idx} className="bg-surface border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{sel.player1} vs {sel.player2}</p>
                                    <p className="text-white font-bold text-lg">{sel.selection}</p>
                                    <p className="text-xs text-gray-400 mt-1">{sel.reason}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-bold text-white">{sel.odds.toFixed(2)}</span>
                                    <span className={`text-[10px] font-bold ${
                                      sel.confidence > 75 ? 'text-green-500' : 'text-orange-500'
                                    }`}>
                                      {sel.confidence}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-surfaceHighlight p-6 rounded-xl border border-neutral-700">
                            <p className="text-gray-400 text-xs uppercase mb-1">Cote Totale</p>
                            <p className="text-5xl font-mono font-bold text-white mb-4 tracking-tighter">
                              {activeStrategy.combinedOdds.toFixed(2)}
                            </p>
                            
                            {/* MONEY MANAGEMENT */}
                            <div className="bg-black/40 p-4 rounded-lg border border-neutral-600 mb-4">
                                <p className="text-xs text-gray-400 uppercase mb-2 flex justify-between">
                                    <span>Mise Conseillée ({
                                      activeStrategy.type === 'Oracle Ultra Premium' ? '5%' : 
                                      activeStrategy.type === 'Lotto' ? '0.5%' : 
                                      '1.5%'
                                    })</span>
                                    <span className="text-white font-bold">{state.currentBalance}€ dispo</span>
                                </p>
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold text-neon">{suggestedStake} €</span>
                                    <span className="text-sm text-green-400">Gain: {potentialWin} €</span>
                                </div>
                            </div>

                            <button 
                              onClick={handleArchive} 
                              className="w-full p-3 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-500/30 rounded-xl font-bold text-sm transition-all"
                            >
                                Valider & Archiver ce ticket
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={handleCopy} 
                              className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"
                            >
                              <Copy size={16}/> Copier
                            </button>
                            <button 
                              onClick={handleTelegram} 
                              className="p-3 bg-surface hover:bg-neutral-700 rounded-lg text-white text-xs font-bold flex flex-col items-center gap-1 border border-neutral-800"
                            >
                              <Send size={16}/> Telegram
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg mb-2">Pas assez de matchs analysés pour générer un ticket {activeTab}.</p>
                        <p className="text-xs text-gray-600">Analysez au moins 2-3 matchs dans "Analyse IA"</p>
                    </div>
                    
                    {/* DEBUG : Liste des matchs analysés */}
                    <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-gray-400 mb-3">📊 Matchs analysés disponibles :</h3>
                        {getActiveMatches().map(m => {
                            const hasAnalysis = !!getAnalysis(m.id);
                            return (
                                <div key={m.id} className="flex justify-between items-center py-2 border-b border-neutral-800 last:border-0">
                                    <span className="text-sm text-white">{m.player1.name} vs {m.player2.name}</span>
                                    <span className={`text-xs font-bold ${hasAnalysis ? 'text-green-400' : 'text-red-400'}`}>
                                        {hasAnalysis ? '✅ Analysé' : '❌ Non analysé'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <button 
                        onClick={() => {
                            console.log('🔍 DEBUG - Matchs actifs:', getActiveMatches());
                            console.log('🔍 DEBUG - Analyses:', getActiveMatches().map(m => ({ id: m.id, analysis: getAnalysis(m.id) })));
                            console.log('🔍 DEBUG - Stratégies:', strategies);
                        }}
                        className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg text-sm"
                    >
                        🔍 Afficher infos debug dans console
                    </button>
                </div>
            )}
        </>
      )}
    </div>
  );
};
