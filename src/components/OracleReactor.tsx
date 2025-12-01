import React, { useEffect, useState } from 'react';
import { Brain, Zap, Activity } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onComplete: () => void;
}

export const OracleReactor: React.FC<Props> = ({ isVisible, onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Connexion Satellites...",
    "Analyse Météo & Vent...",
    "Scan Réseaux Sociaux...",
    "Détection Arnaques...",
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
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center font-mono">
      <div className="relative mb-8">
        <div className="absolute inset-0 border-4 border-neon/30 rounded-full animate-[spin_3s_linear_infinite] w-32 h-32 -m-4 border-t-neon"></div>
        <Brain size={80} className="text-neon animate-pulse" />
      </div>
      
      <div className="space-y-2 w-64">
        {steps.map((msg, i) => (
            <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${i === step ? 'text-neon font-bold scale-105' : i < step ? 'text-green-500 opacity-50' : 'text-gray-800'}`}>
                {i < step ? <Zap size={14}/> : <Activity size={14} className={i === step ? "animate-spin" : ""}/>}
                <span className="text-sm">{msg}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
