import { GodModeReportV2 } from './types';

// --- INTERFACES POUR TESSERACT (Pour éviter les erreurs TypeScript) ---
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
  setParameters: (params: any) => Promise<void>;
}

interface TesseractModule {
  createWorker: (langs?: string) => Promise<TesseractWorker>;
}

let analysisCount = 0;

// --- FONCTION MAGIQUE : PRÉ-TRAITEMENT DE L'IMAGE ---
// Transforme l'image en Noir & Blanc haute définition pour aider l'IA
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                // Fallback si canvas non supporté
                return resolve(event.target?.result as string);
            }

            // On agrandit l'image x2 pour mieux lire les petits textes
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            
            // Lissage pour l'agrandissement
            ctx.imageSmoothingEnabled = false;
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);

            // Algorithme de binarisation (Noir et Blanc)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // On parcourt chaque pixel
            for (let i = 0; i < data.length; i += 4) {
              // Moyenne RGB
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              // Contraste extrême : Si c'est un peu gris, ça devient blanc, sinon noir.
              // Le seuil 160 est optimisé pour les captures d'écran type Flashscore clair
              const color = avg > 160 ? 255 : 0; 
              
              data[i] = color;     // Red
              data[i + 1] = color; // Green
              data[i + 2] = color; // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (e) {
            // En cas d'erreur de traitement d'image, on renvoie l'originale
            console.warn("Erreur preprocessing image, utilisation original", e);
            resolve(event.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    
    console.log('==========================================');
    console.log(`🔧 ANALYSE IMAGE #${analysisCount}`);
    console.log('==========================================');
    
    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let detectedMatches: any[] = [];
    
    // Valeurs par défaut pour éviter le crash
    let extractedTextLength = 0;

    try {
      console.log('🔄 Chargement dynamique de Tesseract...');
      // Import dynamique pour éviter les erreurs "window not defined" au build
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      
      console.log('🎨 Pré-traitement de l\'image (Canvas)...');
      const processedImage = await preprocessImage(file);
      
      console.log('🧠 Création du Worker OCR...');
      // On charge les modèles anglais et français
      const worker = await Tesseract.createWorker('eng+fra');
      
      // Configuration fine pour ne lire que ce qui nous intéresse
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:.()/éèàê% ',
        preserve_interword_spaces: '1',
      });
      
      console.log('📸 Reconnaissance du texte...');
      const { data: { text } } = await worker.recognize(processedImage);
      
      extractedTextLength = text.length;
      console.log('📝 Texte brut extrait:', extractedTextLength, 'caractères');
      
      await worker.terminate();
      
      // --- ANALYSE SÉMANTIQUE ---
      
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      
      for (const line of lines) {
        const lower = line.toLowerCase();
        
        // 1. Détection des Rangs (ex: "ATP 45", "# 12", "Rank: 10")
        const rankMatch = line.match(/(?:ATP|WTA|Rank|#)\s*[:.-]?\s*(\d+)/i);
        if (rankMatch) {
          const rank = rankMatch[1];
          if (player1Rank === '?') {
             player1Rank = rank;
             console.log('   🏆 Rang J1 trouvé:', rank);
          } else if (player2Rank === '?' && rank !== player1Rank) {
             player2Rank = rank;
             console.log('   🏆 Rang J2 trouvé:', rank);
          }
        }

        // 2. Détection des Noms
        // On exclut les lignes qui ressemblent à des dates, des scores ou des mots système
        const isDateOrScore = /\d/.test(line) && (line.match(/\d/g) || []).length > 2;
        const isSystemWord = ['resume', 'chances', 'match', 'tournoi', 'stat', 'profil', 'score', 'bet365', 'unibet'].some(k => lower.includes(k));
        
        // Nettoyage : On garde lettres, espaces, tirets et points
        const cleanLine = line.replace(/[^a-zA-Z\u00C0-\u00FF\s.-]/g, '').trim();
        
        if (!isDateOrScore && !isSystemWord && cleanLine.length > 3 && cleanLine.length < 30) {
            if (!player1Name) {
                player1Name = cleanLine;
                console.log('   👤 Nom J1 candidat:', player1Name);
            } else if (!player2Name && Math.abs(cleanLine.length - player1Name.length) > 1 && !cleanLine.includes(player1Name)) {
                // On vérifie que c'est bien un nom différent
                player2Name = cleanLine;
                console.log('   👤 Nom J2 candidat:', player2Name);
            }
        }
        
        // 3. Détection des Matchs (Date + Score)
        // Format supporté : "12.05." ou "12.05" suivi plus loin d'un score "6-4"
        if (/\d{2}\.\d{2}/.test(line) || /\d{2}\/\d{2}/.test(line)) {
            const hasScore = /(\d{1,2}-\d{1,2})/.test(line);
            if (hasScore) {
                const scoreMatch = line.match(/(\d{1,2}-\d{1,2}.*)/);
                detectedMatches.push({
                    date: line.substring(0, 6).replace(/[^\d.]/g, ''),
                    score: scoreMatch ? scoreMatch[0] : '?-?',
                    opponent: 'Adversaire', // Difficile à extraire précisément sur une seule ligne
                    tournament: 'Tournoi'
                });
            }
        }
      }
      
    } catch (error) {
      console.error('❌ ERREUR CRITIQUE IMAGE ENGINE:', error);
    }
    
    // --- CONSTRUCTION DU RAPPORT FINAL ---
    
    // Fallback si l'OCR a échoué
    const p1FinalName = player1Name || (currentMatch ? currentMatch.player1.name : `Joueur A`);
    const p2FinalName = player2Name || (currentMatch ? currentMatch.player2.name : `Joueur B`);
    
    console.log('📊 RÉSULTAT FINAL:');
    console.log(`   J1: ${p1FinalName} (#${player1Rank})`);
    console.log(`   J2: ${p2FinalName} (#${player2Rank})`);
    
    return {
      identity: {
        p1Name: p1FinalName,
        p2Name: p2FinalName,
        tournament: 'Analyse Image',
        surface: 'Dur', // Valeur par défaut
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
        round: '1er Tour'
      },
      p1: createPlayerData(p1FinalName, player1Rank, detectedMatches),
      p2: createPlayerData(p2FinalName, player2Rank, []),
      h2h: { 
          global: '? - ?', 
          surface: '? - ?', 
          advantage: 'Équilibré', 
          lastMatches: 'Données image insuffisantes' 
      },
      conditions: { 
          weather: 'Non détecté', 
          temp: '20°C', 
          wind: '0 km/h', 
          altitude: '-', 
          humidity: '-' 
      },
      bookmaker: { 
          oddA: '1.90', 
          oddB: '1.90', 
          movement: 'STABLE' 
      },
      synthesis: { 
          tech: p1FinalName, 
          mental: 'Équilibré', 
          physical: 'Équilibré', 
          surface: 'Équilibré', 
          momentum: 'Équilibré', 
          xFactor: 'Aucun', 
          risk: 'HIGH' 
      },
      prediction: { 
          probA: '50%', 
          probB: '50%', 
          probOver: '50%', 
          probTieBreak: '30%', 
          probUpset: '20%', 
          risk: 'HIGH', 
          recoWinner: 'Analyse humaine requise', 
          recoOver: 'NO BET', 
          recoSet: 'NO BET' 
      }
    } as any;
  }
};

// Helper pour formater les données joueurs
function createPlayerData(name: string, rank: string, matches: any[]) {
  const data: any = {
    rank: rank !== '?' ? rank : '100+',
    bestRank: rank !== '?' ? rank : '?',
    ageHeight: '? / ?',
    nationality: '?',
    hand: 'Droitier',
    style: 'Polyvalent',
    winrateCareer: '50%',
    winrateSeason: '50%',
    winrateSurface: '50%',
    aces: '5.0',
    doubleFaults: '3.0',
    firstServe: '60%',
    form: matches.length > 0 ? '7/10' : '5/10',
    injury: 'Rien',
    motivation: 'Normale',
    last5: '?',
    tournamentRank: '-',
    oddsPlayer: '1.90'
  };
  
  // Remplissage des matchs détectés
  for (let i = 0; i < 20; i++) {
    if (i < matches.length) {
      data[`match${i+1}_date`] = matches[i].date;
      data[`match${i+1}_opponent`] = matches[i].opponent;
      data[`match${i+1}_score`] = matches[i].score;
      data[`match${i+1}_tournament`] = matches[i].tournament;
    } else {
      data[`match${i+1}_date`] = '';
      data[`match${i+1}_opponent`] = '';
      data[`match${i+1}_score`] = '';
      data[`match${i+1}_tournament`] = '';
    }
  }
  
  return data;
}
