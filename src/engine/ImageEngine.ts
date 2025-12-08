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

// Pré-traitement pour nettoyer le gris et les pubs visuelles
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(event.target?.result as string);

        // Zoom x3 pour bien séparer les lettres collées
        canvas.width = img.width * 3;
        canvas.height = img.height * 3;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Contraste Binaire Strict
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Seuil < 170 : Noir (Texte), Sinon Blanc (Fond)
          const color = avg < 170 ? 0 : 255; 
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
  analyzeScreenshot: async (file: File, currentMatch?: any): Promise<GodModeReportV2> => {
    analysisCount++;
    console.log(`🛡️ SCAN V5 (Splitter & Anti-Pub) #${analysisCount}`);

    let player1Name = '';
    let player2Name = '';
    let detectedMatches: any[] = [];

    try {
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const processedImage = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng+fra'); 
      
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // Bloc uniforme (force la lecture ligne par ligne)
        preserve_interword_spaces: '1',
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // --- LISTE NOIRE CIBLÉE (Mise à jour avec tes retours) ---
      const BANNED = [
        'faites', 'pari', 'afficher', 'plus', 'connexion', 'inscription', // UI
        'wta', 'atp', 'itf', 'challenger', 'rank', 'rang', 'tête', // Mots clés tennis
        'resume', 'chances', 'h2h', 'tete', 'matchs', 'tableau', 'cote', // Onglets
        'bet365', 'unibet', 'winamax', 'betclic', '1xbet', // Pubs
        'janv', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec', // Mois
        'actobre', 'wtaczet', 'tarc', 'czet', 'me', 'les', 'cy', '25', '1e' // Tes erreurs spécifiques
      ];

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (const line of lines) {
        const lower = line.toLowerCase();

        // 1. FILTRE POUBELLE
        if (BANNED.some(bad => lower.includes(bad))) continue;
        if (/\d{2}[./]\d{2}/.test(line)) continue; // Date (ex: 12.10)
        if (line.includes(':')) continue; // Heure (ex: 14:00)

        // 2. NETTOYAGE
        // On vire tout sauf lettres, points, tirets, espaces
        let cleanName = line.replace(/[^a-zA-Z\s.-]/g, '').trim();

        // 3. LE DÉCOUPEUR (SPLITTER) - C'est ICI qu'on règle "Paquet C. Salkova D."
        // On cherche un motif : minuscule, point, espace, Majuscule (ex: "t. S")
        if (cleanName.match(/[a-z]\.\s+[A-Z]/)) {
            // On coupe là où on trouve "point espace"
            const parts = cleanName.split(/\.\s+/);
            
            if (parts.length >= 2) {
                // On reconstitue les noms
                const p1 = parts[0] + "."; 
                const p2 = parts[1]; 
                
                // Si les morceaux ressemblent à des noms (plus de 3 lettres)
                if (!player1Name && p1.length > 3) {
                    player1Name = p1.trim();
                    console.log('⚔️ SPLIT J1:', player1Name);
                }
                if (!player2Name && p2.length > 3) {
                    player2Name = p2.trim();
                    console.log('⚔️ SPLIT J2:', player2Name);
                }
                if (player1Name && player2Name) break; // On a tout trouvé, on sort
            }
        }

        // 4. DETECTION CLASSIQUE (Un joueur par ligne)
        if (cleanName.length > 3 && cleanName.length < 25) {
            const isAllUpper = cleanName === cleanName.toUpperCase();
            // Il faut au moins une majuscule et pas que des majuscules (sauf si court)
            if (/[A-Z]/.test(cleanName) && (!isAllUpper || cleanName.length < 12)) {
                if (!player1Name) {
                    player1Name = cleanName;
                    console.log('✅ J1:', player1Name);
                } else if (!player2Name && !cleanName.includes(player1Name)) {
                    player2Name = cleanName;
                    console.log('✅ J2:', player2Name);
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
