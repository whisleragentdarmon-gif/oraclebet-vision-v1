import { GodModeReportV2 } from './types';

interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
  setParameters: (params: any) => Promise<void>;
}

interface TesseractModule {
  createWorker: (langs?: string) => Promise<TesseractWorker>;
}

let analysisCount = 0;

const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(event.target?.result as string);

        // Zoom x3 pour maximiser la netteté des textes
        canvas.width = img.width * 3;
        canvas.height = img.height * 3;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Contraste élevé (Noir & Blanc strict)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Tout ce qui est gris clair devient blanc (fond), le reste noir (texte)
          const color = avg < 180 ? 0 : 255; 
          data[i] = color;     
          data[i + 1] = color; 
          data[i + 2] = color; 
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    console.log(`🛡️ SCAN STRICT #${analysisCount}`);

    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let detectedMatches: any[] = [];

    try {
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const processedImage = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng+fra'); 
      
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // Force la lecture ligne par ligne
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // --- LISTE NOIRE AGRESSIVE (Si un mot est trouvé, on jette la ligne) ---
      const BANNED_PATTERNS = [
        'janv', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec',
        'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
        'resume', 'chances', 'h2h', 'tete', 'matchs', 'points', 'sets', 'tableau', 'tournoi', 
        'cote', 'bet', 'unibet', 'winamax', 'ligne', 'paiement', 'connexion', 'profil', 
        'stat', 'notif', 'favoris', 'foot', 'basket', 'tennis', 'live', 'score', 'termin',
        'me', 'les', 'cy', '25', 'actobre' // Tes erreurs spécifiques
      ];

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);

      for (const line of lines) {
        const lower = line.toLowerCase();

        // 1. SI C'EST UNE DATE OU UN TRUC BIZARRE -> POUBELLE
        if (BANNED_PATTERNS.some(bad => lower.includes(bad))) continue;
        if (/\d{2}[./]\d{2}/.test(line)) continue; // "12.10" est une date, pas un nom
        if (line.includes(':')) continue; // "14:00" est une heure

        // 2. DÉTECTION DES RANGS
        const rankMatch = line.match(/(?:ATP|Rank|#)\s*[:.]?\s*(\d+)/i);
        if (rankMatch) {
            const rank = rankMatch[1];
            if (player1Rank === '?') player1Rank = rank;
            else if (player2Rank === '?' && rank !== player1Rank) player2Rank = rank;
            continue;
        }

        // 3. NETTOYAGE DU NOM
        // On enlève tout ce qui n'est pas une lettre
        const cleanName = line.replace(/[^a-zA-Z\u00C0-\u00FF\s.-]/g, '').trim();

        // Un nom de joueur de tennis valide :
        // - Plus de 3 lettres
        // - Pas trop long
        // - Contient au moins une majuscule
        // - N'est pas entièrement numérique
        if (cleanName.length > 3 && cleanName.length < 25 && /[A-Z]/.test(cleanName)) {
            
            if (!player1Name) {
                player1Name = cleanName;
                console.log('✅ J1:', player1Name);
            } else if (!player2Name) {
                // On vérifie que ce n'est pas le même nom (ou une partie du même nom)
                if (!cleanName.includes(player1Name) && !player1Name.includes(cleanName)) {
                    player2Name = cleanName;
                    console.log('✅ J2:', player2Name);
                }
            }
        }
      }

    } catch (e) {
      console.error('❌ Erreur OCR:', e);
    }

    // Fallback si échec : on met "Inconnu" plutôt que de laisser des vieux noms
    const p1 = player1Name || 'Inconnu 1';
    const p2 = player2Name || 'Inconnu 2';

    return {
      identity: {
        p1Name: p1,
        p2Name: p2,
        tournament: 'Analyse Image',
        surface: 'Dur',
        date: new Date().toLocaleDateString('fr-FR'),
        time: '12:00',
        round: '1er Tour'
      },
      p1: createPlayerData(p1, player1Rank, []),
      p2: createPlayerData(p2, player2Rank, []),
      h2h: { global: '? - ?' },
      conditions: { weather: '?', temp: '?' },
      bookmaker: { oddA: '1.90', oddB: '1.90', movement: 'STABLE' },
      synthesis: { risk: 'HIGH', xFactor: 'Aucun' },
      prediction: { 
          probA: '50%', probB: '50%', 
          recoWinner: 'Analyse manuelle requise', 
          risk: 'HIGH' 
      }
    } as any;
  }
};

function createPlayerData(name: string, rank: string, matches: any[]) {
    const data: any = { 
        rank: rank !== '?' ? rank : '-', 
        form: '5/10',
        hand: 'Droitier',
        nationality: '?'
    };
    // Remplissage vide pour éviter les erreurs
    for (let i = 0; i < 20; i++) {
        data[`match${i+1}_date`] = '';
        data[`match${i+1}_score`] = '';
        data[`match${i+1}_opponent`] = '';
    }
    return data;
}
