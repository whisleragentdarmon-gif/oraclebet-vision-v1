import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match } from '../types';
import { MatchService } from '../services/api';
import { MatchScraper } from '../engine/MatchScraper';

interface DataContextType {
  matches: Match[];
  loading: boolean;
  refreshData: () => void;
  scrapeWebMatches: () => void;
  markAsFinished: (matchId: string, score?: string) => void;
  addCustomMatch: (p1: string, p2: string) => void; // ✅ La fonction pour le tableau manuel
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialisation depuis le LocalStorage (Mémoire)
  const [matches, setMatches] = useState<Match[]>(() => {
      try {
          if (typeof window !== 'undefined') {
              const saved = localStorage.getItem('oracle_matches_db');
              return saved ? JSON.parse(saved) : [];
          }
      } catch (e) { console.error(e); }
      return [];
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Sauvegarde automatique à chaque changement
  useEffect(() => {
      localStorage.setItem('oracle_matches_db', JSON.stringify(matches));
  }, [matches]);

  // --- FONCTION 1 : APPEL API OFFICIELLE ---
  const refreshData = async () => {
    setLoading(true);
    try {
        const realMatches = await MatchService.getTodaysMatches();
        
        if (realMatches.length > 0) {
            setMatches(prev => {
                // Fusion intelligente : On ne touche pas aux matchs déjà finis ou modifiés manuellement
                const currentMap = new Map(prev.map(m => [m.id, m]));
                
                realMatches.forEach(m => {
                    // Si le match n'existe pas, ou s'il n'est pas marqué comme FINISHED par l'utilisateur
                    if (!currentMap.has(m.id) || currentMap.get(m.id)?.status !== 'FINISHED') {
                        currentMap.set(m.id, m);
                    }
                });
                
                return Array.from(currentMap.values());
            });
        }
    } catch (e) {
        console.error("Erreur Refresh", e);
    }
    setLoading(false);
  };

  // --- FONCTION 2 : SCRAPING GUÉRILLA ---
  const scrapeWebMatches = async () => {
      setLoading(true);
      try {
          const webMatches = await MatchScraper.scanWebForMatches();
          if (webMatches.length > 0) {
              setMatches(prev => {
                  const currentIds = new Set(prev.map(m => m.id));
                  const newUnique = webMatches.filter(m => !currentIds.has(m.id));
                  return [...newUnique, ...prev]; // Nouveaux en haut
              });
              console.log(`${webMatches.length} matchs trouvés via Scraping.`);
          } else {
              console.log("Aucun match trouvé via Scraping.");
          }
      } catch (e) { console.error(e); }
      setLoading(false);
  };

  // --- FONCTION 3 : AJOUT MANUEL (Pour ton tableau personnalisé) ---
  const addCustomMatch = (p1: string, p2: string) => {
      const newMatch: Match = {
        id: `custom-${Date.now()}`,
        tournament: "Match Ajouté Manuellement",
        date: new Date().toLocaleDateString('fr-FR'),
        time: "À venir",
        status: 'SCHEDULED',
        surface: 'Hard', // Défaut, modifiable par l'IA plus tard
        player1: { name: p1, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
        player2: { name: p2, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
        odds: { player1: 1.90, player2: 1.90, p1: 1.90, p2: 1.90 }, // Cotes par défaut
        ai: {
            winner: p1,
            confidence: 50,
            recommendedBet: "Lancer God Mode",
            riskLevel: 'MODERATE',
            marketType: 'WINNER',
            circuit: 'ATP',
            fairOdds: {p1:1.9, p2:1.9},
            integrity: {isSuspicious:false, score:0}
        }
      };
      
      setMatches(prev => [newMatch, ...prev]); // Ajoute tout en haut
  };

  // --- FONCTION 4 : MARQUER COMME FINI (Le Drapeau) ---
  const markAsFinished = (matchId: string, score: string = "Terminé") => {
      setMatches(prev => prev.map(m => 
          m.id === matchId 
            ? { ...m, status: 'FINISHED', score: score, validationResult: 'PENDING' } 
            : m
      ));
  };

  return (
    <DataContext.Provider value={{ matches, loading, refreshData, scrapeWebMatches, markAsFinished, addCustomMatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
