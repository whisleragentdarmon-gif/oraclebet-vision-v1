import React, { useState } from 'react';
import { MOCK_MATCHES } from '../engine/constants';   // 🔥 Correction du chemin
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';

// TODO : remplacer par le bon import quand tu m’envoies ComboGenerator.ts
// ❗ VERSION TEMPORAIRE POUR ÉVITER LE CRASH
const OracleAI = {
  combo: {
    generateStrategies: () => []
  }
};

import { 
  ShieldCheck, Scale, DollarSign, Copy, Star,
  Send, FileText, Save, ExternalLink 
} from 'lucide-react';

import { jsPDF } from 'jspdf';
import { BetRecord } from '../engine/types';

export const ComboPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium'>('Balanced');

  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();

  // 🔥 Utilisation du moteur IA (sera corrigé dès que tu m’envoies ComboGenerator.ts)
  const strategies = OracleAI.combo.generateStrategies(MOCK_MATCHES);
  const activeStrategy = strategies.find(s => s.type === activeTab);

  // COPY
  const handleCopy = () => {
    if (!activeStrategy) return;

    let msg = `🔥 OracleBet Vision IA – Ticket ${activeStrategy.type} 🔥\n\n`;
    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 ${s.selection} @ ${s.odds.toFixed(2)}\n📝 Confiance IA: ${s.confidence}%\n\n`;
    });
    msg += `Cote Totale: ${activeStrategy.combinedOdds.toFixed(2)}\n`;
    msg += `Probabilité: ${activeStrategy.successProbability}%\n`;
    msg += `#OracleBet`;

    navigator.clipboard.writeText(msg);
    alert("Ticket copié !");
  };

  // TELEGRAM
  const handleTelegram = async () => {
    if (!activeStrategy) return;
    if (!telegramConfig.botToken || !telegramConfig.chatId)
      return alert("Configuration Telegram manquante.");

    let msg = `🔥 <b>Ticket ${activeStrategy.type}</b>\n\n`;

    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n👉 <b>${s.selection}</b> @ ${s.odds.toFixed(2)}\n\n`;
    });

    msg += `<b>Cote Totale:</b> ${activeStrategy.combinedOdds.toFixed(2)}`;

    const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text: msg,
          parse_mode: "HTML",
        }),
      });

      alert("Envoyé sur Telegram !");
    } catch {
      alert("Erreur d'envoi Telegram");
    }
  };

  // PDF
  const handlePDF = () => {
    if (!activeStrategy) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`OracleBet - ${activeStrategy.type}`, 20, 20);

    let y = 35;
    activeStrategy.selections.forEach(sel => {
      doc.text(`${sel.player1} vs ${sel.player2}`, 20, y);
      y += 7;
      doc.text(`Sélection: ${sel.selection} @ ${sel.odds.toFixed(2)}`, 20, y);
      y += 7;
      doc.text(sel.reason, 20, y);
      y += 15;
    });

    doc.text(`Cote totale: ${activeStrategy.combinedOdds.toFixed(2)}`, 20, y);
    doc.save(`OracleBet_${activeStrategy.type}.pdf`);
  };

  // ARCHIVE
  const handleArchive = () => {
    if (!activeStrategy) return;

    const id = Date.now().toString();

    const ticket: BetRecord = {
      id,
      matchId: 'combo-' + id,
      matchTitle: `Combiné ${activeStrategy.type}`,
      selection: 'Combiné',
      odds: activeStrategy.combinedOdds,
      stake: 0,
      status: 'PENDING',
      profit: 0,
      date: new Date().toLocaleString(),
      confidenceAtTime: activeStrategy.successProbability,
    };

    addPendingTicket(ticket);
    alert("Archivé dans la bankroll.");
  };

  const handleBookmaker = () => {
    window.open("https://www.winamax.fr/paris-sportifs/sports/2/tennis", "_blank");
  };

  const tabs = [
    { id: 'Safe', label: 'Safe', icon: ShieldCheck },
    { id: 'Balanced', label: 'Équilibré', icon: Scale },
    { id: 'Value', label: 'Value Bet', icon: DollarSign },
    { id: 'Oracle Ultra Premium', label: 'Ultra Premium', icon: Star },
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-8">Générateur de Combinés IA</h2>

      {/* TABS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`p-4 rounded-xl border ${activeTab === t.id ? 'border-neon bg-neutral-900' : 'border-neutral-800'}`}
          >
            <t.icon className="mx-auto mb-2" size={22} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {!activeStrategy ? (
        <p className="text-gray-500 text-center mt-10">
          Aucun ticket trouvé pour cette stratégie.
        </p>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="font-bold mb-4">
            Sélections ({activeStrategy.selections.length})
          </h3>

          <div className="space-y-4">
            {activeStrategy.selections.map((sel, i) => (
              <div key={i} className="p-4 bg-neutral-800 rounded-lg">
                <p className="font-bold">{sel.player1} vs {sel.player2}</p>
                <p className="text-neon text-lg">{sel.selection} @ {sel.odds.toFixed(2)}</p>
                <p className="text-gray-400 text-sm mt-1">{sel.reason}</p>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={handleCopy} className="btn-neutral"><Copy size={14}/> Copier</button>
            <button onClick={handleTelegram} className="btn-neutral"><Send size={14}/> Telegram</button>
            <button onClick={handlePDF} className="btn-neutral"><FileText size={14}/> PDF</button>
            <button onClick={handleArchive} className="btn-neutral"><Save size={14}/> Archiver</button>
          </div>

          <button
            onClick={handleBookmaker}
            className="w-full bg-neon text-black mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <ExternalLink size={18}/> Ouvrir Bookmaker
          </button>
        </div>
      )}
    </div>
  );
};
