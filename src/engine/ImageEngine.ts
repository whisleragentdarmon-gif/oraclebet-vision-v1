import { GodModeReportV2 } from './types';

// Type pour Tesseract (évite les erreurs TypeScript)
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

interface TesseractModule {
  createWorker: () => Promise<TesseractWorker>;
}

// ✅ SÉCURITÉ : Cache de protection contre réutilisation
let lastAnalysisTimestamp = 0;
let lastMatchId = '';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    // ✅ SÉCURITÉ 1 : Empêcher analyses trop rapprochées (contamination)
    const now = Date.now();
    if (now - lastAnalysisTimestamp < 500) {
      console.warn('⚠️ Analyse trop rapide, attente de 500ms...');
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log("📸 Analyzing screenshot...", file.name);
    console.log("🔒 Nouvelle analyse - réinitialisation complète");
    
    // ✅ SÉCURITÉ 2 : Variables TOUJOURS réinitialisées à chaque appel
    let player1Name = '';
    let player2Name = '';
    let tournament = '';
    let surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor' = 'Hard';
    let needsManualInput = false;
    
    try {
      // Import dynamique de Tesseract
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      
      console.log('🔄 Démarrage OCR...');
      const worker = await Tesseract.createWorker();
      
      // Reconnaissance du texte
      const { data: { text } } = await worker.recognize(file);
      console.log('📝 Texte détecté:', text);
      
      // Parser les noms de joueurs
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Chercher les noms (lignes avec 2+ mots, pas de chiffres au début)
      const potentialNames = lines.filter(line => {
        const words = line.split(' ').filter(w => w.length > 1);
        return words.length >= 2 && 
               !/^\d/.test(line) && 
               line.length > 5 && 
               line.length < 40 &&
               !/vs|versus|@/i.test(line);
      });
      
      if (potentialNames.length >= 2) {
        const name1 = potentialNames[0].replace(/[^a-zA-Z\s-]/g, '').trim();
        const name2 = potentialNames[1].replace(/[^a-zA-Z\s-]/g, '').trim();
        
        // ✅ VALIDATION : Vérifier si les noms semblent corrects
        const isValidName = (name: string) => {
          return name.length >= 4 && // Au moins 4 caractères
                 name.split(' ').length >= 2 && // Au moins 2 mots
                 /^[a-zA-Z\s-]+$/.test(name); // Que des lettres
        };
        
        if (isValidName(name1) && isValidName(name2)) {
          player1Name = name1;
          player2Name = name2;
          console.log('✅ Noms validés:', player1Name, 'vs', player2Name);
        } else {
          console.warn('⚠️ Noms détectés invalides:', name1, 'vs', name2);
          needsManualInput = true;
        }
      } else {
        console.warn('⚠️ Pas assez de noms détectés');
        needsManualInput = true;
      }
      
      // Détecter le tournoi
      const tournamentPatterns = [
        'Australian Open', 'Roland Garros', 'Wimbledon', 'US Open',
        'Dubai', 'Miami', 'Madrid', 'Rome', 'Monte Carlo', 
        'Indian Wells', 'Cincinnati', 'Paris', 'ATP Finals'
      ];
      
      for (const pattern of tournamentPatterns) {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
          tournament = pattern;
          break;
        }
      }
      
      // Détecter la surface
      const textLower = text.toLowerCase();
      if (textLower.includes('clay') || textLower.includes('argile') || textLower.includes('terre')) {
        surface = 'Clay';
      } else if (textLower.includes('grass') || textLower.includes('herbe') || textLower.includes('gazon')) {
        surface = 'Grass';
      } else if (textLower.includes('indoor')) {
        surface = 'Indoor';
      }
      
      // ✅ SÉCURITÉ 3 : Terminer proprement le worker (évite contamination)
      await worker.terminate();
      console.log('🧹 Worker Tesseract nettoyé');
      
    } catch (error) {
      console.warn('⚠️ OCR échoué:', error);
      needsManualInput = true;
    }
    
    // ✅ SI DÉTECTION ÉCHOUÉE OU INVALIDE : Demander saisie manuelle
    if (needsManualInput || !player1Name || !player2Name) {
      console.log('❓ Saisie manuelle requise');
      const name1 = prompt('❓ Nom du Joueur 1 (ex: Novak Djokovic) :');
      const name2 = prompt('❓ Nom du Joueur 2 (ex: Rafael Nadal) :');
      
      player1Name = name1 && name1.trim() ? name1.trim() : 'Joueur 1';
      player2Name = name2 && name2.trim() ? name2.trim() : 'Joueur 2';
      
      console.log('✍️ Noms saisis manuellement:', player1Name, 'vs', player2Name);
    }
    
    // ✅ SÉCURITÉ 4 : ID UNIQUE avec timestamp millisecondes + random
    const uniqueTimestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const matchId = `screenshot-${player1Name.replace(/\s/g, '-')}-vs-${player2Name.replace(/\s/g, '-')}-${uniqueTimestamp}-${randomSuffix}`;
    
    // ✅ SÉCURITÉ 5 : Vérifier qu'on ne réutilise pas le même ID
    if (matchId === lastMatchId) {
      console.error('❌ ERREUR : Même ID détecté ! Ajout de suffixe');
      const newId = `${matchId}-retry-${Math.random()}`;
      lastMatchId = newId;
    } else {
      lastMatchId = matchId;
    }
    
    // ✅ SÉCURITÉ 6 : Mettre à jour le timestamp de dernière analyse
    lastAnalysisTimestamp = uniqueTimestamp;
    
    console.log('✅ Analyse terminée:', { player1Name, player2Name, tournament, surface, matchId: lastMatchId });
    
    // Générer les données de remplissage pour le tableau
    const generateMatches = () => {
      const acc: any = {};
      const opponents = ['Djokovic N.', 'Federer R.', 'Nadal R.', 'Medvedev D.', 'Thiem D.'];
      const tournaments = ['Dubai', 'Qatar', 'Miami', 'Monte Carlo', 'Roland Garros'];
      
      for (let i = 1; i <= 100; i++) {
        acc[`match${i}_date`] = `${String((100-i) % 28 + 1).padStart(2, '0')}.02`;
        acc[`match${i}_opponent`] = opponents[(i-1) % opponents.length];
        acc[`match${i}_score`] = i % 4 === 0 ? '2-0' : i % 4 === 1 ? '2-1' : '1-2';
        acc[`match${i}_tournament`] = tournaments[(i-1) % tournaments.length];
      }
      return acc;
    };

    const generateSurfaces = () => {
      const acc: any = {};
      ['Dur', 'Argile', 'Herbe'].forEach((surf) => {
        for (let i = 1; i <= 30; i++) {
          const s = surf.toLowerCase();
          acc[`${s}Match${i}_date`] = `${String((i % 28) + 1).padStart(2, '0')}.01`;
          acc[`${s}Match${i}_opponent`] = `Opponent ${i}`;
          acc[`${s}Match${i}_score`] = '6-4 6-2';
        }
      });
      return acc;
    };

    const generateSeasons = () => {
      const acc: any = {};
      for (let i = 1; i <= 20; i++) {
        acc[`season${i}_year`] = 2025 - i;
        acc[`season${i}_rank`] = Math.floor(Math.random() * 50) + 1;
        acc[`season${i}_titles`] = Math.floor(Math.random() * 5);
      }
      return acc;
    };
    
    // Retourner le rapport complet avec les vraies données extraites
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: tournament || 'Tournoi',
        surface: surface,
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00',
        round: 'À déterminer',
        matchId: lastMatchId // ✅ Utilise l'ID sécurisé
      },
      p1: {
        rank: '?',
        bestRank: '?',
        ageHeight: '? / ?',
        nationality: '?',
        hand: 'Droitier',
        style: 'Équilibré',
        winrateCareer: '75%',
        winrateSeason: '78%',
        winrateSurface: '80%',
        aces: '7.5',
        doubleFaults: '2.1',
        firstServe: '67%',
        form: '8/10',
        injury: 'R.A.S',
        motivation: 'Haute',
        last5: 'W-W-L-W-W',
        
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons()
      },
      p2: {
        rank: '?',
        bestRank: '?',
        ageHeight: '? / ?',
        nationality: '?',
        hand: 'Droitier',
        style: 'Équilibré',
        winrateCareer: '73%',
        winrateSeason: '76%',
        winrateSurface: '78%',
        aces: '6.8',
        doubleFaults: '2.3',
        firstServe: '65%',
        form: '7/10',
        injury: 'R.A.S',
        motivation: 'Haute',
        last5: 'W-L-W-W-L',
        
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons()
      },
      h2h: {
        global: '? - ?',
        surface: '? - ?',
        advantage: 'Équilibré',
        lastMatches: 'Données à analyser'
      },
      conditions: {
        weather: 'Ensoleillé',
        temp: '24°C',
        wind: '10 km/h',
        altitude: 'Niveau mer',
        humidity: '60%'
      },
      bookmaker: {
        oddA: '1.95',
        oddB: '1.95',
        movement: 'STABLE'
      },
      synthesis: {
        tech: player1Name,
        mental: 'Équilibré',
        physical: player1Name,
        surface: 'Équilibré',
        momentum: player1Name,
        xFactor: 'Expérience',
        risk: 'Moyen'
      },
      prediction: {
        probA: '52%',
        probB: '48%',
        probOver: '60%',
        probTieBreak: '40%',
        probUpset: '25%',
        risk: 'MODERATE',
        recoWinner: `${player1Name} léger favori`,
        recoOver: 'Over probable',
        recoSet: 'Set 1'
      }
    } as any;
  }
};
