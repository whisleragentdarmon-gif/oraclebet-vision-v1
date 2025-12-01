import React, { useState } from 'react';
import { Send, History, ShieldCheck, Key, Save, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { TelegramService } from '../services/telegram';

interface HistoryItem {
  id: number;
  message: string;
  date: string;
  status: 'SENT' | 'ERROR';
}

export const VipPage: React.FC = () => {
  const { telegramConfig, updateTelegramConfig, saveConfig } = useConfig();
  const [message, setMessage] = useState(`🔥 **ALERTE VIP** 🔥\n\n🎾 Match: ...\n👉 Pari: ...\n\n#OracleBet`);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    
    // Envoi réel via le service
    const result = await TelegramService.sendMessage(message);

    if (result.success) {
        alert("✅ Message envoyé au canal Telegram !");
        setHistory([{ id: Date.now(), message, date: new Date().toLocaleTimeString(), status: 'SENT' }, ...history]);
    } else {
        alert(`❌ Erreur: ${result.error}`);
        setHistory([{ id: Date.now(), message, date: new Date().toLocaleTimeString(), status: 'ERROR' }, ...history]);
    }
    
    setIsSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex items-center gap-3 mb-8">
         <div className="p-3 bg-neon/10 rounded-full text-neon">
           <ShieldCheck size={32} />
         </div>
         <div>
           <h2 className="text-3xl font-bold">VIP Telegram Center</h2>
           <p className="text-gray-400">Configurez votre Bot et envoyez vos signaux.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* Editor */}
         <div className="bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
           <div className="flex justify-between mb-4">
             <h3 className="font-bold text-white">Nouveau Signal</h3>
             <span className={`text-xs flex items-center gap-1 ${telegramConfig.botToken ? 'text-green-500' : 'text-red-500'}`}>
                {telegramConfig.botToken ? <CheckCircle size={10}/> : <AlertTriangle size={10}/>}
                {telegramConfig.botToken ? 'Bot Connecté' : 'Non Configuré'}
             </span>
           </div>
           
           <textarea
             className="w-full flex-1 min-h-[250px] bg-black/40 border border-neutral-700 rounded-xl p-4 text-gray-200 focus:border-neon focus:ring-1 focus:ring-neon outline-none font-mono text-sm resize-none mb-6"
             value={message}
             onChange={(e) => setMessage(e.target.value)}
           ></textarea>

           <button 
              onClick={handleSend}
              disabled={isSending || !telegramConfig.botToken}
              className="w-full bg-neon hover:bg-neonHover disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-neon/20"
           >
             <Send size={18} /> {isSending ? 'Envoi...' : 'Envoyer maintenant'}
           </button>
         </div>

         {/* Configuration */}
         <div className="space-y-6">
           <div className="bg-surface border border-neutral-800 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Key size={18} className="text-neon" /> Configuration Bot
                </h3>
                <button onClick={saveConfig} className="text-xs text-neon hover:underline flex items-center gap-1"><Save size={12}/> Sauver</button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Bot Token (BotFather)</label>
                 <input 
                    type="password" 
                    value={telegramConfig.botToken} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, botToken: e.target.value})}
                    placeholder="Ex: 123456:ABC-DEF..."
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Chat ID (Canal)</label>
                 <input 
                    type="text" 
                    value={telegramConfig.chatId} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, chatId: e.target.value})}
                    placeholder="Ex: -100123456789"
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
                 <p className="text-[10px] text-gray-600 mt-1">N'oubliez pas d'ajouter le bot comme Admin du canal.</p>
               </div>
             </div>
           </div>

           {/* Historique Rapide */}
           <div className="bg-surface border border-neutral-800 rounded-2xl p-6 max-h-[300px] overflow-y-auto">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><History size={18} className="text-neon"/> Derniers Envois</h3>
             <div className="space-y-2">
               {history.map((item) => (
                   <div key={item.id} className="text-xs bg-black/20 p-2 rounded border-l-2 border-neutral-700">
                      <div className="flex justify-between text-gray-500 mb-1">
                          <span>{item.date}</span>
                          <span className={item.status === 'SENT' ? 'text-green-500' : 'text-red-500'}>{item.status}</span>
                      </div>
                      <p className="truncate text-gray-400">{item.message}</p>
                   </div>
               ))}
               {history.length === 0 && <p className="text-gray-600 text-xs text-center">Aucun envoi récent.</p>}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};
