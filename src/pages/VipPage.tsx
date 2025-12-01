import React, { useState, useEffect } from 'react';
import { Send, History, ShieldCheck, Key, Save, Edit3, CheckCircle, AlertTriangle, X } from 'lucide-react';
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
  
  // État pour la notification visuelle (plus de popup blanc)
  const [notification, setNotification] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Effacer la notif après 3 secondes
  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSend = async () => {
    setIsSending(true);
    const result = await TelegramService.sendMessage(message);

    if (result.success) {
        // ✅ Notification Pro au lieu de alert()
        setNotification({ type: 'success', text: "Message envoyé avec succès au canal !" });
        setHistory([{ id: Date.now(), message, date: new Date().toLocaleTimeString(), status: 'SENT' }, ...history]);
    } else {
        // ❌ Notification Erreur
        setNotification({ type: 'error', text: `Erreur: ${result.error}` });
        setHistory([{ id: Date.now(), message, date: new Date().toLocaleTimeString(), status: 'ERROR' }, ...history]);
    }
    
    setIsSending(false);
  };

  const handleSaveConfig = () => {
      saveConfig();
      // On ajoute une petite notif visuelle pour la sauvegarde aussi
      setNotification({ type: 'success', text: "Configuration du Bot sauvegardée." });
  };

  return (
    <div className="max-w-4xl mx-auto relative">
       
       {/* NOTIFICATION FLOTTANTE (Le remplaçant du popup blanc) */}
       {notification && (
           <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border ${notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 'bg-red-900/90 border-red-500 text-white'}`}>
               {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
               <span className="font-bold">{notification.text}</span>
               <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={16}/></button>
           </div>
       )}

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
                {/* On utilise notre nouvelle fonction sans popup */}
                <button onClick={handleSaveConfig} className="text-xs text-neon hover:underline flex items-center gap-1"><Save size={12}/> Sauver</button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Bot Token</label>
                 <input 
                    type="password" 
                    value={telegramConfig.botToken} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, botToken: e.target.value})}
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Chat ID</label>
                 <input 
                    type="text" 
                    value={telegramConfig.chatId} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, chatId: e.target.value})}
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
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
