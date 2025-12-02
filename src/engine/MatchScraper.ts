import { Match } from '../types';

export const MatchScraper = {
  scanWebForMatches: async (): Promise<Match[]> => {
    const matches: Match[] = [];
    
    // 1. On cherche le programme sur le web via ton API
    const queries = [
      "tennis matches schedule today atp wta",
      "order of play tennis today"
    ];

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queries[0] })
      });
      
      const data = await response.json();
      const results = data.results || [];

      // 2. ANALYSE DU TEXTE (Parsing "Guérilla")
      results.forEach((res: any) => {
        // Nettoyage du texte pour faciliter la détection
        const text = (res.title + " " + res.snippet).replace(/–/g, '-').replace(/ vs /gi, ' - ');
        
        // Regex pour trouver "Nom - Nom"
        const potentialMatches = text.match(/([A-Z][a-z]+)\s?([A-Z][a-z]+)?\s?-\s?([A-Z][a-z]+)\s?([A-Z][a-z]+)?/g);

        if (potentialMatches) {
          potentialMatches.forEach((pm: string) => {
             const players = pm.split('-');
             if (players.length === 2) {
                 const p1 = players[0].trim();
                 const p2 = players[1].trim();

                 // On ignore les phrases trop longues ou trop courtes pour éviter les faux positifs
                 if (p1.length > 3 && p2.length > 3 && p1.length < 20 && p2.length < 20) {
                     matches.push({
                        id: `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        tournament: "Tournoi Détecté Web",
                        date: new Date().toLocaleDateString('fr-FR'),
                        time: "Aujourd'hui",
                        status: 'SCHEDULED',
                        // ✅ CORRECTION ICI : 'Hard' par défaut au lieu de 'Unknown'
                        surface: 'Hard', 
                        player1: { name: p1, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                        player2: { name: p2, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                        odds: { player1: 1.90, player2: 1.90, p1: 1.90, p2: 1.90 },
                        ai: {
                            winner: p1, // Par défaut avant analyse
                            confidence: 50,
                            recommendedBet: "Analyse requise",
                            riskLevel: 'MODERATE',
                            marketType: 'WINNER',
                            circuit: 'ATP',
                            fairOdds: {p1: 1.90, p2: 1.90},
                            integrity: { isSuspicious: false, score: 0 }
                        }
                     });
                 }
             }
          });
        }
      });

    } catch (e) {
      console.error("Erreur Scraping", e);
    }

    // Dédoublonnage basique (pour ne pas avoir 3 fois le même match)
    const uniqueMatches = Array.from(new Map(matches.map(m => [m.player1.name + m.player2.name, m])).values());
    
    return uniqueMatches;
  }
};
