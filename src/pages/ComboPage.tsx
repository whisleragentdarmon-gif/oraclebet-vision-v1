import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { OracleAI } from '../engine';
import { ShieldCheck, Scale, DollarSign, Zap, Copy, Star, Send, FileText, Save, ExternalLink } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { BetRecord } from '../engine/types';
import { jsPDF } from 'jspdf';

export const ComboPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium'>('Balanced');
  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();
  
  // Generate strategies on the fly using the engine
  const strategies = OracleAI.combo.generateStrategies(MOCK_MATCHES);
  const activeStrategy = strategies.find(s => s.type === activeTab);

  // --- 1. Smart Copy ---
  const handleCopy = () => {
    if (!activeStrategy) return;
    
    let msg = `🔥 **OracleBet Vision IA - Ticket ${activeStrategy.type}** 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 ${s.selection} @ ${s.odds.toFixed(2)}\n📝 Confiance IA: ${s.confidence}%\n\n`;
    });
    msg += `------------------\n`;
    msg += `💰 Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}\n`;
    msg += `📊 Probabilité: ${activeStrategy.successProbability}%\n`;
    msg += `🛡️ Risque: ${activeStrategy.riskScore}\n`;
    msg += `💡 Mise conseillée: 1 unité\n\n`;
    msg += `#OracleBet #TennisAI`;
    
    navigator.clipboard.writeText(msg);
    alert("✅ Ticket copié dans le presse-papier !");
  };

  // --- 4. Send to Telegram (Real API) ---
  const handleTelegram = async () => {
    if (!activeStrategy) return;
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
        alert("⚠️ Configuration Telegram manquante dans Admin.");
        return;
    }

    let msg = `🔥 <b>OracleBet Vision IA - Ticket ${activeStrategy.type}</b> 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 <b>${s.selection}</b> @ ${s.odds.toFixed(2)}\n📝 <i>${s.reason}</i>\n\n`;
    });
    msg += `------------------\n`;
    msg += `💰 <b>Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}</b>\n`;
    msg += `📊 Probabilité: ${activeStrategy.successProbability}%\n`;
    msg += `🛡️ Risque: ${activeStrategy.riskScore}\n\n`;
    msg += `#OracleBet #TennisAI`;

    try {
        const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramConfig.chatId,
                text: msg,
                parse_mode: 'HTML'
            })
        });
        alert("🚀 Ticket envoyé sur Telegram avec succès !");
    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi Telegram. Vérifiez votre connexion.");
    }
  };

  // --- 7. PDF Export (Client Side) ---
  const handlePDF = () => {
      if (!activeStrategy) return;
      const doc = new jsPDF();
      
      // Styling
      doc.setFillColor(13, 13, 13); // Carbon Black
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(255, 122, 0); // Neon Orange
      doc.setFontSize(22);
      doc.text("ORACLEBET VISION IA", 20, 20);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(`TICKET : ${activeStrategy.type.toUpperCase()}`, 20, 35);
      
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`Date: ${new Date().toLocaleString()}`, 20, 45);
      
      let y = 60;
      doc.setDrawColor(255, 122, 0);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);

      activeStrategy.selections.forEach((s) => {
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.text(`Match: ${s.player1} vs ${s.player2}`, 20, y);
          y += 7;
          
          doc.setTextColor(255, 122, 0); // Orange for selection
          doc.setFontSize(12);
          doc.text(`Selection: ${s.selection}`, 20, y);
          doc.text(`@ ${s.odds.toFixed(2)}`, 160, y);
          y += 7;
          
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(10);
          doc.text(`Analyse: ${s.reason}`, 20, y);
          y += 15;
      });

      doc.line(20, y, 190, y);
      y += 10;
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(`COTE TOTALE : ${activeStrategy.combinedOdds.toFixed(2)}`, 20, y);
      
      doc.save(`OracleBet_${activeStrategy.type}_${Date.now()}.pdf`);
  };

  // --- 6. Archive to History (Bankroll) ---
  const handleArchive = () => {
      if (!activeStrategy) return;
      const id = Date.now().toString();
      
      const ticket: BetRecord = {
          id: id,
          matchId: 'combo-' + id,
          matchTitle: `Combiné ${activeStrategy.type} (${activeStrategy.selections.length} matchs)`,
          selection: 'Combiné',
          odds: activeStrategy.combinedOdds,
          stake: 0, // Pending user input in validation
          status: 'PENDING',
          profit: 0,
          date: new Date().toLocaleString(),
          confidenceAtTime: activeStrategy.successProbability
      };
      
      addPendingTicket(ticket);
      alert("💾 Ticket archivé dans 'Ma Bankroll' (En attente).");
  };

  // --- 5. Open Bookmaker (External Link) ---
  const handleBookmaker = () => {
      // Simple logic to open a betting site search
      const url = "https://www.winamax.fr/paris-sportifs/sports/2/tennis";
      window.open(url, '_blank');
  };

  const tabs = [
    { id: 'Safe', label: 'Safe', icon: ShieldCheck, color: 'text-green-500', border: 'border-green-500' },
    { id: 'Balanced', label: 'Équilibré', icon: Scale, color: 'text-blue-500', border: 'border-blue-500' },
    { id: 'Value', label: 'Value Bet', icon: DollarSign, color: 'text-yellow-500', border: 'border-yellow-500' },
    { id: 'Oracle Ultra Premium', label: 'Ultra Premium', icon: Star, color: 'text-neon', border: 'border-neon' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
         <h2 className="text-2xl font-bold mb-2">Générateur de Combinés IA</h2>
         <p className="text-gray-400 text-sm">Choisissez votre niveau de risque et laissez l'IA construire le ticket optimal.</p>
      </div>

      {/* Strategy Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300
              ${activeTab === tab.id 
                ? `bg-surfaceHighlight ${tab.border} shadow-[0_0_15px_rgba(0,0,0,0.5)]` 
                : 'bg-surface border-neutral-800 hover:bg-neutral-800'}
            `}
          >
            <tab.icon size={24} className={`mb-2 ${tab.color}`} />
            <span className={`font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Result Card */}
      {activeStrategy && (
        <div className="flex-1 bg-surface border border-neutral-800 rounded-2xl p-6 md:p-8 animate-fade-in shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 rounded-full pointer-events-none 
            ${activeTab === 'Safe' ? 'bg-green-500' : activeTab === 'Oracle Ultra Premium' ? 'bg-neon' : 'bg-blue-500'}
          `} />

          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Matches List */}
            <div className="flex-1 space-y-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <span className="w-2 h-8 bg-neon rounded-full"></span>
                 Sélection IA ({activeStrategy.selections.length} matchs)
              </h3>
              
              {activeStrategy.selections.length > 0 ? activeStrategy.selections.map((sel, idx) => (
                <div key={idx} className="bg-black/30 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">{sel.player1} vs {sel.player2}</span>
                        {sel.confidence > 75 && <span className="text-[10px] bg-green-900/40 text-green-400 px-1.5 rounded">SAFE</span>}
                        {sel.reason.includes('Value') && <span className="text-[10px] bg-yellow-900/40 text-yellow-400 px-1.5 rounded">VALUE</span>}
                     </div>
                     <p className="font-bold text-white text-lg">{sel.selection}</p>
                     <p className="text-xs text-gray-400 mt-1">{sel.reason}</p>
                   </div>
                   <div className="text-right shrink-0">
                     <span className="block text-2xl font-bold text-neon">{sel.odds.toFixed(2)}</span>
                     <span className="text-xs text-green-500">{sel.confidence}% Conf.</span>
                   </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                  Aucun match ne correspond aux critères stricts de cette stratégie aujourd'hui.
                </div>
              )}
            </div>

            {/* Summary Sidebar & Actions */}
            <div className="w-full md:w-80 flex flex-col gap-4">
               {/* Stats Box */}
               <div className="bg-surfaceHighlight rounded-xl p-6 border border-neutral-700">
                    <div className="mb-6 pb-6 border-b border-neutral-600">
                        <p className="text-gray-400 text-sm">Cote Totale</p>
                        <p className="text-4xl font-bold text-white font-mono">{activeStrategy.combinedOdds.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between">
                        <span className="text-gray-400">Probabilité Réelle</span>
                        <span className="font-bold text-white">{activeStrategy.successProbability}%</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-400">Niveau de Risque</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${activeStrategy.riskScore === 'Low' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {activeStrategy.riskScore.toUpperCase()}
                        </span>
                        </div>
                    </div>
               </div>

               {/* Action Grid (Safe Mode) */}
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleCopy}
                    disabled={activeStrategy.selections.length === 0}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors text-xs"
                    title="Copier Ticket"
                  >
                    <Copy size={16} className="text-neon"/> Copier
                  </button>
                  
                  <button 
                    onClick={handleTelegram}
                    disabled={activeStrategy.selections.length === 0}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors text-xs"
                    title="Envoyer Telegram"
                  >
                    <Send size={16} className="text-blue-400"/> Telegram
                  </button>

                  <button 
                    onClick={handlePDF}
                    disabled={activeStrategy.selections.length === 0}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors text-xs"
                    title="Exporter PDF"
                  >
                    <FileText size={16} className="text-red-400"/> PDF
                  </button>

                  <button 
                    onClick={handleArchive}
                    disabled={activeStrategy.selections.length === 0}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors text-xs"
                    title="Archiver (Ma Bankroll)"
                  >
                    <Save size={16} className="text-green-400"/> Archiver
                  </button>
               </div>
               
               <button 
                  onClick={handleBookmaker}
                  className="w-full bg-neon hover:bg-neonHover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-neon/20"
                >
                  <ExternalLink size={18} /> Ouvrir Bookmaker
               </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};