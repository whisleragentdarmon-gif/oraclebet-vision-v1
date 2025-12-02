import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AnalysisContextType {
  // On stocke les analyses par ID de match
  savedAnalyses: Record<string, any>;
  saveAnalysis: (matchId: string, data: any) => void;
  getAnalysis: (matchId: string) => any;
  clearAnalysis: (matchId: string) => void; // Optionnel : pour nettoyer
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. AU DÉMARRAGE : On essaie de lire la mémoire du navigateur
  const [savedAnalyses, setSavedAnalyses] = useState<Record<string, any>>(() => {
    try {
      const localData = localStorage.getItem('oracle_god_mode_db');
      return localData ? JSON.parse(localData) : {};
    } catch (e) {
      console.error("Erreur lecture mémoire locale", e);
      return {};
    }
  });

  // 2. À CHAQUE CHANGEMENT : On sauvegarde sur le disque
  useEffect(() => {
    localStorage.setItem('oracle_god_mode_db', JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const saveAnalysis = (matchId: string, data: any) => {
    setSavedAnalyses(prev => ({
      ...prev,
      [matchId]: {
        ...data,
        timestamp: Date.now() // On ajoute la date de l'analyse
      }
    }));
  };

  const getAnalysis = (matchId: string) => {
    return savedAnalyses[matchId];
  };

  const clearAnalysis = (matchId: string) => {
    const newState = { ...savedAnalyses };
    delete newState[matchId];
    setSavedAnalyses(newState);
  };

  return (
    <AnalysisContext.Provider value={{ savedAnalyses, saveAnalysis, getAnalysis, clearAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used within AnalysisProvider");
  return context;
};
