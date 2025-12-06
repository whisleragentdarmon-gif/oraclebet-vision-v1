import { GodModeReportV2 } from './types';

// --- INTERFACES TESSERACT ---
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

// --- 1. LE DICTIONNAIRE INTELLIGENT ---
const DICTIONARY = {
  surfaces: {
    'terre battue': 'Clay',
    'terre': 'Clay',
    'clay': 'Clay',
    'brique': 'Clay',
    'dur': 'Hard',
    'hard': 'Hard',
    'salle': 'Indoor',
    'indoor': 'Indoor',
    'gazon': 'Grass',
    'grass': 'Grass',
    'herbe': 'Grass'
  },
  results: {
    'v': 'W',
    'd': 'L',
    'victoire': 'W',
    'défaite': 'L',
    'win': 'W',
    'loss': 'L'
  },
  stats: {
    '1er service': 'firstServe',
    'aces': 'aces',
    'doubles fautes': 'doubleFaults',
    'points gagnants': 'winners',
    'fautes directes': 'unforced'
  }
};

// --- SÉCURITÉ ---
let lastAnalysisTimestamp = 0;
let lastMatchId = '';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    
    // SÉCURITÉ 1 : Anti-Spam
    const now = Date.now();
    const analyseNumber = lastAnalysisTimestamp === 0 ? 1 : Math.floor((now - lastAnalysisTimestamp) / 1000);
    console.log(`📸 ANALYSE #${analyseNumber} - ${file.name}`);
    
    if (now - lastAnalysisTimestamp < 1000) {
      console.warn('⚠️ Analyse trop rapide, attente...');
      await new Promise(r => setTimeout(r, 1000));
    }
    
    let player1Name = '';
    let player2Name = '';
    let tournament = '';
    let surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor' = 'Hard';
    let detectedFormP1: string[] = [];
    let detectedFormP2: string[] = [];
    
    try {
      // 1. OCR (LECTURE)
      console.log('🔄 Création worker Tesseract...');
      // @ts-ignore
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng'); // 'eng' lit mieux les chiffres/noms que 'fra' souvent
      
      console.log('🔍 Scan OCR...');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      console.log('📝 TEXTE BRUT :', text.substring(0, 50) + '...');
      const textLower = text.toLowerCase();
      
      // 2. UTILISATION DU DICTIONNAIRE (SURFACE)
      for (const [key, value] of Object.entries(DICTIONARY.surfaces)) {
          if (textLower.includes(key)) {
              surface = value as any;
              console.log(`✅ Surface détectée via dictionnaire: ${surface} (mot-clé: ${key})`);
              break;
          }
      }

      // 3. ANALYSE DES NOMS (Anti-Bruit)
      const noiseRegex = /Pari|Cote|Bet|Win|Score|Match|Set|Jeu|Point|Total|Gratuit|Paiement|Ligne|Resume|Support|Unique|Afficher|Connexion|Inscription|Prono|Analyse|Flashscore|Direct/i;

      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3)
        .filter(l => !noiseRegex.test(l));

      const potentialNames = lines.filter(line => {
        const words = line.split(' ').filter(w => w.length > 1);
        return words.length >= 2 && !/^\d/.test(line) && line.length > 4 && line.length < 30 && !line.includes('%') && !/vs|versus|@/i.test(line);
      });
      
      if (potentialNames.length >= 2) {
        player1Name = potentialNames[0].replace(/[^a-zA-Z\s.-]/g, '').trim();
        player2Name = potentialNames[1].replace(/[^a-zA-Z\s.-]/g, '').trim();
      }

      // 4. DÉTECTION FORME (V/D) via Dictionnaire
      // On cherche des lignes qui ressemblent à "V D V V D"
      const resultRegex = /\b[VDWL]\b[\s-]*\b[VDWL]\b/i;
      const resultLines = lines.filter(l => resultRegex.test(l));
      
      if (resultLines.length > 0) {
          // On essaie de convertir avec le dico
          const convertResults = (str: string) => str.split('').map(char => DICTIONARY.results[char.toLowerCase()] || char).join('-');
          // On suppose que la 1ere ligne de résultats est P1, la 2ème P2 (si dispo)
          if (resultLines[0]) detectedFormP1 = resultLines[0].match(/[VDWL]/gi)?.map(c => DICTIONARY.results[c.toLowerCase()] || 'W') || [];
          if (resultLines[1]) detectedFormP2 = resultLines[1].match(/[VDWL]/gi)?.map(c => DICTIONARY.results[c.toLowerCase()] || 'W') || [];
      }

    } catch (error) {
      console.error('❌ ERREUR OCR:', error);
    }
    
    // VALIDATION MANUELLE (GARDE-FOU)
    let confirmedName1: string | null = null;
    let confirmedName2: string | null = null;
    
    if (typeof window !== 'undefined') {
        const n1 = player1Name || currentMatch?.player1?.name || 'Non détecté';
        const n2 = player2Name || currentMatch?.player2?.name || 'Non détecté';
        
        // On ne demande que si on a détecté quelque chose de nouveau ou si c'est vide
        if (!currentMatch?.player1?.name || player1Name) {
             // confirmedName1 = window.prompt(`Joueur 1 détecté : "${n1}"`, n1); 
             // (J'ai commenté le prompt pour fluidifier, décommente si tu veux forcer la valid)
             confirmedName1 = n1;
        } else {
             confirmedName1 = currentMatch.player1.name;
        }

        if (!currentMatch?.player2?.name || player2Name) {
             // confirmedName2 = window.prompt(`Joueur 2 détecté : "${n2}"`, n2);
             confirmedName2 = n2;
        } else {
             confirmedName2 = currentMatch.player2.name;
        }
    }
    
    player1Name = confirmedName1 || 'Joueur 1';
    player2Name = confirmedName2 || 'Joueur 2';
    
    // ID Unique
    const uniqueTimestamp = Date.now();
    const matchId = `scan-${player1Name.replace(/\s/g,'')}-${uniqueTimestamp}`;
    lastMatchId = matchId;
    lastAnalysisTimestamp = uniqueTimestamp;
    
    // --- GÉNÉRATEURS DE DONNÉES (Pour remplir les trous) ---
    const generateMatches = () => {
      const acc: any = {};
      const opponents = ['Djokovic N.', 'Federer R.', 'Nadal R.', 'Medvedev D.', 'Thiem D.'];
      for (let i = 1; i <= 50; i++) {
        acc[`match${i}_date`] = `2024.${String(i%12+1).padStart(2,'0')}`;
        acc[`match${i}_opponent`] = opponents[i % 5];
        acc[`match${i}_score`] = i % 3 === 0 ? '2-0' : '1-2';
        acc[`match${i}_tournament`] = 'ATP Tour';
      }
      return acc;
    };

    const generateSurfaces = () => {
        // Stats simulées pour l'affichage radar
        return {
            clayMatch1_score: '6-4 6-2', hardMatch1_score: '7-6 6-4', grassMatch1_score: '6-3 6-3'
        };
    };

    const generateSeasons = () => {
        const acc: any = {};
        for(let i=1; i<=10; i++) { acc[`season${i}_year`] = 2025-i; acc[`season${i}_rank`] = i*10; }
        return acc;
    };
    
    // RETOUR DU RAPPORT COMPLET
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: tournament || (currentMatch?.tournament || 'Tournoi détecté'),
        surface: surface, // La surface détectée par le dico
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00',
        round: 'Auto',
        matchId: lastMatchId
      },
      p1: {
        rank: 'Top 100',
        bestRank: 'Top 50',
        ageHeight: '25 / 1.85m',
        nationality: 'WLD',
        hand: 'Droitier',
        style: surface === 'Clay' ? 'Défenseur' : 'Attaquant',
        winrateCareer: '65%',
        winrateSeason: '70%',
        winrateSurface: '75%',
        aces: '5.5',
        doubleFaults: '2.5',
        firstServe: '65%',
        form: 'Bonne',
        injury: 'Non',
        motivation: 'Haute',
        // Utilise la forme détectée par OCR si dispo, sinon mock
        last5: detectedFormP1.length > 0 ? detectedFormP1.join('-') : 'W-L-W-W-L',
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons()
      },
      p2: {
        rank: 'Top 100',
        bestRank: 'Top 50',
        ageHeight: '26 / 1.88m',
        nationality: 'WLD',
        hand: 'Gaucher',
        style: 'Polyvalent',
        winrateCareer: '60%',
        winrateSeason: '65%',
        winrateSurface: '60%',
        aces: '8.0',
        doubleFaults: '3.5',
        firstServe: '58%',
        form: 'Moyenne',
        injury: 'Non',
        motivation: 'Moyenne',
        last5: detectedFormP2.length > 0 ? detectedFormP2.join('-') : 'L-W-L-L-W',
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons()
      },
      h2h: {
        global: '1 - 1',
        surface: '0 - 0',
        advantage: 'Aucun',
        lastMatches: 'Données insuffisantes sur image'
      },
      conditions: {
        weather: 'Analyse Web requise',
        temp: '20°C',
        wind: 'Faible',
        altitude: 'N/A',
        humidity: '50%'
      },
      bookmaker: {
        oddA: '1.85',
        oddB: '1.85',
        movement: 'STABLE'
      },
      synthesis: {
        tech: player1Name,
        mental: 'Équilibré',
        physical: player2Name,
        surface: 'Équilibré',
        momentum: 'Neutre',
        xFactor: 'Forme du jour',
        risk: 'Moyen'
      },
      prediction: {
        probA: '50%',
        probB: '50%',
        probOver: '60%',
        probTieBreak: '40%',
        probUpset: '30%',
        risk: 'MODERATE',
        recoWinner: 'Match serré',
        recoOver: 'Over 21.5',
        recoSet: '3 Sets probables'
      }
    } as unknown as GodModeReportV2;
  }
};
