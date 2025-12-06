import { GodModeReportV2 } from './types';

// ============================================================================
// 1. LE DICTIONNAIRE ULTIME (FR/EN)
// ============================================================================

const DICTIONARY = {
  // Surfaces et Conditions
  surfaces: {
    'terre': 'Clay', 'clay': 'Clay', 'brique': 'Clay', 'red': 'Clay',
    'dur': 'Hard', 'hard': 'Hard', 'beton': 'Hard', 'acrylic': 'Hard',
    'salle': 'Indoor', 'indoor': 'Indoor', 'i_hard': 'Indoor', 'gymnase': 'Indoor',
    'gazon': 'Grass', 'grass': 'Grass', 'herbe': 'Grass', 'lawn': 'Grass',
    'moquette': 'Carpet', 'carpet': 'Carpet'
  },
  // Résultats de matchs
  results: {
    'v': 'W', 'd': 'L', 'win': 'W', 'loss': 'L', 'g': 'W', 'p': 'L',
    'victoire': 'W', 'defaite': 'L', 'won': 'W', 'lost': 'L'
  },
  // Mots-clés Statistiques (Regex patterns)
  stats: {
    aces: /aces|as/i,
    doubleFaults: /double.*faut|df/i,
    firstServe: /1er.*serv|1st.*serv/i,
    win1stServe: /pts.*1er|win.*1st/i,
    win2ndServe: /pts.*2nd|win.*2nd/i,
    breakPoints: /balle.*break|break.*point|bp/i,
    returnPoints: /retour|return/i,
    winners: /gagnant|winner/i,
    unforced: /faut.*direct|unforced/i
  },
  // Mots-clés Profil
  profile: {
    rank: /rang|rank|atp|wta|#/i,
    age: /age|ans|years|yo/i,
    height: /taille|height|cm|m/i,
    hand: /main|hand|droitier|gaucher|right|left/i,
    country: /pays|country|nat/i
  },
  // Mots-clés Contexte (Blessures, etc)
  context: {
    injury: /bless|injur|medic|kine|physio|abandon|retire/i,
    walkover: /wo|walkover|forfait/i,
    weather: /vent|wind|pluie|rain|temp/i
  }
};

// Liste Noire (Anti-Bruit de Pari)
const BLACKLIST = [
  'connexion', 'inscription', 'solde', 'mon compte', 'paris', 'sportif',
  'mise', 'gain', 'potentiel', 'cashout', 'ticket', 'combiné', 'simple',
  'cote', 'total', 'vainqueur', 'remboursé', 'freebet', 'mybets', 'scanner',
  'imprimer', 'partager', 'ref', 'id', 'bet', 'win', 'max', 'gains', 'possibles',
  'matchs', 'selection', 'cotes', 'boost', 'promo', 'offres', 'mes paris'
];

// ============================================================================
// 2. TYPES ET UTILITAIRES
// ============================================================================

interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

let lastTimestamp = 0;

/**
 * Nettoyeur de texte : enlève les caractères spéciaux bizarres de l'OCR
 */
const cleanStr = (str: string) => str.replace(/[^a-zA-Z0-9\s%.-]/g, '').trim();

/**
 * Structure Vierge Complète (Pour écraser la mémoire)
 */
const getEmptyReport = (matchId: string): GodModeReportV2 => {
  // Générateur de clés vides pour les tableaux dynamiques (match1...match100)
  const emptyMatches = Array.from({length: 100}).reduce((acc: any, _, i) => {
    acc[`match${i+1}_date`] = ""; acc[`match${i+1}_opponent`] = ""; 
    acc[`match${i+1}_score`] = ""; acc[`match${i+1}_tournament`] = "";
    return acc;
  }, {});

  const emptyTitles = Array.from({length: 20}).reduce((acc: any, _, i) => {
    acc[`title${i+1}_year`] = ""; acc[`title${i+1}_tournament`] = "";
    return acc;
  }, {});

  const emptyInjuries = Array.from({length: 10}).reduce((acc: any, _, i) => {
    acc[`injury${i+1}_date`] = ""; acc[`injury${i+1}_name`] = "";
    return acc;
  }, {});

  return {
    identity: {
      p1Name: "", p2Name: "", tournament: "", surface: "Hard",
      date: new Date().toLocaleDateString('fr-FR'), time: "", round: "", matchId
    },
    p1: {
      rank: "", bestRank: "", ageHeight: "", nationality: "", hand: "", style: "",
      winrateCareer: "", winrateSeason: "", winrateSurface: "",
      aces: "", doubleFaults: "", firstServe: "", form: "", injury: "", motivation: "", last5: "",
      ...emptyMatches, ...emptyTitles, ...emptyInjuries
    },
    p2: {
      rank: "", bestRank: "", ageHeight: "", nationality: "", hand: "", style: "",
      winrateCareer: "", winrateSeason: "", winrateSurface: "",
      aces: "", doubleFaults: "", firstServe: "", form: "", injury: "", motivation: "", last5: "",
      ...emptyMatches, ...emptyTitles, ...emptyInjuries
    },
    h2h: { global: "", surface: "", advantage: "", lastMatches: "" },
    conditions: { weather: "", temp: "", wind: "", altitude: "", humidity: "" },
    bookmaker: { oddA: "", oddB: "", movement: "" },
    synthesis: { tech: "", mental: "", physical: "", surface: "", momentum: "", xFactor: "", risk: "" },
    prediction: {
      probA: "", probB: "", probOver: "", probTieBreak: "", probUpset: "", risk: "",
      recoWinner: "", recoOver: "", recoSet: ""
    }
  } as unknown as GodModeReportV2;
};

// ============================================================================
// 3. LE MOTEUR D'EXTRACTION
// ============================================================================

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    
    // A. RESET & ANTI-SPAM
    const now = Date.now();
    if (now - lastTimestamp < 1000) await new Promise(r => setTimeout(r, 800));
    lastTimestamp = now;

    // On part d'une feuille blanche absolue
    const uniqueId = `scan-${now}`;
    const report = getEmptyReport(uniqueId);
    
    // Noms de secours (si OCR échoue totalement)
    const fallbackP1 = currentMatch?.player1?.name || "Joueur 1";
    const fallbackP2 = currentMatch?.player2?.name || "Joueur 2";

    try {
      console.log("🔄 OCR: Initialisation...");
      // @ts-ignore
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng'); // Anglais lit mieux les données techniques
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      console.log("📝 Texte OCR brut :", text.substring(0, 150) + "...");

      // B. PRÉ-TRAITEMENT
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2) // Filtre bruit court
        .filter(l => !BLACKLIST.some(bad => l.toLowerCase().includes(bad))); // Filtre paris

      // C. ANALYSE SÉMANTIQUE
      let potentialNames: string[] = [];
      let currentSection = 'UNKNOWN'; // Pour savoir si on lit des stats ou des titres

      lines.forEach((line, index) => {
        const lower = line.toLowerCase();
        const clean = cleanStr(line);

        // --- 1. DÉTECTION SURFACE ---
        for (const [key, val] of Object.entries(DICTIONARY.surfaces)) {
            if (lower.includes(key)) report.identity.surface = val as any;
        }

        // --- 2. DÉTECTION NOMS (Heuristique Stricte) ---
        // Une ligne est un nom si : Pas de chiffres, Pas de mots-clés stats, Longueur correcte
        const hasDigits = /\d/.test(line);
        const isStatKeyword = Object.values(DICTIONARY.stats).some(regex => regex.test(lower));
        
        if (!hasDigits && !isStatKeyword && line.length > 3 && line.length < 25 && line.includes(' ')) {
            // Nettoyage supplémentaire
            const nameCandidate = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
            if (nameCandidate.length > 3) potentialNames.push(nameCandidate);
        }

        // --- 3. DÉTECTION CLASSEMENT (Rank) ---
        const rankMatch = line.match(/(?:ATP|WTA|Rank|#)\s?\.?\s?(\d+)/i);
        if (rankMatch) {
            // On attribue le rang au joueur qui n'en a pas encore
            if (!report.p1.rank) report.p1.rank = `#${rankMatch[1]}`;
            else if (!report.p2.rank) report.p2.rank = `#${rankMatch[1]}`;
        }

        // --- 4. DÉTECTION AGE / TAILLE ---
        const ageMatch = line.match(/(\d{2})\s?(?:ans|years|yo)/i);
        const heightMatch = line.match(/(\d\.\d{2})\s?m/i);
        
        if (ageMatch) {
            if (!report.p1.ageHeight.includes('/')) report.p1.ageHeight = `${ageMatch[1]} ans / ?`;
            else report.p2.ageHeight = `${ageMatch[1]} ans / ?`;
        }
        if (heightMatch) {
             // On essaie de compléter le champ ageHeight
             if (report.p1.ageHeight.includes('?')) report.p1.ageHeight = report.p1.ageHeight.replace('?', `${heightMatch[1]}m`);
             else if (!report.p1.ageHeight) report.p1.ageHeight = `? / ${heightMatch[1]}m`;
             else if (report.p2.ageHeight.includes('?')) report.p2.ageHeight = report.p2.ageHeight.replace('?', `${heightMatch[1]}m`);
        }

        // --- 5. DÉTECTION STATS (La partie complexe) ---
        // On cherche le pattern "Chiffre - Mot Clé - Chiffre" (ex: 5 Aces 12)
        // ou "Mot Clé - Chiffre - Chiffre"
        const numbers = line.match(/(\d+(?:\.\d+)?%?)/g);
        
        if (numbers && numbers.length >= 2) {
            const v1 = numbers[0];
            const v2 = numbers[1]; // Parfois le 2eme chiffre est loin, à améliorer si besoin

            if (DICTIONARY.stats.aces.test(lower)) {
                report.p1.aces = v1; report.p2.aces = v2;
            }
            else if (DICTIONARY.stats.doubleFaults.test(lower)) {
                report.p1.doubleFaults = v1; report.p2.doubleFaults = v2;
            }
            else if (DICTIONARY.stats.firstServe.test(lower)) {
                report.p1.firstServe = v1.includes('%') ? v1 : v1+'%'; 
                report.p2.firstServe = v2.includes('%') ? v2 : v2+'%';
            }
        }

        // --- 6. DÉTECTION FORME (Série V/D) ---
        const formMatch = line.match(/\b([VDWL])\s+([VDWL])\s+([VDWL])\s+([VDWL])\s+([VDWL])\b/i);
        if (formMatch) {
             const cleanForm = formMatch.slice(1).map(char => DICTIONARY.results[char.toLowerCase() as keyof typeof DICTIONARY.results] || 'W').join('-');
             if (!report.p1.last5) report.p1.last5 = cleanForm;
             else report.p2.last5 = cleanForm;
        }

        // --- 7. DÉTECTION COTES (Bookmakers) ---
        const oddsMatch = line.match(/(\d\.\d{2})/g);
        if (oddsMatch && oddsMatch.length >= 2) {
            // On suppose que la première paire de décimaux trouvée correspond aux cotes
            if (!report.bookmaker.oddA) {
                report.bookmaker.oddA = oddsMatch[0];
                report.bookmaker.oddB = oddsMatch[1];
            }
        }

        // --- 8. ALERTES BLESSURE / ABANDON ---
        if (DICTIONARY.context.injury.test(lower)) {
            report.p1.injury = "ALERTE (Scan)"; // On marque l'alerte, l'humain vérifiera qui
        }

      }); // Fin de la boucle lignes

      // D. ATTRIBUTION DES NOMS
      // On essaie de faire correspondre avec les noms du match actuel
      if (potentialNames.length > 0) {
          const matchP1 = potentialNames.find(n => fallbackP1.toLowerCase().includes(n.toLowerCase().split(' ')[1] || 'xyz'));
          const matchP2 = potentialNames.find(n => fallbackP2.toLowerCase().includes(n.toLowerCase().split(' ')[1] || 'xyz'));

          report.identity.p1Name = matchP1 || (potentialNames[0] || fallbackP1);
          report.identity.p2Name = matchP2 || (potentialNames[1] || fallbackP2);
      } else {
          report.identity.p1Name = fallbackP1;
          report.identity.p2Name = fallbackP2;
      }

    } catch (e) {
      console.error("❌ Erreur OCR Critique:", e);
      // En cas de crash total, on renvoie quand même l'objet vide avec les noms par défaut
      report.identity.p1Name = fallbackP1;
      report.identity.p2Name = fallbackP2;
    }

    // Le rapport retourné est propre, structuré, et contient des cases vides là où l'OCR a échoué.
    // Pas d'invention.
    return report;
  }
};
