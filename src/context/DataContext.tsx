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

  const fetchData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true); // On ne met le chargement que si c'est manuel
    try {
        const realMatches = await MatchService.getTodaysMatches();
        if (realMatches.length > 0) {
            setMatches(realMatches);
        } else {
            // Si l'API est vide, on garde les anciens ou on met les mocks
            if (matches.length === 0) setMatches(MOCK_MATCHES);
        }
    } catch (e) {
        console.error(e);
        if (matches.length === 0) setMatches(MOCK_MATCHES);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Chargement initial

    // 👇 AUTO-REFRESH TOUTES LES 60 SECONDES
    const interval = setInterval(() => {
        console.log("🔄 Actualisation automatique des scores...");
        fetchData(true);
    }, 60000);

    return () => clearInterval(interval); // Nettoyage quand on quitte
  }, []);

  return (
    <DataContext.Provider value={{ matches, loading, refreshData: () => fetchData(false) }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
