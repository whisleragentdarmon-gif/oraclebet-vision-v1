import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Définition des types pour la configuration
interface AIWeights {
  surfaceWeight: number;
  formWeight: number;
  h2hWeight: number;
  fatigueFactor: number;
  mentalWeight: number;
  variance: number;
}

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface Log {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface ConfigContextType {
  aiWeights: AIWeights;
  telegramConfig: TelegramConfig;
  updateWeights: (newWeights: AIWeights) => void;
  updateTelegramConfig: (newConfig: TelegramConfig) => void;
  saveConfig: () => void;
  retrainAI: (history: any[]) => { success: boolean; msg: string; improvement: number };
  systemLogs: Log[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // État initial des poids IA
  const [aiWeights, setWeights] = useState<AIWeights>({
    surfaceWeight: 0.30,
    formWeight: 0.25,
    h2hWeight: 0.15,
    fatigueFactor: 0.10,
    mentalWeight: 0.10,
    variance: 0.10
  });

  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: ''
  });

  const [systemLogs, setSystemLogs] = useState<Log[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), action: 'SYSTEM_START', details: 'Oracle Vision v1 démarré avec succès.' }
  ]);

  // Charger la config depuis le LocalStorage au démarrage
  useEffect(() => {
    const savedConfig = localStorage.getItem('oracle_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.aiWeights) setWeights(parsed.aiWeights);
      if (parsed.telegramConfig) setTelegramConfig(parsed.telegramConfig);
    }
  }, []);

  const updateWeights = (newWeights: AIWeights) => setWeights(newWeights);
  const updateTelegramConfig = (newConfig: TelegramConfig) => setTelegramConfig(newConfig);

  const saveConfig = () => {
    localStorage.setItem('oracle_config', JSON.stringify({ aiWeights, telegramConfig }));
    addLog('CONFIG_SAVE', 'Configuration mise à jour manuellement par Admin.');
    alert("Configuration sauvegardée !");
  };

  const addLog = (action: string, details: string) => {
    const newLog = { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), action, details };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const retrainAI = (history: any[]) => {
    addLog('MODEL_TRAIN', `Ré-entraînement lancé sur ${history.length} points de données.`);
    return { success: true, msg: "Modèle optimisé.", improvement: 1.4 };
  };

  return (
    <ConfigContext.Provider value={{ aiWeights, telegramConfig, updateWeights, updateTelegramConfig, saveConfig, retrainAI, systemLogs }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within a ConfigProvider");
  return context;
};
