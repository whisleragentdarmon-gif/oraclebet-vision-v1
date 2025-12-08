import { GodModeReportV2 } from './types';

// Interfaces Tesseract
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
  setParameters: (params: any) => Promise<void>;
}

interface TesseractModule {
  createWorker: (langs?: string) => Promise<TesseractWorker>;
}

let analysisCount = 0;

// 1. PRÉ-TRAITEMENT (Noir et Blanc + Contraste)
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(event.target?.result as string);

        // Zoom x2.5 pour bien lire les petits textes
        canvas.width = img.width * 2.5;
        canvas.height = img.height * 2.5;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Seuil < 160 = Noir (Texte), sinon Blanc (Fond)
          const color = avg < 160 ? 0 : 255; 
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
    console.log(`🧹 SCAN AVANCÉ #${analysisCount}`);

    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let detectedMatches: any[] = [];

    try {
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const processedImage = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng+fra'); // Anglais + Français
      
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // Mode bloc uniforme
        preserve_interword_spaces: '1',
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // --- LISTE NOIRE (Mots à bannir absolument) ---
      const BANNED_WORDS = [
        'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 
        'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december',
        'resume', 'chances', 'h2h', 'classement', 'tête', 'tete', 
        'matchs', 'points', 'sets', 'tableau', 'tournoi', 'cote',
        'bet365', 'unibet', 'winamax', 'betclic', '1xbet',
        'ligne', 'paiement', 'connexion', 'inscription', 'profil',
        'statistiques', 'notifications', 'favoris', 'football', 'basket'
      ];

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);

      for (const line of lines) {
        const lower = line.toLowerCase();

        // 1. FILTRE AGRESSIF : Si la ligne contient un mot banni, on la saute
        if (BANNED_WORDS.some(bad => lower.includes(bad))) {
            continue; 
        }

        // Nettoyage : On ne garde que lettres, chiffres, tirets, points
        const cleanLine = line.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s.-]/g, ' ').trim();

        // 2. DÉTECTION RANG (Ex: #12, ATP 55)
        const rankMatch = line.match(/(?:ATP|Rank|#)\s*[:.]?\s*(\d+)/i);
        if (rankMatch) {
            const rank = rankMatch[1];
            if (player1Rank === '?') player1Rank = rank;
            else if (player2Rank === '?' && rank !== player1Rank) player2Rank = rank;
            continue; // Si c'est un rang, ce n'est pas un nom
        }

        // 3. DÉTECTION MATCH (Date + Score)
        // Ex: 22.05. 6-4 6-2
        const hasScore = /(\d{1}-\d{1})/.test(line);
        const hasDate = /(\d{2}[./]\d{2})/.test(line); // JJ.MM ou JJ/MM

        if (hasScore && hasDate) {
             const score = line.match(/(\d{1}-\d{1}.*)/)?.[0] || '?-?';
             const date = line.match(/(\d{2}[./]\d{2})/)?.[0] || '';
             detectedMatches.push({ date, score, opponent: 'Adversaire', tournament: 'Tournoi' });
             continue; // Si c'est un match, ce n'est pas un nom
        }

        // 4. DÉTECTION NOM (Ce qu'il reste)
        // Un nom de joueur ne contient pas trop de chiffres
        const digitCount = (line.match(/\d/g) || []).length;
        
        // Un nom doit faire plus de 3 lettres, moins de 30, et ne pas être bourré de chiffres
        if (digitCount < 3 && cleanLine.length > 3 && cleanLine.length < 30) {
            if (!player1Name) {
                player1Name = cleanLine;
                console.log('✅ J1 Validé:', player1Name);
            } else if (!player2Name) {
                // Vérif anti-doublon (éviter J1 = J2)
                const similarity = cleanLine.includes(player1Name) || player1Name.includes(cleanLine);
                if (!similarity) {
                    player2Name = cleanLine;
                    console.log('✅ J2 Validé:', player2Name);
                }
            }
        }
      }

    } catch (e) {
      console.error('❌ Erreur:', e);
    }

    // --- CONSTRUCTION ---
    // Si l'OCR échoue totalement, on met des placeholders clairs
    const p1 = player1Name || (currentMatch ? currentMatch.player1.name : 'Inconnu A');
    const p2 = player2Name || (currentMatch ? currentMatch.player2.name : 'Inconnu B');

    return {
      identity: {
        p1Name: p1,
        p2Name: p2,
        tournament: 'Scan Flashscore',
        surface: 'Surface?',
        date: new Date().toLocaleDateString('fr-FR'),
        time: '12:00',
        round: '1er Tour'
      },
      p1: createPlayerData(p1, player1Rank, detectedMatches),
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
        form: matches.length > 0 ? '7/10' : '5/10',
        hand: 'Droitier',
        nationality: '?'
    };
    for (let i = 0; i < 20; i++) {
        if(i < matches.length) {
            data[`match${i+1}_date`] = matches[i].date;
            data[`match${i+1}_score`] = matches[i].score;
            data[`match${i+1}_opponent`] = matches[i].opponent;
        } else {
            data[`match${i+1}_date`] = '';
            data[`match${i+1}_score`] = '';
            data[`match${i+1}_opponent`] = '';
        }
    }
    return data;
}
