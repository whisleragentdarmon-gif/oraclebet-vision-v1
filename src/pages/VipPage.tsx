import React, { useState } from 'react';
import { Send, History, ShieldCheck, Key, Save, Edit3, Trash2 } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

interface HistoryItem {
  id: number;
  message: string;
  date: string;
  status: 'SENT' | 'DRAFT';
}

export const VipPage: React.FC = () => {
  const { telegramConfig, updateTelegramConfig, saveConfig } = useConfig();
  const [message, setMessage] = useState(`🔥 **ALERTE VIP ORACLE** 🔥\n\n🎾 Rune vs Zverev\n👉 **Zverev Vainqueur @ 1.72**\n\n💎 Confiance: 8/10\n📊 Analyse: Zverev impérial au service (90% 1st serve won).\n\n#Tennis #Betting`);
  
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, message: "🎾 Alcaraz vs Medvedev : Alcaraz @ 1.45", date: "Aujourd'hui, 10:42", status: 'SENT' }
  ]);

  const handleSend = () => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      alert("❌ Erreur: Veuillez configurer le Token Bot et l'ID Canal avant d'envoyer.");
      return;
    }
    
    // Simulate API Call
    console.log(`Sending to Telegram: https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${telegramConfig.chatId}&text=${encodeURIComponent(message)}`);
    
    alert("✅ Message envoyé avec succès au canal Telegram !");
    
    const newItem: HistoryItem = {
      id: Date.now(),
      message: message.split('\n')[2] || "Message VIP",
      date: new Date().toLocaleString(),
      status: 'SENT'
    };
    setHistory([newItem, ...history]);
  };

  const handleSaveDraft = () => {
    const newItem: HistoryItem = {
      id: Date.now(),
      message: message.split('\n')[2] || "Brouillon",
      date: new Date().toLocaleString(),
      status: 'DRAFT'
    };
    setHistory([newItem, ...history]);
    alert("📝 Brouillon sauvegardé localement.");
  };

  const restoreDraft = (msg: string) => {
    setMessage(msg);
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex items-center gap-3 mb-8">
         <div className="p-3 bg-neon/10 rounded-full text-neon">
           <ShieldCheck size={32} />
         </div>
         <div>
           <h2 className="text-3xl font-bold">VIP Telegram Center</h2>
           <p className="text-gray-400">Gérez votre canal privé et envoyez des signaux</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* Editor */}
         <div className="bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
           <div className="flex justify-between mb-4">
             <h3 className="font-bold text-white">Nouveau Signal</h3>
             <span className={`text-xs flex items-center gap-1 ${telegramConfig.botToken ? 'text-green-500' : 'text-red-500'}`}>
                {telegramConfig.botToken ? '● Prêt' : '● Non Configuré'}
             </span>
           </div>
           
           <textarea
             className="w-full flex-1 min-h-[250px] bg-black/40 border border-neutral-700 rounded-xl p-4 text-gray-200 focus:border-neon focus:ring-1 focus:ring-neon outline-none font-mono text-sm resize-none mb-6"
             value={message}
             onChange={(e) => setMessage(e.target.value)}
           ></textarea>

           <div className="flex gap-4">
             <button 
                onClick={handleSend}
                className="flex-1 bg-neon hover:bg-neonHover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-neon/20"
             >
               <Send size={18} /> Envoyer
             </button>
             <button 
                onClick={handleSaveDraft}
                className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center gap-2"
                title="Sauvegarder Brouillon"
             >
               <Save size={18} />
             </button>
           </div>
         </div>

         {/* Configuration & History */}
         <div className="space-y-6">
           
           <div className="bg-surface border border-neutral-800 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Key size={18} className="text-neon" /> Configuration
                </h3>
                <button onClick={saveConfig} className="text-xs text-neon hover:underline">Sauvegarder</button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Bot Token</label>
                 <input 
                    type="password" 
                    value={telegramConfig.botToken} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, botToken: e.target.value})}
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
               </div>
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">ID Canal</label>
                 <input 
                    type="text" 
                    value={telegramConfig.chatId} 
                    onChange={(e) => updateTelegramConfig({...telegramConfig, chatId: e.target.value})}
                    placeholder="-100xxxxxxxx"
                    className="w-full bg-black/40 border border-neutral-800 rounded p-2 text-white text-sm mt-1 focus:border-neon outline-none" 
                 />
               </div>
             </div>
           </div>

           <div className="bg-surface border border-neutral-800 rounded-2xl p-6 max-h-[400px] overflow-y-auto">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <History size={18} className="text-neon" /> Historique d'envois
             </h3>
             <div className="space-y-3">
               {history.map((item) => (
                   <div key={item.id} className="text-sm bg-black/20 p-3 rounded border border-neutral-800 hover:border-neutral-600 transition-colors group">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{item.date}</span>
                        <span className={item.status === 'SENT' ? 'text-green-500' : 'text-yellow-500'}>
                            {item.status === 'SENT' ? 'Envoyé' : 'Brouillon'}
                        </span>
                    </div>
                    <p className="truncate text-gray-300 font-medium mb-2">{item.message}</p>
                    {item.status === 'DRAFT' && (
                        <button 
                            onClick={() => restoreDraft(item.message)}
                            className="text-xs text-neon flex items-center gap-1 hover:underline"
                        >
                            <Edit3 size={10} /> Reprendre
                        </button>
                    )}
                   </div>
               ))}
             </div>
           </div>

         </div>

       </div>
    </div>
  );
};
