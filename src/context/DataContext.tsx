import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match } from '../types';
import { MatchService } from '../services/api';
import { MOCK_MATCHES } from '../constants';

interface DataContextType {
  matches: Match[];
  loading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
        // On récupère les vrais matchs
        const realMatches = await MatchService.getTodaysMatches();
        if (realMatches.length > 0) {
            setMatches(realMatches);
        } else {
            // Si quota dépassé ou erreur, on laisse vide (ou MOCK_MATCHES si tu veux tester)
            console.log("API vide ou Quota dépassé");
            setMatches([]); 
        }
    } catch (e) {
        console.error(e);
        setMatches([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Chargement unique au démarrage

    // ❌ J'AI SUPPRIMÉ L'AUTO-REFRESH ICI POUR SAUVER TON QUOTA
    // Si tu veux rafraîchir, tu cliqueras sur le bouton manuel.

  }, []);

  return (
    <DataContext.Provider value={{ matches, loading, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
