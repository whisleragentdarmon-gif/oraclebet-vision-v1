import React, { createContext, useContext, useState } from 'react';
import { AIModelWeights, BetRecord } from '../engine/types';
import { OracleAI } from '../engine';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface ConfigContextValues {
  telegramConfig: TelegramConfig;
  setTelegramConfig: (cfg: TelegramConfig) => void;

  modelConfig: AIModelWeights;
  setModelConfig: (cfg: AIModelWeights) => void;

  logs: BetRecord[];
  addLog: (log: BetRecord) => void;
}

const defaultTelegram: TelegramConfig = {
  botToken: '',
  chatId: ''
};

const defaultModel: AIModelWeights = {
  formWeight: 1,
  mentalWeight: 1,
  fatigueFactor: 1,
  serveDominance: 1,
  variance: 1
};

const ConfigContext = createContext<ConfigContextValues | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telegramConfig, setTelegramConfig] = useState(defaultTelegram);
  const [modelConfig, setModelConfig] = useState(defaultModel);
  const [logs, setLogs] = useState<BetRecord[]>([]);

  const addLog = (log: BetRecord) => {
    setLogs(prev => [log, ...prev]);
  };

  return (
    <ConfigContext.Provider
      value={{
        telegramConfig,
        setTelegramConfig,
        modelConfig,
        setModelConfig,
        logs,
        addLog
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
};
