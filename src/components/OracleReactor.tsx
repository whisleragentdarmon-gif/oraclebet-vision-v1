import React, { useEffect, useState } from 'react';
import { Brain, Zap, Activity, Globe, Wifi } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onComplete: () => void;
}

export const OracleReactor: React.FC<Props> = ({ isVisible, onComplete }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    "Connexion Satellites...",
    "Extraction H2H & Stats...",
    "Scan Blessures & Météo...",
    "Analyse Marché & Cotes...",
    "GOD MODE ACTIVÉ."
  ];
  
  useEffect(() => {
    if (isVisible) {
      setStep(0);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center font-mono">
      <div className="relative mb-12 transform scale-150">
        <div className="absolute inset-0 border-4 border-neon/30 rounded-full animate-[spin_3s_linear_infinite] w-32 h-32 -m-4 border-t-neon"></div>
        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-[spin_5s_linear_infinite_reverse] w-48 h-48 -m-12 border-b-blue-500"></div>
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,122,0,0.6)]">
           <Brain size={48} className="text-neon animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-3 w-80 text-center">
        {steps.map((msg, i) => (
            {/* ✅ CORRECTION ICI - className={` au lieu de className=` */}
            <div 
              key={i} 
              className={`flex items-center justify-center gap-3 transition-all duration-300 ${
                i === step ? 'text-neon font-bold scale-110' : 
                i < step ? 'text-green-500 opacity-50' : 
                'text-gray-800 opacity-20'
              }`}
            >
                {i < step ? (
                  <Wifi size={14}/> 
                ) : (
                  <Activity size={14} className={i === step ? "animate-spin" : ""}/>
                )}
                <span className="text-sm tracking-widest uppercase">{msg}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
