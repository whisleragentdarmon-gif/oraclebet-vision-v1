import { Match } from '../types';

export const MatchScraper = {
  scanWebForMatches: async (): Promise<Match[]> => {
    const matches: Match[] = [];
    
    // On cherche large
    const queries = [
      "tennis matches schedule today atp wta",
      "tennis order of play today scores"
    ];

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queries[0] })
      });
      
      const data = await response.json();
      const results = data.results || [];

      // Analyse très souple
      results.forEach((res: any) => {
        const text = (res.title + " " + res.snippet)
            .replace(/ vs\.? /gi, ' - ')
            .replace(/ v /gi, ' - ')
            .replace(/ contre /gi, ' - ');
        
        // Cherche juste deux mots avec majuscules séparés par un tiret
        const pattern = /([A-Z][a-z]{2,})\s?-\s?([A-Z][a-z]{2,})/g;
        let match;
        
        while ((match = pattern.exec(text)) !== null) {
             const p1 = match[1].trim();
             const p2 = match[2].trim();
             
             const blackList = ["Tennis", "Live", "Score", "Match", "Today", "Open", "Tour", "Results"];
             
             if (!blackList.includes(p1) && !blackList.includes(p2) && p1 !== p2) {
                 matches.push({
                    id: `web-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
                    tournament: "Tournoi Web",
                    date: new Date().toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit'}),
                    time: "Aujourd'hui",
                    status: 'SCHEDULED',
                    surface: 'Hard',
                    player1: { name: p1, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                    player2: { name: p2, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                    odds: { player1: 1.90, player2: 1.90, p1: 1.90, p2: 1.90 },
                    ai: {
                        winner: p1, confidence: 50, recommendedBet: "Analyse requise", riskLevel: 'MODERATE', marketType: 'WINNER', circuit: 'ATP', fairOdds: {p1:1.9, p2:1.9}, integrity: {isSuspicious: false, score: 0}
                    }
                 });
             }
        }
      });

    } catch (e) {
      console.error("Erreur Scraping", e);
    }

    // --- FILET DE SÉCURITÉ (SI RIEN TROUVÉ) ---
    // Si Google échoue, on ne veut pas d'erreur. On renvoie 2 matchs "exemples" pour que tu puisses bosser.
    if (matches.length === 0) {
        return [
            {
                id: `backup-1`, tournament: "ATP Backup (Mode Secours)", date: "Auj.", time: "20:00", status: 'SCHEDULED', surface: 'Hard',
                player1: { name: "H. Rune", rank: 7, country: "DEN", form: 60, surfacePrefs: {hard:80,clay:70,grass:60} },
                player2: { name: "S. Korda", rank: 20, country: "USA", form: 70, surfacePrefs: {hard:85,clay:50,grass:70} },
                odds: { player1: 1.85, player2: 1.95, p1: 1.85, p2: 1.95 },
                ai: { winner: "S. Korda", confidence: 55, recommendedBet: "Analyse...", riskLevel: 'MODERATE', marketType: 'WINNER', circuit: 'ATP', fairOdds:{p1:1.8,p2:1.9}, integrity:{isSuspicious:false,score:0} }
            },
            {
                id: `backup-2`, tournament: "WTA Backup (Mode Secours)", date: "Auj.", time: "21:00", status: 'SCHEDULED', surface: 'Clay',
                player1: { name: "I. Swiatek", rank: 1, country: "POL", form: 95, surfacePrefs: {hard:90,clay:99,grass:80} },
                player2: { name: "A. Sabalenka", rank: 2, country: "BLR", form: 90, surfacePrefs: {hard:95,clay:85,grass:85} },
                odds: { player1: 1.50, player2: 2.60, p1: 1.50, p2: 2.60 },
                ai: { winner: "I. Swiatek", confidence: 70, recommendedBet: "Analyse...", riskLevel: 'SAFE', marketType: 'WINNER', circuit: 'WTA', fairOdds:{p1:1.4,p2:2.7}, integrity:{isSuspicious:false,score:0} }
            }
        ];
    }

    // Dédoublonnage
    const uniqueMatches = Array.from(new Map(matches.map(m => [m.player1.name + m.player2.name, m])).values());
    return uniqueMatches;
  }
};
