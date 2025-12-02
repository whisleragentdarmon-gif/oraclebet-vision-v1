import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match } from '../types';
import { MatchService } from '../services/api';
import { MatchScraper } from '../engine/MatchScraper'; // Import du Scraper

interface DataContextType {
  matches: Match[];
  loading: boolean;
  refreshData: () => void;
  scrapeWebMatches: () => void; // Nouvelle fonction
  markAsFinished: (matchId: string, score?: string) => void; // Nouvelle fonction
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // On initialise avec ce qui est en mémoire si possible
  const [matches, setMatches] = useState<Match[]>(() => {
      const saved = localStorage.getItem('oracle_matches_db');
      return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sauvegarde automatique
  useEffect(() => {
      localStorage.setItem('oracle_matches_db', JSON.stringify(matches));
  }, [matches]);

  const refreshData = async () => {
    setLoading(true);
    try {
        const realMatches = await MatchService.getTodaysMatches();
        // On fusionne avec les matchs existants pour ne pas perdre ceux qu'on a modifiés
        setMatches(prev => {
            const newMap = new Map(prev.map(m => [m.id, m]));
            realMatches.forEach(m => newMap.set(m.id, m)); // Mise à jour ou ajout
            return Array.from(newMap.values());
        });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // FONCTION GUÉRILLA : Chercher sur le web
  const scrapeWebMatches = async () => {
      setLoading(true);
      const webMatches = await MatchScraper.scanWebForMatches();
      if (webMatches.length > 0) {
          setMatches(prev => [...prev, ...webMatches]);
          alert(`${webMatches.length} matchs trouvés sur le web !`);
      } else {
          alert("Le scan web n'a pas trouvé de format compatible. Essayez l'API officielle.");
      }
      setLoading(false);
  };

  // FONCTION MANUELLE : Finir un match
  const markAsFinished = (matchId: string, score: string = "Terminé") => {
      setMatches(prev => prev.map(m => 
          m.id === matchId 
            ? { ...m, status: 'FINISHED', score: score, validationResult: 'PENDING' } 
            : m
      ));
  };

  return (
    <DataContext.Provider value={{ matches, loading, refreshData, scrapeWebMatches, markAsFinished }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
