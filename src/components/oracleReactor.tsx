import React, { useEffect, useState } from 'react';
import { Brain, Zap, Activity, Globe, Radio } from 'lucide-react';

interface OracleReactorProps {
  isVisible: boolean;
  onComplete: () => void;
  messages?: string[];
}

export const OracleReactor: React.FC<OracleReactorProps> = ({ isVisible, onComplete, messages }) => {
  const [step, setStep] = useState(0);
  
  const defaultMessages = [
    "Initialisation des neuro-liaisons...",
    "Scraping Social Media (X, Reddit, Weibo)...",
    "Analyse Météo & Altitude...",
    "Détection Mouvements Suspects...",
    "Simulation Monte-Carlo (10,000 itérations)...",
    "GOD MODE ACTIVATED."
  ];

  const activeMessages = messages || defaultMessages;

  useEffect(() => {
    if (isVisible) {
      setStep(0);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= activeMessages.length - 1) {
            clearInterval(interval);
            setTimeout(onComplete, 800); // Petit délai final
            return prev;
          }
          return prev + 1;
        });
      }, 600); // Vitesse de défilement des étapes

      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Cœur du Réacteur */}
      <div className="relative mb-12">
        {/* Anneaux rotatifs CSS */}
        <div className="absolute inset-0 border-4 border-neon/30 rounded-full animate-[spin_3s_linear_infinite] w-48 h-48 -m-4 border-t-neon"></div>
        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-[spin_5s_linear_infinite_reverse] w-64 h-64 -m-12 border-b-blue-500"></div>
        
        {/* Cerveau Central */}
        <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,122,0,0.5)] animate-pulse">
           <Brain size={80} className="text-neon animate-pulse" />
        </div>

        {/* Particules */}
        <div className="absolute top-0 right-0 animate-bounce text-blue-400"><Globe size={20}/></div>
        <div className="absolute bottom-0 left-0 animate-bounce text-purple-400 delay-75"><Activity size={20}/></div>
        <div className="absolute top-1/2 left-[-50px] animate-pulse text-green-400"><Radio size={20}/></div>
      </div>

      {/* Console Log Futuriste */}
      <div className="w-full max-w-md space-y-2 font-mono text-sm">
        {activeMessages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-3 transition-all duration-300 ${
              index === step ? 'text-neon scale-105 font-bold' : 
              index < step ? 'text-green-500 opacity-50' : 'text-gray-700 opacity-20'
            }`}
          >
            {index < step ? <Zap size={14} /> : <Activity size={14} className={index === step ? 'animate-spin' : ''} />}
            <span>{msg}</span>
          </div>
        ))}
      </div>

      {/* Overlay Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
    </div>
  );
};
