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
  // ✅ Mise à jour : accepte un objet complet de données
  addCustomMatch: (data: any) => void;
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

  // --- FONCTION 3 : AJOUT MANUEL AVEC CALCUL IA IMMÉDIAT ---
  const addCustomMatch = (data: any) => {
      const { p1, p2, context } = data;
      
      // 1. Parsing des données saisies
      const r1 = parseInt(p1.rank) || 100;
      const r2 = parseInt(p2.rank) || 100;
      
      // On récupère le winrate correspondant à la surface choisie
      const w1 = parseInt(context.surface === 'Clay' ? p1.clay : context.surface === 'Grass' ? p1.grass : p1.hard) || 50;
      const w2 = parseInt(context.surface === 'Clay' ? p2.clay : context.surface === 'Grass' ? p2.grass : p2.hard) || 50;

      // 2. Algorithme de prédiction instantanée
      let scoreP1 = 50;
      
      // Facteur Classement (30%)
      if (r1 < r2) scoreP1 += 15; else scoreP1 -= 15;
      
      // Facteur Surface (70% - Plus important)
      if (w1 > w2) scoreP1 += 20; else if (w2 > w1) scoreP1 -= 20;

      // Calcul confiance
      const winner = scoreP1 >= 50 ? p1.name : p2.name;
      const rawConfidence = 50 + Math.abs(scoreP1 - 50);
      const confidence = Math.min(95, Math.max(55, rawConfidence)); // Borné entre 55 et 95

      // Génération de l'analyse textuelle
      const analysis = `Analyse basée sur les données saisies : ${winner} est favori (${confidence}%) grâce à une meilleure performance sur ${context.surface} (${scoreP1 > 50 ? w1 : w2}%) et son classement (${scoreP1 > 50 ? r1 : r2}).`;

      const newMatch: Match = {
        id: `custom-${Date.now()}`,
        tournament: "Match Personnalisé",
        date: new Date().toLocaleDateString('fr-FR'),
        time: "À venir",
        status: 'SCHEDULED',
        surface: context.surface,
        player1: { 
            name: p1.name, 
            rank: r1, 
            country: 'WLD', 
            form: w1, 
            surfacePrefs: { hard: parseInt(p1.hard)||50, clay: parseInt(p1.clay)||50, grass: 50 } 
        },
        player2: { 
            name: p2.name, 
            rank: r2, 
            country: 'WLD', 
            form: w2, 
            surfacePrefs: { hard: parseInt(p2.hard)||50, clay: parseInt(p2.clay)||50, grass: 50 } 
        },
        odds: { player1: 1.90, player2: 1.90, p1: 1.90, p2: 1.90 },
        ai: {
            winner: winner,
            confidence: confidence,
            recommendedBet: `${winner} Vainqueur`,
            riskLevel: confidence > 80 ? 'SAFE' : 'MODERATE',
            marketType: 'WINNER',
            circuit: 'ATP',
            fairOdds: {p1:1.9, p2:1.9},
            integrity: {isSuspicious:false, score:0},
            qualitativeAnalysis: analysis
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
