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
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center">
      <Brain size={80} className="text-neon animate-pulse mb-8" />
      <div className="space-y-2">
        {steps.map((msg, i) => (
            <div key={i} className={`flex items-center gap-2 ${i === step ? 'text-neon font-bold' : 'text-gray-700'}`}>
                {i < step ? <Zap size={14}/> : <Activity size={14}/>}
                {msg}
            </div>
        ))}
      </div>
    </div>
  );
};
