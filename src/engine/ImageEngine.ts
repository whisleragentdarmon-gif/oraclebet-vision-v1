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

        // Zoom agressif x3 pour séparer les lettres collées
        canvas.width = img.width * 3;
        canvas.height = img.height * 3;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Contraste Binaire Strict
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Seuil < 170 : Noir, Sinon Blanc
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
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    console.log(`🛡️ SCAN ANTI-PUB #${analysisCount}`);

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
        tessedit_pageseg_mode: '6', // Bloc de texte uniforme
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // --- LISTE NOIRE CIBLÉE (Tes erreurs sont ici) ---
      const BANNED = [
        'faites', 'pari', 'afficher', 'plus', 'connexion', 'inscription', // UI
        'wta', 'atp', 'itf', 'challenger', 'rank', 'rang', // Mots clés tennis
        'resume', 'chances', 'h2h', 'tete', 'matchs', 'tableau', 'cote', // Onglets
        'bet365', 'unibet', 'winamax', 'betclic', '1xbet', // Pubs
        'janv', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec', // Mois
        'actobre', 'tarc', 'czet', 'me', 'les', 'cy' // Tes erreurs spécifiques
      ];

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (const line of lines) {
        const lower = line.toLowerCase();

        // 1. SUPPRESSION DIRECTE SI MOT BANNI
        if (BANNED.some(bad => lower.includes(bad))) continue;
        if (/\d{2}[./]\d{2}/.test(line)) continue; // C'est une date
        if (line.includes(':')) continue; // C'est une heure

        // 2. RECUPERATION DU RANG
        const rankMatch = line.match(/(?:#)(\d+)/); // Cherche juste "#123"
        if (rankMatch) {
            const r = rankMatch[1];
            if (player1Rank === '?') player1Rank = r;
            else if (player2Rank === '?' && r !== player1Rank) player2Rank = r;
            // On ne continue pas, une ligne de rang n'est pas un nom
            continue; 
        }

        // 3. NETTOYAGE NOM
        // On enlève les chiffres et symboles bizarres
        let cleanName = line.replace(/[^a-zA-Z\s.-]/g, '').trim();

        // 4. LOGIQUE DE DÉCOUPAGE (Si "Paquet C. Salkova D." sur la même ligne)
        // Si la ligne est longue et contient plusieurs majuscules séparées
        if (cleanName.length > 15) {
            // On essaie de couper au milieu ou après un point
            const parts = cleanName.split(/\s{2,}|\.\s/); // Coupe sur double espace ou point+espace
            if (parts.length >= 2) {
               // On a trouvé 2 noms sur une ligne !
               if(!player1Name && parts[0].length > 3) player1Name = parts[0].trim();
               if(!player2Name && parts[1].length > 3) player2Name = parts[1].trim();
               continue;
            }
        }

        // 5. VALIDATION NOM SIMPLE
        if (cleanName.length > 3 && cleanName.length < 25) {
            // Un nom doit avoir des majuscules mais pas être TOUT EN MAJUSCULE (souvent des titres)
            const isAllUpper = cleanName === cleanName.toUpperCase();
            
            if (!isAllUpper || cleanName.length < 10) {
                if (!player1Name) {
                    player1Name = cleanName;
                    console.log('✅ J1:', player1Name);
                } else if (!player2Name) {
                    // Eviter les doublons ou sous-chaines
                    if (!cleanName.includes(player1Name)) {
                        player2Name = cleanName;
                        console.log('✅ J2:', player2Name);
                    }
                }
            }
        }
      }

    } catch (e) {
      console.error('❌ Erreur OCR:', e);
    }

    // Placeholders si échec
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
    for (let i = 0; i < 20; i++) {
        data[`match${i+1}_date`] = '';
        data[`match${i+1}_score`] = '';
        data[`match${i+1}_opponent`] = '';
    }
    return data;
}
