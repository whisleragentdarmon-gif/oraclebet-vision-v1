import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, User, ChevronRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On appelle la fonction login du contexte
    const success = login(id, pass);
    if (!success) {
      setError("Identifiants incorrects. Accès refusé.");
    }
  };

  return (
    <div className="min-h-screen bg-carbon flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon rounded-full blur-[150px] opacity-10 animate-pulse"></div>
       <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-10"></div>

       <div className="w-full max-w-md bg-surface border border-neutral-800 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon to-orange-700 flex items-center justify-center shadow-lg shadow-neon/20 mb-4">
                <Brain size={32} className="text-white" />
             </div>
             <h1 className="text-2xl font-bold text-white">Oracle<span className="text-neon">Bet</span> Vision</h1>
             <p className="text-gray-500 text-sm tracking-widest uppercase mt-1">Accès Sécurisé Admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-bold uppercase ml-1">Identifiant</label>
               <div className="relative">
                 <User className="absolute left-3 top-3 text-gray-500" size={18} />
                 <input 
                    type="text" 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full bg-black/40 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                    placeholder="ID Admin"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-bold uppercase ml-1">Mot de passe</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                 <input 
                    type="password" 
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full bg-black/40 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                    placeholder="••••••••"
                 />
               </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-neon hover:bg-neonHover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-neon/20"
            >
              Connexion <ChevronRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-600">
              Système restreint. Toute tentative d'accès non autorisée est enregistrée.
              <br />Server ID: ORACLE-V1-FR
            </p>
          </div>
       </div>
    </div>
  );
};
