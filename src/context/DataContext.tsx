import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match } from '../types';
import { MatchService } from '../services/api';
import { MOCK_MATCHES } from '../constants'; // En backup

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
        const realMatches = await MatchService.getTodaysMatches();
        if (realMatches.length > 0) {
            setMatches(realMatches);
        } else {
            console.log("API vide, utilisation Mock");
            setMatches(MOCK_MATCHES);
        }
    } catch (e) {
        console.error(e);
        setMatches(MOCK_MATCHES);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
