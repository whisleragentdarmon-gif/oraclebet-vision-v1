
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIModelWeights, BetRecord } from '../engine/types';
import { OracleAI } from '../engine';
import { MOCK_LOGS } from '../constants';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface ConfigContextType {
  aiWeights: AIModelWeights;
  updateWeights: (newWeights: AIModelWeights) => void;
  telegramConfig: TelegramConfig;
  updateTelegramConfig: (cfg: TelegramConfig) => void;
  saveConfig: () => void;
  retrainAI: (history: BetRecord[]) => { success: boolean; msg: string; improvement: number };
  systemLogs: any[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default Weights
  const [aiWeights, setAiWeights] = useState<AIModelWeights>({
    surfaceWeight: 0.35,
    formWeight: 0.30,
    h2hWeight: 0.15,
    mentalWeight: 0.10,
    fatigueFactor: 0.10,
    momentumWeight: 0.20,
    variance: 0.05,
    serveDominance: 1.0
  });

  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: ''
  });

  const [systemLogs, setSystemLogs] = useState<any[]>(MOCK_LOGS);

  // Load from LocalStorage
  useEffect(() => {
    const savedWeights = localStorage.getItem('oracle_ai_weights');
    const savedTele = localStorage.getItem('oracle_telegram_config');
    
    if (savedWeights) {
        const w = JSON.parse(savedWeights);
        setAiWeights(w);
        OracleAI.predictor.learning.setWeights(w); // Sync engine
    }
    if (savedTele) setTelegramConfig(JSON.parse(savedTele));
  }, []);

  const updateWeights = (newWeights: AIModelWeights) => {
    setAiWeights(newWeights);
    OracleAI.predictor.learning.setWeights(newWeights); // Sync engine
  };

  const updateTelegramConfig = (cfg: TelegramConfig) => {
    setTelegramConfig(cfg);
  };

  const saveConfig = () => {
    localStorage.setItem('oracle_ai_weights', JSON.stringify(aiWeights));
    localStorage.setItem('oracle_telegram_config', JSON.stringify(telegramConfig));
    alert("Configuration Système & Admin sauvegardée avec succès ! 💾");
  };

  const retrainAI = (history: BetRecord[]) => {
    const result = OracleAI.predictor.learning.retrainModelFromHistory(history);
    
    if (result.improvement > 0 || history.length >= 5) {
        setAiWeights(result.weights);
        localStorage.setItem('oracle_ai_weights', JSON.stringify(result.weights));
        
        // Add Log
        const newLog = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            action: 'MODEL_TRAIN',
            details: `Auto-learning completed. Accuracy +${result.improvement}%`
        };
        setSystemLogs([newLog, ...systemLogs]);
        
        return { success: true, msg: result.log, improvement: result.improvement };
    }
    
    return { success: false, msg: result.log, improvement: 0 };
  };

  return (
    <ConfigContext.Provider value={{ aiWeights, updateWeights, telegramConfig, updateTelegramConfig, saveConfig, retrainAI, systemLogs }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within a ConfigProvider");
  return context;
};
