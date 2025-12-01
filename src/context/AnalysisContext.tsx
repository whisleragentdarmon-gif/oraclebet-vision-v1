import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisContextType {
  // On stocke les analyses par ID de match
  savedAnalyses: Record<string, any>;
  saveAnalysis: (matchId: string, data: any) => void;
  getAnalysis: (matchId: string) => any;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedAnalyses, setSavedAnalyses] = useState<Record<string, any>>({});

  const saveAnalysis = (matchId: string, data: any) => {
    setSavedAnalyses(prev => ({
      ...prev,
      [matchId]: data
    }));
  };

  const getAnalysis = (matchId: string) => {
    return savedAnalyses[matchId];
  };

  return (
    <AnalysisContext.Provider value={{ savedAnalyses, saveAnalysis, getAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used within AnalysisProvider");
  return context;
};
