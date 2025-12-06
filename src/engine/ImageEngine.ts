import { GodModeReportV2 } from './types';

// --- INTERFACES TESSERACT ---
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

// --- 1. DICTIONNAIRES & CONFIGURATION ---
const DICTIONARY = {
  surfaces: {
    'terre': 'Clay', 'clay': 'Clay', 'brique': 'Clay', 'red clay': 'Clay',
    'dur': 'Hard', 'hard': 'Hard', 'beton': 'Hard', 'acrylic': 'Hard',
    'salle': 'Indoor', 'indoor': 'Indoor', 'i_hard': 'Indoor',
    'gazon': 'Grass', 'grass': 'Grass', 'herbe': 'Grass'
  },
  results: {
    'v': 'W', 'd': 'L', 'win': 'W', 'loss': 'L', 'won': 'W', 'lost': 'L'
  },
  statsKeywords: {
    aces: ['aces', 'ace'],
    df: ['double', 'fautes', 'df', 'double faults'],
    firstServe: ['1er', '1st', 'serve', 'service'],
    breakPoints: ['break', 'bp', 'balles'],
    winRate: ['gagné', 'won', 'win %']
  }
};

// Liste noire pour nettoyer les noms
const NOISE_FILTER = [
  'score', 'match', 'stat', 'bet', 'win', 'cote', 'profil', 'h2h', 'vs', 
  'tournoi', 'ranking', 'atp', 'wta', 'set', 'jeu', 'total', 'point',
  'connexion', 'inscription', 'parier', 'bonus', 'live', 'direct', 'flashscore'
];

// Cache anti-spam
let lastAnalysisTimestamp = 0;

// --- 2. FONCTIONS UTILITAIRES DE PARSING ---

/**
 * Nettoie une ligne de texte pour enlever les symboles parasites
 */
const cleanLine = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9\s%.-]/g, '').trim();
};

/**
 * Essaie de trouver un nombre dans une ligne qui contient un mot clé
 */
const extractStatValue = (lines: string[], keywords: string[]): string => {
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      // Cherche un nombre (ex: "5", "67%", "1.2")
      const match = line.match(/(\d+(?:\.\d+)?%?)/);
      if (match) return match[1];
    }
  }
  return '';
};

/**
 * Détecte une série de forme (ex: "V D V V")
 */
const extractForm = (lines: string[]): string[] => {
  for (const line of lines) {
    // Cherche une séquence de 5 lettres V,D,W,L séparées par espace ou tiret
    const match = line.match(/\b([VDWL])[\s-]+([VDWL])[\s-]+([VDWL])[\s-]+([VDWL])[\s-]+([VDWL])\b/i);
    if (match) {
      return match.slice(1).map(r => DICTIONARY.results[r.toLowerCase() as keyof typeof DICTIONARY.results] || 'W');
    }
  }
  return [];
};

// --- 3. MOTEUR PRINCIPAL ---

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    
    // --- A. INITIALISATION SÉCURISÉE ---
    const extraction = {
        p1Name: "", p2Name: "",
        p1Rank: "", p2Rank: "",
        tournament: "",
        surface: "Hard" as "Hard" | "Clay" | "Grass" | "Indoor",
        stats: {
            aces: { p1: '', p2: '' },
            df: { p1: '', p2: '' },
            firstServe: { p1: '', p2: '' }
        },
        odds: { p1: '', p2: '' },
        formP1: [] as string[],
        formP2: [] as string[]
    };

    // Anti-spam (1.5s)
    const now = Date.now();
    if (now - lastAnalysisTimestamp < 1500) await new Promise(r => setTimeout(r, 1500));
    lastAnalysisTimestamp = now;

    try {
      console.log('🔄 OCR: Initialisation Tesseract...');
      // @ts-ignore
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng'); // Anglais pour mieux lire les chiffres
      
      console.log('🔍 OCR: Analyse image en cours...');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // --- B. TRAITEMENT DU TEXTE LIGNE PAR LIGNE ---
      const rawLines = text.split('\n');
      const lines = rawLines.map(l => l.trim()).filter(l => l.length > 2);

      console.log(`📝 OCR: ${lines.length} lignes extraites.`);

      let namesFound: string[] = [];

      lines.forEach((line, index) => {
          const lower = line.toLowerCase();
          const clean = cleanLine(line);

          // 1. DÉTECTION SURFACE
          for (const [key, val] of Object.entries(DICTIONARY.surfaces)) {
              if (lower.includes(key)) extraction.surface = val as any;
          }

          // 2. DÉTECTION NOMS (Heuristique : lignes courtes, sans chiffres, pas de mots interdits)
          const isBanned = NOISE_FILTER.some(bad => lower.includes(bad));
          const hasNumbers = /\d/.test(line);
          const isVersus = / vs | - /.test(lower); // Ligne type "Nadal - Federer"

          if (!isBanned && !hasNumbers && line.length > 3 && line.length < 25) {
              if (namesFound.length < 2) {
                  // Nettoyage supplémentaire pour les noms
                  const nameClean = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
                  if (nameClean.length > 3) namesFound.push(nameClean);
              }
          }

          // 3. DÉTECTION CLASSEMENT (Rank)
          // Ex: "ATP 100", "# 25", "Rank: 5"
          const rankMatch = line.match(/(?:ATP|WTA|Rank|#)\s?[:.]?\s?(\d+)/i);
          if (rankMatch) {
              if (!extraction.p1Rank) extraction.p1Rank = rankMatch[1];
              else if (!extraction.p2Rank) extraction.p2Rank = rankMatch[1];
          }

          // 4. DÉTECTION COTES (Format décimal 1.XX)
          // On cherche deux nombres décimaux sur la même ligne ou lignes proches
          const oddsMatch = line.match(/(\d\.\d{2})/g);
          if (oddsMatch && oddsMatch.length >= 2) {
              // On suppose que c'est les cotes P1 et P2
              if (!extraction.odds.p1) {
                  extraction.odds.p1 = oddsMatch[0];
                  extraction.odds.p2 = oddsMatch[1];
              }
          }
      });

      // --- C. TRAITEMENT SPÉCIFIQUE (BLOCS DE STATS) ---
      // On repasse sur les lignes pour chercher des stats spécifiques
      extraction.stats.aces.p1 = extractStatValue(lines, DICTIONARY.statsKeywords.aces);
      extraction.stats.df.p1 = extractStatValue(lines, DICTIONARY.statsKeywords.df);
      extraction.stats.firstServe.p1 = extractStatValue(lines, DICTIONARY.statsKeywords.firstServe);

      // Pour la forme, on cherche les motifs V D V L W
      const forms = extractForm(lines);
      if (forms.length > 0) extraction.formP1 = forms;
      
      // Essayer de trouver une deuxième ligne de forme pour P2
      // (Souvent plus loin dans le texte)
      const linesReverse = [...lines].reverse();
      const forms2 = extractForm(linesReverse);
      if (forms2.length > 0 && JSON.stringify(forms2) !== JSON.stringify(forms)) {
          extraction.formP2 = forms2;
      } else {
          // Si pas trouvé, on met vide
          extraction.formP2 = [];
      }

      // Assignation des noms trouvés (Si l'OCR a bien marché)
      if (namesFound.length >= 1) extraction.p1Name = namesFound[0];
      if (namesFound.length >= 2) extraction.p2Name = namesFound[1];

      console.log("📊 Données extraites :", extraction);

    } catch (error) {
      console.error('❌ CRASH OCR:', error);
    }
    
    // --- D. CONSOLIDATION ET RETOUR ---
    // On utilise les données du match actuel comme "Fallback" si l'OCR a raté les noms
    // Mais on garde les stats OCR si elles existent (pas de fake data)

    const finalP1Name = extraction.p1Name || currentMatch?.player1?.name || "Inconnu 1";
    const finalP2Name = extraction.p2Name || currentMatch?.player2?.name || "Inconnu 2";
    
    const uniqueId = `scan-${Date.now()}`; // Force refresh React

    return {
      identity: {
        p1Name: finalP1Name,
        p2Name: finalP2Name,
        tournament: extraction.tournament || currentMatch?.tournament || "Tournoi Non Détecté",
        surface: extraction.surface,
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00', // Difficile à lire en OCR, on laisse par défaut
        round: 'Auto',
        matchId: uniqueId
      },
      p1: {
        rank: extraction.p1Rank ? `#${extraction.p1Rank}` : '',
        bestRank: '', 
        ageHeight: '', 
        nationality: '',
        hand: '',
        style: '',
        winrateCareer: '',
        winrateSeason: '',
        winrateSurface: '',
        // Ici on met les VRAIES valeurs lues ou rien du tout
        aces: extraction.stats.aces.p1 || '',
        doubleFaults: extraction.stats.df.p1 || '',
        firstServe: extraction.stats.firstServe.p1 || '',
        form: '',
        injury: '',
        motivation: '',
        last5: extraction.formP1.length > 0 ? extraction.formP1.join('-') : ''
      },
      p2: {
        rank: extraction.p2Rank ? `#${extraction.p2Rank}` : '',
        bestRank: '',
        ageHeight: '',
        nationality: '',
        hand: '',
        style: '',
        winrateCareer: '',
        winrateSeason: '',
        winrateSurface: '',
        aces: '', // Difficile de distinguer P1/P2 en OCR simple sans structure
        doubleFaults: '',
        firstServe: '',
        form: '',
        injury: '',
        motivation: '',
        last5: extraction.formP2.length > 0 ? extraction.formP2.join('-') : ''
      },
      h2h: {
        global: '',
        surface: '',
        advantage: '',
        lastMatches: ''
      },
      conditions: {
        weather: '',
        temp: '',
        wind: '',
        altitude: '',
        humidity: ''
      },
      bookmaker: {
        oddA: extraction.odds.p1 || '',
        oddB: extraction.odds.p2 || '',
        movement: ''
      },
      synthesis: {
        tech: '',
        mental: '',
        physical: '',
        surface: extraction.surface,
        momentum: '',
        xFactor: '',
        risk: ''
      },
      prediction: {
        probA: '',
        probB: '',
        probOver: '',
        probTieBreak: '',
        probUpset: '',
        risk: '',
        recoWinner: '',
        recoOver: '',
        recoSet: ''
      }
    } as unknown as GodModeReportV2;
  }
};
