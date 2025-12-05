'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Match } from '../types';

interface DataContextType {
  matches: Match[];
  addManualMatch: (match: Match) => void;
  removeMatch: (id: string) => void;
  markAsFinished: (id: string, score?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  // ✅ Charger les matchs au démarrage (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('oraclebet_matches');
    if (saved) {
      try {
        setMatches(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement matchs:', e);
      }
    }
  }, []);

  // ✅ Sauvegarder les matchs quand ils changent
  useEffect(() => {
    localStorage.setItem('oraclebet_matches', JSON.stringify(matches));
  }, [matches]);

  // ✅ AJOUTER UN MATCH MANUELLEMENT
  const addManualMatch = (match: Match) => {
    setMatches((prev) => {
      // Vérifier si le match existe déjà
      const exists = prev.some((m) => m.id === match.id);
      if (exists) {
        console.log('Match déjà présent');
        return prev;
      }
      // Ajouter le nouveau match en début de liste
      return [match, ...prev];
    });
  };

  // ✅ SUPPRIMER UN MATCH
  const removeMatch = (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  // ✅ MARQUER COMME TERMINÉ (avec score optionnel)
  const markAsFinished = (id: string, score?: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id 
          ? { ...m, status: 'FINISHED' as const, score: score || m.score } 
          : m
      )
    );
  };

  return (
    <DataContext.Provider value={{ matches, addManualMatch, removeMatch, markAsFinished }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé avec DataProvider');
  }
  return context;
};
