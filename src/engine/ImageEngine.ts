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

        // Zoom x3 pour bien séparer les lettres
        canvas.width = img.width * 3;
        canvas.height = img.height * 3;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Contraste Binaire
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const color = avg < 165 ? 0 : 255; 
          data[i] = data[i+1] = data[i+2] = color;
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
  analyzeScreenshot: async (file: File, currentMatch?: any): Promise<GodModeReportV2> => {
    analysisCount++;
    console.log(`🛡️ SCAN V4 (Splitter) #${analysisCount}`);

    let player1Name = '';
    let player2Name = '';
    let detectedMatches: any[] = [];

    try {
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const processedImage = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng+fra'); 
      
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // Bloc uniforme
        preserve_interword_spaces: '1',
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // --- LISTE NOIRE MISE À JOUR ---
      const BANNED = [
        'faites', 'pari', 'afficher', 'plus', 'connexion', 'inscription',
        'wta', 'atp', 'itf', 'challenger', 'rank', 'rang', 'tête',
        'resume', 'chances', 'h2h', 'tete', 'matchs', 'tableau', 'cote',
        'bet365', 'unibet', 'winamax', 'betclic', '1xbet',
        'janv', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec',
        'actobre', 'wtaczet', 'tarc', 'czet', 'me', 'les', 'cy', '25', '1e'
      ];

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (const line of lines) {
        const lower = line.toLowerCase();

        // 1. FILTRE POUBELLE
        if (BANNED.some(bad => lower.includes(bad))) continue;
        if (/\d{2}[./]\d{2}/.test(line)) continue; // Date
        if (line.includes(':')) continue; // Heure

        // 2. NETTOYAGE
        // On vire tout sauf lettres, points, tirets, espaces
        let cleanName = line.replace(/[^a-zA-Z\s.-]/g, '').trim();

        // 3. LE DÉCOUPEUR (SPLITTER)
        // Si la ligne contient "Nom A. Nom B." (détecté par point suivi d'espace et majuscule)
        // Ex: "Paquet C. Salkova D."
        if (cleanName.match(/[a-z]\.\s+[A-Z]/)) {
            const parts = cleanName.split(/\.\s+/);
            if (parts.length >= 2) {
                // On a trouvé les deux sur la même ligne !
                const p1 = parts[0] + "."; // On remet le point
                const p2 = parts[1]; // Le reste
                
                if (!player1Name && p1.length > 3) player1Name = p1.trim();
                if (!player2Name && p2.length > 3) player2Name = p2.trim();
                console.log('⚔️ SPLIT DETECTION:', player1Name, 'VS', player2Name);
                break; // On a trouvé nos deux joueurs, on arrête
            }
        }

        // 4. DETECTION CLASSIQUE (Un joueur par ligne)
        if (cleanName.length > 3 && cleanName.length < 25) {
            const isAllUpper = cleanName === cleanName.toUpperCase();
            if (!isAllUpper && /[A-Z]/.test(cleanName)) {
                if (!player1Name) {
                    player1Name = cleanName;
                } else if (!player2Name && !cleanName.includes(player1Name)) {
                    player2Name = cleanName;
                }
            }
        }
      }

    } catch (e) {
      console.error('❌ Erreur OCR:', e);
    }

    const p1 = player1Name || 'Inconnu A';
    const p2 = player2Name || 'Inconnu B';

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
      p1: createPlayerData(p1, [], []),
      p2: createPlayerData(p2, [], []),
      h2h: { global: '? - ?' },
      conditions: { weather: '?', temp: '?' },
      bookmaker: { oddA: '1.90', oddB: '1.90', movement: 'STABLE' },
      synthesis: { risk: 'HIGH', xFactor: 'Aucun' },
      prediction: { probA: '50%', probB: '50%', recoWinner: 'Analyse manuelle', risk: 'HIGH' }
    } as any;
  }
};

function createPlayerData(name: string, rank: any, matches: any[]) {
    const data: any = { rank: '-', form: '5/10', hand: 'Droitier', nationality: '?' };
    for (let i = 0; i < 20; i++) {
        data[`match${i+1}_date`] = '';
        data[`match${i+1}_score`] = '';
        data[`match${i+1}_opponent`] = '';
    }
    return data;
}
