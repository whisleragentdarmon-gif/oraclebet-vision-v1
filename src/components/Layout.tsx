import React, { useState } from 'react';
import { Calendar, Zap, Brain, Share2, ShieldCheck, Menu, X, Wallet, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const menuItems = [
    // 👇 LE NOUVEL ONGLET UNIQUE (Remplace Live/Today/Tomorrow)
    { id: 'program', label: 'Matchs à Venir', icon: Calendar }, 
    
    { id: 'analysis', label: 'Analyse IA', icon: Brain },
    { id: 'combos', label: 'Combinés IA', icon: Share2 },
    
    { id: 'history', label: 'Résultats & IA', icon: History },
    { id: 'bankroll', label: 'Ma Bankroll & Config', icon: Wallet },
    { id: 'vip', label: 'VIP Telegram', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-carbon text-gray-100 flex font-sans">
      
      <div className="md:hidden fixed top-0 w-full z-50 bg-carbon border-b border-neutral-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-neon to-orange-700 flex items-center justify-center">
             <Brain size={18} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Oracle<span className="text-neon">Bet</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-neutral-800 transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon to-orange-700 flex items-center justify-center shadow-[0_0_15px_rgba(255,122,0,0.4)]">
                <Brain size={24} className="text-white" />
             </div>
             <div>
               <h1 className="font-bold text-xl leading-none">Oracle<span className="text-neon">Bet</span></h1>
               <span className="text-[10px] text-gray-500 tracking-widest uppercase">God Mode v1</span>
             </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-neon text-white shadow-[0_0_20px_rgba(255,122,0,0.3)]' 
                    : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-neutral-800">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">
                    {user ? user.slice(0,2).toUpperCase() : 'AD'}
                </div>
                <div>
                <p className="text-sm font-medium text-white">{user}</p>
                <p className="text-xs text-green-500">● Connecté</p>
                </div>
             </div>
             <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors p-2"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">{children}</div>
      </main>
    </div>
  );
};
