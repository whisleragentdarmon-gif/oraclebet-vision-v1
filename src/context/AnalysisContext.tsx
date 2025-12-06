import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AnalysisContextType {
  savedAnalyses: Record<string, any>;
  saveAnalysis: (matchId: string, data: any) => void;
  getAnalysis: (matchId: string) => any;
  clearAnalysis: (matchId: string) => void;
  clearAll: () => void; // ✅ NOUVEAU : Nettoyer tout
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
    try {
      localStorage.setItem('oracle_god_mode_db', JSON.stringify(savedAnalyses));
      console.log('💾 AnalysisContext: Sauvegarde', Object.keys(savedAnalyses).length, 'analyses');
    } catch (e) {
      console.error("Erreur sauvegarde mémoire locale", e);
    }
  }, [savedAnalyses]);
  
  const saveAnalysis = (matchId: string, data: any) => {
    console.log('📥 AnalysisContext: Sauvegarde match', matchId);
    
    // ✅ CORRECTION: Force un objet complètement nouveau
    setSavedAnalyses(prev => {
      const newState = { ...prev };
      newState[matchId] = {
        ...data,
        timestamp: Date.now(),
        _saved_at: new Date().toISOString()
      };
      return newState;
    });
  };
  
  const getAnalysis = (matchId: string) => {
    const analysis = savedAnalyses[matchId];
    if (analysis) {
      console.log('📤 AnalysisContext: Récupération match', matchId);
    }
    return analysis;
  };
  
  const clearAnalysis = (matchId: string) => {
    console.log('🗑️ AnalysisContext: Suppression match', matchId);
    setSavedAnalyses(prev => {
      const newState = { ...prev };
      delete newState[matchId];
      return newState;
    });
  };
  
  // ✅ NOUVEAU : Nettoyer TOUTES les analyses
  const clearAll = () => {
    console.log('🧹 AnalysisContext: Nettoyage complet');
    setSavedAnalyses({});
    localStorage.removeItem('oracle_god_mode_db');
  };
  
  return (
    <AnalysisContext.Provider value={{ 
      savedAnalyses, 
      saveAnalysis, 
      getAnalysis, 
      clearAnalysis,
      clearAll 
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used within AnalysisProvider");
  return context;
};
