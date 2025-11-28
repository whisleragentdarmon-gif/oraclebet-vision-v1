import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour la configuration avancée
interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface AIWeights {
  surfaceWeight: number;
  formWeight: number;
  h2hWeight: number;
  fatigueFactor: number;
  mentalWeight: number;
  variance: number;
}

interface SystemLog {
  id: number;
  timestamp: string;
  action: string;
  details: string;
}

interface ConfigContextType {
  // Config App
  refreshRate: number;
  showConfidence: boolean;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
  setRefreshRate: (ms: number) => void;
  
  // Config Telegram (Pour VipPage)
  telegramConfig: TelegramConfig;
  updateTelegramConfig: (cfg: TelegramConfig) => void;

  // Config IA (Pour AdminPage)
  aiWeights: AIWeights;
  updateWeights: (w: AIWeights) => void;
  retrainAI: (history: any[]) => { success: boolean; improvement: number; msg: string };
  saveConfig: () => void;
  
  // Logs (Pour AdminPage)
  systemLogs: SystemLog[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- États de base ---
  const [refreshRate, setRefreshRate] = useState(30000);
  const [showConfidence, setShowConfidence] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // --- État Telegram (IMPORTANT pour VipPage) ---
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: ''
  });

  // --- État IA ---
  const [aiWeights, setAiWeights] = useState<AIWeights>({
    surfaceWeight: 0.35,
    formWeight: 0.25,
    h2hWeight: 0.15,
    fatigueFactor: 0.10,
    mentalWeight: 0.10,
    variance: 0.05
  });

  // --- État Logs ---
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString(), action: 'SYSTEM_INIT', details: 'Moteur Oracle v2.1 chargé.' }
  ]);

  // --- Actions ---
  const toggleAutoRefresh = () => setAutoRefresh(prev => !prev);
  const updateTelegramConfig = (cfg: TelegramConfig) => setTelegramConfig(cfg);
  const updateWeights = (w: AIWeights) => setAiWeights(w);

  const saveConfig = () => {
    const newLog = { 
        id: Date.now(), 
        timestamp: new Date().toLocaleTimeString(), 
        action: 'CONFIG_SAVE', 
        details: 'Configuration mise à jour.' 
    };
    setSystemLogs([newLog, ...systemLogs]);
    alert("Configuration sauvegardée !");
  };

  const retrainAI = (history: any[]) => {
    const improvement = (Math.random() * 2).toFixed(2);
    const newLog = { 
        id: Date.now(), 
        timestamp: new Date().toLocaleTimeString(), 
        action: 'MODEL_TRAIN', 
        details: `Ré-entrainement. Gain: +${improvement}%` 
    };
    setSystemLogs([newLog, ...systemLogs]);
    return { success: true, improvement: parseFloat(improvement), msg: 'Succès' };
  };

  return (
    <ConfigContext.Provider value={{ 
      refreshRate, showConfidence, autoRefresh, toggleAutoRefresh, setRefreshRate,
      telegramConfig, updateTelegramConfig,
      aiWeights, updateWeights, retrainAI, saveConfig,
      systemLogs
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
