import { GodModeReportV2 } from './types';

// Interfaces pour éviter les erreurs TypeScript
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
  setParameters: (params: any) => Promise<void>;
}

interface TesseractModule {
  createWorker: (langs?: string) => Promise<TesseractWorker>;
}

let analysisCount = 0;

// --- 1. PRÉ-TRAITEMENT D'IMAGE (LA CLÉ POUR BIEN LIRE LES NOMS) ---
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(event.target?.result as string);

        // On agrandit l'image x2.5 (Crucial pour les petits textes de Flashscore)
        canvas.width = img.width * 2.5;
        canvas.height = img.height * 2.5;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Filtre "Binarisation" : Tout ce qui n'est pas presque blanc devient noir
        // Cela efface le fond gris/bleu des sites de scores
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Seuil ajusté : < 150 devient noir (texte), > 150 devient blanc (fond)
          const color = avg < 150 ? 0 : 255; 
          data[i] = color;     // R
          data[i + 1] = color; // G
          data[i + 2] = color; // B
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
    console.log(`🔧 SCAN #${analysisCount} (Mode Local - Gratuit)`);

    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let detectedMatches: any[] = [];

    try {
      // Import dynamique de Tesseract (évite les bugs de build)
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      
      // On prépare l'image
      const processedImage = await preprocessImage(file);
      
      // On crée le worker
      const worker = await Tesseract.createWorker('eng+fra'); // Anglais + Français
      
      // Configuration pour forcer la lecture ligne par ligne
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // Mode "Bloc de texte uniforme" (Meilleur pour les tableaux)
        preserve_interword_spaces: '1',
      } as any);

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      console.log('📝 Texte lu brut:', text.substring(0, 100) + '...');

      // --- ANALYSE INTELLIGENTE ---
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (const line of lines) {
        // Nettoyage de la ligne (On garde lettres, accents, chiffres, tirets)
        // Ex: "Djokovic N. (Srb)" -> "Djokovic N Srb"
        const cleanLine = line.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s.-]/g, ' ').trim();
        const lower = cleanLine.toLowerCase();

        // 1. DÉTECTION DES RANGS (Ex: "#12", "ATP 4")
        // On cherche un motif "ATP" ou "#" suivi d'un nombre
        const rankMatch = line.match(/(?:ATP|Rank|#)\s*[:.]?\s*(\d+)/i);
        if (rankMatch) {
            const rank = rankMatch[1];
            if (player1Rank === '?') player1Rank = rank;
            else if (player2Rank === '?' && rank !== player1Rank) player2Rank = rank;
        }

        // 2. DÉTECTION DES MATCHS (Ex: "12.05. 6-4 6-2")
        // On cherche un score de tennis (X-Y)
        const scoreMatch = line.match(/(\d{1}-\d{1}.*\d{1}-\d{1}|\d{1}-\d{1})/);
        const dateMatch = line.match(/\d{2}[./]\d{2}/); // JJ.MM ou JJ/MM

        if (dateMatch && scoreMatch) {
             // C'est une ligne de match !
             detectedMatches.push({
                 date: dateMatch[0],
                 score: scoreMatch[0],
                 opponent: 'Adversaire', // Difficile à extraire sans contexte
                 tournament: 'Tournoi'
             });
        }
        // 3. DÉTECTION DES NOMS (Le plus dur)
        else {
            // Si la ligne n'est PAS un match, PAS un mot système, et a une bonne longueur
            const isSystem = ['match', 'tournoi', 'score', 'resume', 'h2h', 'bet', 'cote'].some(k => lower.includes(k));
            const hasTooManyNumbers = (line.match(/\d/g) || []).length > 2;

            if (!isSystem && !hasTooManyNumbers && cleanLine.length > 3 && cleanLine.length < 25) {
                // On suppose que c'est un nom
                if (!player1Name) {
                    player1Name = cleanLine;
                    console.log('✅ J1 trouvé:', player1Name);
                } else if (!player2Name && !cleanLine.includes(player1Name)) {
                    // Vérification simple pour ne pas prendre le même nom ou une variante
                    const ratio = Math.abs(cleanLine.length - player1Name.length);
                    if (ratio > 2 || cleanLine[0] !== player1Name[0]) {
                        player2Name = cleanLine;
                        console.log('✅ J2 trouvé:', player2Name);
                    }
                }
            }
        }
      }

    } catch (e) {
      console.error('❌ Erreur Tesseract:', e);
    }

    // --- CONSTRUCTION DU RESULTAT ---
    const p1 = player1Name || (currentMatch ? currentMatch.player1.name : 'Joueur A');
    const p2 = player2Name || (currentMatch ? currentMatch.player2.name : 'Joueur B');

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

// Helper inchangé
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
