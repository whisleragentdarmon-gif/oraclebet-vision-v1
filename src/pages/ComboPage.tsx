import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { OracleAI } from '../engine';
import { useConfig } from '../context/ConfigContext';
import { useBankroll } from '../context/BankrollContext';
import { BetRecord } from '../engine/types';
import { jsPDF } from 'jspdf';

import {
  ShieldCheck,
  Scale,
  DollarSign,
  Star,
  Copy,
  Send,
  FileText,
  Save,
  ExternalLink
} from 'lucide-react';

export const ComboPage: React.FC = () => {
  const { telegramConfig } = useConfig();
  const { addPendingTicket } = useBankroll();

  // ✅ Ton vrai moteur utilise generateStrategies(MOCK_MATCHES)
  const strategies = OracleAI.combo.generateStrategies(MOCK_MATCHES);

  const [activeTab, setActiveTab] = useState<
    'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium'
  >('Balanced');

  const activeStrategy = strategies.find(s => s.type === activeTab);

  // --- COPY ---
  const handleCopy = () => {
    if (!activeStrategy) return;

    let msg = `🔥 OracleBet Vision IA — Ticket ${activeStrategy.type} 🔥\n\n`;

    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n`;
      msg += `👉 ${s.selection} @ ${s.odds.toFixed(2)}\n`;
      msg += `📝 Confiance: ${s.confidence}%\n\n`;
    });

    msg += `💰 Cote: ${activeStrategy.combinedOdds.toFixed(2)}\n`;
    msg += `📊 Probabilité: ${activeStrategy.successProbability}%\n`;

    navigator.clipboard.writeText(msg);
    alert('Ticket copié !');
  };

  // --- TELEGRAM ---
  const handleTelegram = async () => {
    if (!activeStrategy) return;

    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      alert('⚠️ Configure ton bot Telegram dans Admin.');
      return;
    }

    let msg = `🔥 <b>OracleBet - Ticket ${activeStrategy.type}</b>\n\n`;

    activeStrategy.selections.forEach(s => {
      msg += `🎾 ${s.player1} vs ${s.player2}\n`;
      msg += `👉 <b>${s.selection}</b> @ ${s.odds.toFixed(2)}\n`;
      msg += `<i>${s.reason}</i>\n\n`;
    });

    msg += `💰 <b>Cote:</b> ${activeStrategy.combinedOdds.toFixed(2)}\n`;

    try {
      await fetch(
        `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramConfig.chatId,
            text: msg,
            parse_mode: 'HTML'
          })
        }
      );

      alert('🚀 Envoyé sur Telegram !');
    } catch (err) {
      console.error(err);
      alert('Erreur Telegram.');
    }
  };

  // --- PDF ---
  const handlePDF = () => {
    if (!activeStrategy) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`OracleBet - ${activeStrategy.type}`, 20, 20);

    let y = 35;
    activeStrategy.selections.forEach(s => {
      doc.setFontSize(12);
      doc.text(`${s.player1} vs ${s.player2}`, 20, y);
      y += 6;
      doc.text(`${s.selection} @ ${s.odds.toFixed(2)}`, 20, y);
      y += 6;
      doc.text(s.reason, 20, y);
      y += 10;
    });

    doc.text(
      `Cote totale: ${activeStrategy.combinedOdds.toFixed(2)}`,
      20,
      y + 10
    );

    doc.save(`OracleBet_${activeStrategy.type}.pdf`);
  };

  // --- ARCHIVE ---
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
      confidenceAtTime: activeStrategy.successProbability
    };

    addPendingTicket(ticket);
    alert('💾 Ticket archivé !');
  };

  const tabs = [
    { id: 'Safe', label: 'Safe', icon: ShieldCheck },
    { id: 'Balanced', label: 'Équilibré', icon: Scale },
    { id: 'Value', label: 'Value Bet', icon: DollarSign },
    { id: 'Oracle Ultra Premium', label: 'Ultra Premium', icon: Star }
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6">Générateur de Combinés IA</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`p-4 rounded-xl border transition ${
              activeTab === t.id
                ? 'border-neon bg-neutral-900 shadow-lg'
                : 'border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <t.icon size={22} className="mx-auto mb-2" />
            <span className="font-bold">{t.label}</span>
          </button>
        ))}
      </div>

      {!activeStrategy && (
        <div className="text-gray-500 text-center">Aucune stratégie trouvée.</div>
      )}

      {activeStrategy && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">
            Sélections ({activeStrategy.selections.length})
          </h3>

          <div className="space-y-4">
            {activeStrategy.selections.map((s, i) => (
              <div key={i} className="p-4 bg-neutral-800 rounded-xl">
                <p className="font-bold">
                  {s.player1} vs {s.player2}
                </p>
                <p className="text-neon font-bold text-lg">
                  {s.selection} @ {s.odds.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm mt-1">{s.reason}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={handleCopy} className="btn-neutral">
              <Copy size={16} /> Copier
            </button>
            <button onClick={handleTelegram} className="btn-neutral">
              <Send size={16} /> Telegram
            </button>
            <button onClick={handlePDF} className="btn-neutral">
              <FileText size={16} /> PDF
            </button>
            <button onClick={handleArchive} className="btn-neutral">
              <Save size={16} /> Archiver
            </button>
          </div>

          <button
            onClick={() =>
              window.open(
                'https://www.winamax.fr/paris-sportifs/sports/2/tennis',
                '_blank'
              )
            }
            className="w-full mt-4 bg-neon text-black py-3 rounded-xl font-bold flex gap-2 justify-center"
          >
            <ExternalLink size={18} /> Ouvrir Bookmaker
          </button>
        </div>
      )}
    </div>
  );
};
