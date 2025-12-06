import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AnalysisContextType {
  savedAnalyses: Record<string, any>;
  saveAnalysis: (matchId: string, data: any) => void;
  getAnalysis: (matchId: string) => any;
  clearAnalysis: (matchId: string) => void;
  clearAll: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [savedAnalyses, setSavedAnalyses] = useState<Record<string, any>>(() => {
    try {
      const localData = localStorage.getItem('oracle_god_mode_db');
      return localData ? JSON.parse(localData) : {};
    } catch (e) {
      console.error("Erreur lecture localStorage", e);
      return {};
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('oracle_god_mode_db', JSON.stringify(savedAnalyses));
      console.log('💾 AnalysisContext sauvegardé:', Object.keys(savedAnalyses).length, 'analyses');
    } catch (e) {
      console.error("Erreur sauvegarde localStorage", e);
    }
  }, [savedAnalyses]);
  
  const saveAnalysis = (matchId: string, data: any) => {
    console.log('📥 AnalysisContext.saveAnalysis:', matchId);
    console.log('  - P1:', data?.identity?.p1Name);
    console.log('  - P2:', data?.identity?.p2Name);
    
    setSavedAnalyses(prev => {
      const newState = { ...prev };
      newState[matchId] = {
        ...data,
        _timestamp: Date.now(),
        _saved_at: new Date().toISOString()
      };
      return newState;
    });
  };
  
  const getAnalysis = (matchId: string) => {
    const analysis = savedAnalyses[matchId];
    if (analysis) {
      console.log('📤 AnalysisContext.getAnalysis:', matchId);
    }
    return analysis;
  };
  
  const clearAnalysis = (matchId: string) => {
    console.log('🗑️ AnalysisContext.clearAnalysis:', matchId);
    setSavedAnalyses(prev => {
      const newState = { ...prev };
      delete newState[matchId];
      return newState;
    });
  };
  
  const clearAll = () => {
    console.log('🧹 AnalysisContext.clearAll');
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

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return context;
}
