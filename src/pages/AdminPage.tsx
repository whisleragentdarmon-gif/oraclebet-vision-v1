import React, { useState } from 'react';
import { Save, Send, Settings } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export const AdminPage: React.FC = () => {
  const { telegramConfig, setTelegramConfig, modelConfig, setModelConfig } = useConfig();
  const [localBotToken, setLocalBotToken] = useState(telegramConfig.botToken);
  const [localChatId, setLocalChatId] = useState(telegramConfig.chatId);

  const handleSaveTelegram = () => {
    setTelegramConfig({
      botToken: localBotToken.trim(),
      chatId: localChatId.trim()
    });
    alert("Configuration Telegram mise à jour !");
  };

  const handleSaveModel = () => {
    setModelConfig(modelConfig);
    alert("Configuration IA enregistrée !");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin – OracleBet Vision</h1>

      {/* Telegram */}
      <section className="mb-10 p-4 rounded-xl border border-neutral-800 bg-surface">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Send size={18} /> Configuration Telegram
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            className="bg-black border border-neutral-700 p-2 rounded"
            placeholder="Bot Token"
            value={localBotToken}
            onChange={e => setLocalBotToken(e.target.value)}
          />

          <input
            type="text"
            className="bg-black border border-neutral-700 p-2 rounded"
            placeholder="Chat ID"
            value={localChatId}
            onChange={e => setLocalChatId(e.target.value)}
          />

          <button
            onClick={handleSaveTelegram}
            className="bg-neon text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save size={16} /> Enregistrer Telegram
          </button>
        </div>
      </section>

      {/* IA */}
      <section className="mb-10 p-4 rounded-xl border border-neutral-800 bg-surface">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings size={18} /> Paramètres IA
        </h2>

        <button
          onClick={handleSaveModel}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Save size={16} /> Enregistrer Modèle IA
        </button>
      </section>
    </div>
  );
};
