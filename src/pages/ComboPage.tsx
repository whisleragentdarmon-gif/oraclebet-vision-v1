import React, { useState, useEffect } from 'react';
import { OracleAI } from '../engine';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { BetRecord, ComboStrategy } from '../engine/types';
import { jsPDF } from 'jspdf';
import { ShieldCheck, Scale, DollarSign, Star, Copy, Send, FileText, Save, ExternalLink, RefreshCw, Cpu, CheckCircle, Lock } from 'lucide-react';

export const ComboPage: React.FC = () => {
  const { matches } = useData();
  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();
  const { saveAnalysis, getAnalysis } = useAnalysis();

  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [strategies, setStrategies] = useState<ComboStrategy[]>([]);
  const [activeTab, setActiveTab] = useState<'Value' | 'Oracle Ultra Premium'>('Oracle Ultra Premium');

  // 1. Vérifier si on a déjà scanné auparavant (pour la stabilité)
  useEffect(() => {
    const upcoming = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
    
    // On regarde si au moins un match a déjà une analyse en mémoire
    const hasMemory = upcoming.some(m => getAnalysis(m.id));
    
    if (hasMemory) {
        setScanComplete(true);
        generate(upcoming); // On régénère direct si on a déjà les données
    }
  }, [matches]);

  // Générateur interne
  const generate = (matchList: any[]) => {
      // On enrichit avec la mémoire
      const enriched = matchList.map((m: any) => {
          const mem = getAnalysis(m.id);
          return mem ? { ...m, ai: { ...m.ai, godModeAnalysis: mem } } : m;
      });
      
      const newStrats = OracleAI.combo.generateStrategies(enriched);
      setStrategies(newStrats);
  };

  const runBatchScan = async () => {
      setScanning(true);
      const upcoming = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
      
      // Simulation du scan (pour l'UX) + calcul réel
      for (const match of upcoming) {
          const analysis = OracleAI.predictor.runGodModeAnalysis(match);
          saveAnalysis(match.id, analysis); // Sauvegarde en mémoire contextuelle
          await new Promise(r => setTimeout(r, 100)); // Petit délai visuel
      }

      generate(upcoming); // Génération finale
      setScanning(false);
      setScanComplete(true);
      setActiveTab('Oracle Ultra Premium');
  };

  const activeStrategy = strategies.find(s => s.type === activeTab);

  // --- OUTILS ---
  const handleCopy = () => {
    if (!activeStrategy) return;
    let msg = `🔥 OracleBet Ticket ${activeStrategy.type} 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 ${s.selection} @ ${s.odds.toFixed(2)}\n📝 ${s.marketType}\n\n`;
    });
    msg += `💰 Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}`;
    navigator.clipboard.writeText(msg);
    alert('✅ Copié !');
  };

  // ... (Reste des fonctions handleTelegram, handleArchive, etc. identiques)
  // Je les abrège ici pour la lisibilité, garde celles d'avant ou demande-les moi si besoin
  const handleTelegram = async () => {/*...Code Telegram identique...*/};
  const handleArchive = () => {
      if (!activeStrategy) return;
      const id = Date.now().toString();
      const ticket: BetRecord = {
        id, matchId: 'combo-'+id, matchTitle: `Combiné ${activeStrategy.type}`,
        selection: 'Combiné', odds: activeStrategy.combinedOdds, stake: 0,
        status: 'PENDING', profit: 0, date: new Date().toLocaleString(), confidenceAtTime: 80
      };
      addPendingTicket(ticket);
      alert('Archivé.');
  };
  const handlePDF = () => { alert("PDF généré"); };


  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* HEADER AVEC LE BOUTON SCAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-neutral-800 p-6 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-white">Générateur de Combinés IA</h2>
            <p className="text-sm text-gray-400">
                {scanComplete ? "Marché scanné. Stratégies prêtes." : "En attente d'analyse du marché."}
            </p>
          </div>

          <button 
            onClick={runBatchScan}
            disabled={scanning || scanComplete}
            className={`
                px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all
                ${scanning ? 'bg-neutral-800 text-gray-400' : scanComplete ? 'bg-green-900/20 text-green-400 border border-green-500/50 cursor-default' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 animate-pulse'}
            `}
          >
            {scanning ? <RefreshCw className="animate-spin"/> : scanComplete ? <CheckCircle/> : <Cpu/>}
            {scanning ? 'Analyse en cours...' : scanComplete ? 'Marché Scanné & Validé' : 'LANCER SCAN GÉNÉRAL'}
          </button>
      </div>

      {/* ÉCRAN DE VERROUILLAGE SI PAS SCANNÉ */}
      {!scanComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-black/20 min-h-[300px]">
              <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                  <Lock size={64} className="text-purple-400 relative z-10"/>
              </div>
              <h3 className="text-xl font-bold text-white mt-6">Stratégies Verrouillées</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md text-center">
                  L'Oracle doit scanner l'intégralité des matchs du jour (Météo, Blessures, Arnaques) avant de pouvoir construire des combinés fiables.
              </p>
          </div>
      ) : (
        <>
            {/* Onglets */}
            <div className="flex gap-4 border-b border-neutral-800 pb-1">
                <button onClick={() => setActiveTab('Oracle Ultra Premium')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'Oracle Ultra Premium' ? 'bg-neon text-black' : 'text-gray-500 hover:text-white'}`}>
                    <Star size={14} className="inline mr-2"/> ULTRA PREMIUM
                </button>
                <button onClick={() => setActiveTab('Value')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'Value' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
                    <DollarSign size={14} className="inline mr-2"/> VALUE / FUN
                </button>
            </div>

            {/* Contenu Stratégie */}
            {activeStrategy ? (
                <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
                    <div className="flex-1 space-y-4">
                        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl text-sm text-purple-300 flex gap-3">
                            <Cpu size={20} className="shrink-0"/>
                            <div>
                                <b>Analyse IA :</b> {activeStrategy.analysis}
                            </div>
                        </div>
                        
                        {activeStrategy.selections.map((sel, idx) => (
                            <div key={idx} className="bg-surface border border-neutral-800 rounded-xl p-4 flex justify-between items-center hover:border-neon/30 transition-colors group">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gray-500">{sel.player1} vs {sel.player2}</span>
                                        <span className="text-[10px] bg-neutral-700 px-1.5 rounded text-gray-300">{sel.marketType}</span>
                                    </div>
                                    <p className="text-white font-bold text-lg group-hover:text-neon transition-colors">{sel.selection}</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Star size={10} className="text-yellow-500"/> {sel.reason}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-mono font-bold text-white">{sel.odds.toFixed(2)}</span>
                                    <span className="text-[10px] text-green-500 font-bold">{sel.confidence}% Sûreté</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Actions */}
                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-surfaceHighlight p-6 rounded-xl border border-neutral-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Scale size={80}/></div>
                            <p className="text-gray-400 text-xs uppercase mb-1">Cote Totale</p>
                            <p className="text-5xl font-mono font-bold text-white mb-4 tracking-tighter">{activeStrategy.combinedOdds.toFixed(2)}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Probabilité</span>
                                    <span className="text-white font-bold">{activeStrategy.successProbability}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Niveau Risque</span>
                                    <span className={`font-bold ${activeStrategy.riskScore === 'Low' ? 'text-green-500' : 'text-orange-500'}`}>{activeStrategy.riskScore}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleCopy} className="w-full p-3 bg-surface hover:bg-neutral-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 border border-neutral-800 transition-all">
                            <Copy size={16}/> Copier le Ticket
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleTelegram} className="p-3 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex flex-col items-center justify-center gap-1">
                                <Send size={18}/> Telegram
                            </button>
                            <button onClick={handleArchive} className="p-3 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-500/30 rounded-xl font-bold flex flex-col items-center justify-center gap-1">
                                <Save size={18}/> Archiver
                            </button>
                        </div>

                        <button onClick={() => window.open('https://www.winamax.fr/paris-sportifs/sports/2/tennis', '_blank')} className="w-full mt-2 bg-neon text-black py-3 rounded-xl font-bold flex gap-2 justify-center items-center hover:bg-white transition-colors">
                            <ExternalLink size={18} /> Placer le pari
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                    <p>Aucun combiné ne correspond aux critères stricts du God Mode pour le moment.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
};
