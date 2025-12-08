import { GodModeReportV2 } from './types';
import Tesseract from 'tesseract.js';

let analysisCount = 0;

// Fonction pour améliorer l'image avant lecture (Magie Noire pour l'OCR)
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(event.target?.result as string);

        // On agrandit l'image x2 pour aider Tesseract sur les petits textes
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);

        // Augmenter le contraste et passer en N&B
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Seuil de binarisation (Noir ou Blanc)
          const color = avg > 140 ? 255 : 0; 
          data[i] = color;     // R
          data[i + 1] = color; // G
          data[i + 2] = color; // B
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    console.log(`🔧 ANALYSE FLASHSCORE #${analysisCount} - DÉMARRAGE`);

    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let detectedMatches: any[] = [];

    try {
      // 1. Pré-traitement de l'image (Essentiel pour Flashscore)
      console.log('🎨 Amélioration de l\'image...');
      const processedImage = await preprocessImage(file);

      // 2. OCR avec configuration pour le français et l'anglais
      console.log('🔄 Lecture OCR en cours...');
      const worker = await Tesseract.createWorker('eng+fra'); // Charge les 2 langues
      
      // Paramètres optimisés pour la lecture de tableaux
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:.()/% ',
        preserve_interword_spaces: '1',
      });

      const { data: { text } } = await worker.recognize(processedImage);
      await worker.terminate();

      // 3. Nettoyage intelligent du texte
      // On découpe par ligne et on retire les lignes vides ou trop courtes
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3);

      console.log('📝 Lignes extraites:', lines.length);

      // --- LOGIQUE D'EXTRACTION AMÉLIORÉE ---

      for (const line of lines) {
        const lower = line.toLowerCase();

        // A. Chercher les Rangs (ATP 123, #123, Rank 123)
        const rankMatch = line.match(/(?:ATP|WTA|Rank|#)\s*[:.-]?\s*(\d+)/i);
        if (rankMatch) {
            const r = rankMatch[1];
            if (player1Rank === '?') player1Rank = r;
            else if (player2Rank === '?') player2Rank = r;
        }

        // B. Chercher les Noms
        // On ignore les lignes qui contiennent des mots clés "système" ou des dates
        const isDate = /\d{2}[./-]\d{2}/.test(line);
        const isSystem = ['résumé', 'tête à tête', 'classement', 'matchs', 'cote', 'bet365'].some(k => lower.includes(k));
        
        // Regex autorisant les accents français (ex: Humbert, Müller)
        const cleanName = line.replace(/[^a-zA-Z\u00C0-\u00FF\s.-]/g, '').trim();

        if (!isDate && !isSystem && cleanName.length > 3 && cleanName.length < 25) {
            // Si la ligne ne contient pas trop de chiffres (ce n'est pas un score)
            const digitCount = (line.match(/\d/g) || []).length;
            if (digitCount < 3) {
                if (!player1Name) {
                    player1Name = cleanName;
                    console.log('✅ J1 Détecté:', player1Name);
                } else if (!player2Name && cleanName !== player1Name) {
                    player2Name = cleanName;
                    console.log('✅ J2 Détecté:', player2Name);
                }
            }
        }

        // C. Chercher les matchs (Date + Score)
        // Format typique: "12.05. 10:00 Nadal R. - Djokovic N. 2-0"
        if (line.match(/\d{2}\.\d{2}\./)) {
             detectedMatches.push({
                 raw: line,
                 date: line.substring(0, 6),
                 score: line.match(/\d-\d/) ? line.match(/\d-\d/)![0] : '?-?'
             });
        }
      }

    } catch (error) {
      console.error('❌ Erreur Critique OCR:', error);
      alert('Erreur de lecture. Essayez une image plus nette.');
    }

    // Fallback si rien trouvé (évite de tout casser)
    if (!player1Name) player1Name = `Inconnu A (${analysisCount})`;
    if (!player2Name) player2Name = `Inconnu B (${analysisCount})`;

    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: 'Analyse Screenshot',
        surface: 'Surface?',
        date: new Date().toLocaleDateString('fr-FR'),
        time: '12:00',
      },
      p1: createPlayerData(player1Name, player1Rank, detectedMatches),
      p2: createPlayerData(player2Name, player2Rank, []), // Répartition basique
      h2h: { global: '? - ?' },
      conditions: { weather: '?', temp: '?' },
      prediction: { probA: '50%', probB: '50%', risk: 'HIGH', recoWinner: 'Analyse requise' }
    } as any;
  }
};

// Helper inchangé mais sécurisé
function createPlayerData(name: string, rank: string, matches: any[]) {
    const data: any = { rank, name, form: '5/10' };
    matches.forEach((m, i) => {
        if(i < 5) {
            data[`match${i+1}_date`] = m.date;
            data[`match${i+1}_score`] = m.score;
            data[`match${i+1}_opponent`] = '?'; 
        }
    });
    return data;
}
