import { Match } from '../types';

export const MatchScraper = {
  /**
   * MODE "GUÉRILLA" : Extraction de données non structurées.
   * Ne cherche pas d'API. Lit le texte comme un humain.
   */
  scanWebForMatches: async (): Promise<Match[]> => {
    console.log("🛰️ Lancement du scan Web profond (Mode Texte Brut)...");
    
    const matches: Match[] = [];
    
    // 1. STRATÉGIE MULTI-SOURCES
    // On ne cherche pas juste "calendrier", on cherche là où les gens parlent des matchs
    const queries = [
      "tennis matches today betting tips prediction", // Les sites de pronos listent toujours les matchs
      "atp wta order of play today", // Le programme officiel
      "tennis live scores flashscore", // Les sites de scores (leurs méta-descriptions contiennent les matchs)
      "tennis matches odds comparison today" // Les comparateurs
    ];

    try {
      // Lancement des recherches en parallèle
      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          }).then(res => res.json())
        )
      );

      // 2. ASPIRATEUR DE TEXTE (RAW CONTENT EXTRACTION)
      // On mélange tous les titres et tous les résumés (snippets) trouvés
      let rawTextPool = "";
      responses.forEach(data => {
          if (data.results) {
              data.results.forEach((res: any) => {
                  rawTextPool += ` ${res.title} ${res.snippet} `;
              });
          }
      });

      // Nettoyage du bruit
      // On remplace les séparateurs exotiques par un standard " vs "
      const cleanText = rawTextPool
          .replace(/–/g, ' vs ')
          .replace(/-/g, ' vs ')
          .replace(/ v /gi, ' vs ')
          .replace(/ contre /gi, ' vs ')
          .replace(/ against /gi, ' vs ')
          .replace(/\s+/g, ' '); // Retire les doubles espaces

      // 3. INTELLIGENCE D'EXTRACTION (PATTERN MATCHING)
      // On cherche : Mot(Majuscule) Mot(Optionnel) VS Mot(Majuscule) Mot(Optionnel)
      // Ex: "Jannik Sinner vs Carlos Alcaraz" ou "Sinner vs Alcaraz"
      const matchPattern = /([A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,})?)\s+vs\s+([A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,})?)/g;
      
      let matchFound;
      while ((matchFound = matchPattern.exec(cleanText)) !== null) {
          const p1 = matchFound[1].trim();
          const p2 = matchFound[2].trim();

          // 4. FILTRE ANTI-BULLSHIT
          // On vérifie que ce ne sont pas des mots communs du dictionnaire
          const blackList = ["Tennis", "Match", "Live", "Score", "Betting", "Tips", "Prediction", "Forecast", "Today", "Watch", "Stream", "Odds", "Open", "Tour", "Cup", "Challenge", "Final", "Semi"];
          
          if (
              !blackList.includes(p1) && !blackList.includes(p2) && // Pas des mots interdits
              p1 !== p2 && // Pas le même nom
              p1.length > 3 && p2.length > 3 // Pas trop court
          ) {
              // On a trouvé un vrai match potentiel !
              matches.push({
                id: `web-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                tournament: "Tournoi Web Détecté", // On ne peut pas deviner le tournoi facilement, on met générique
                date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                time: "Aujourd'hui",
                status: 'SCHEDULED', // On assume que c'est à venir ou en cours
                surface: 'Hard', // Par défaut, l'IA ajustera en God Mode
                score: undefined,
                player1: { name: p1, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                player2: { name: p2, rank: 0, country: 'WLD', form: 50, surfacePrefs: {hard:50, clay:50, grass:50} },
                odds: { player1: 1.90, player2: 1.90, p1: 1.90, p2: 1.90 },
                ai: {
                    winner: p1,
                    confidence: 50,
                    recommendedBet: "Lancer God Mode",
                    riskLevel: 'MODERATE',
                    marketType: 'WINNER',
                    circuit: 'ATP', // Défaut
                    fairOdds: {p1: 1.90, p2: 1.90},
                    integrity: { isSuspicious: false, score: 0 }
                }
              });
          }
      }

    } catch (e) {
      console.error("Erreur Guérilla Scraping", e);
    }

    // 5. DÉDOUBLONNAGE INTELLIGENT
    // Si on a trouvé "Sinner vs Alcaraz" et "J. Sinner vs C. Alcaraz", on n'en garde qu'un
    const uniqueMatches = new Map();
    matches.forEach(m => {
        // Clé unique basée sur les 3 premières lettres des joueurs (pour éviter les variantes de prénoms)
        const key = m.player1.name.substring(0,3) + m.player2.name.substring(0,3);
        if (!uniqueMatches.has(key)) {
            uniqueMatches.set(key, m);
        }
    });

    console.log(`🔭 SCAN TERMINÉ : ${uniqueMatches.size} matchs réels extraits du texte brut.`);
    return Array.from(uniqueMatches.values());
  }
};
