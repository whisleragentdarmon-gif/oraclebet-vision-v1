import { GodModeReportV2 } from './types';

// Type pour Tesseract (évite les erreurs TypeScript)
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

interface TesseractModule {
  createWorker: (lang?: string) => Promise<TesseractWorker>;
}

// ✅ SÉCURITÉ : Cache de protection contre réutilisation
let lastAnalysisTimestamp = 0;
let lastMatchId = '';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    // ✅ SÉCURITÉ 1 : Empêcher analyses trop rapprochées (contamination)
    const now = Date.now();
    const analyseNumber = lastAnalysisTimestamp === 0 ? 1 : Math.floor((now - lastAnalysisTimestamp) / 1000);
    
    console.log('===========================================');
    console.log(`📸 ANALYSE #${analyseNumber} - ${file.name}`);
    
    if (now - lastAnalysisTimestamp < 1000) {
      console.warn('⚠️ Analyse trop rapide, attente de 1 seconde...');
      await new Promise(r => setTimeout(r, 1000));
    }
    
    let player1Name = '';
    let player2Name = '';
    let tournament = '';
    let surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor' = 'Hard';
    let needsManualInput = false;
    
    try {
      // ✅ CRÉER UN WORKER COMPLÈTEMENT NEUF à chaque fois
      console.log('🔄 Création d\'un NOUVEAU worker Tesseract...');
      // @ts-ignore
      const Tesseract = await import('tesseract.js');
      // On force l'anglais car il reconnait mieux les caractères universels sans accents bizarres
      const worker = await Tesseract.createWorker('eng'); 
      console.log('✅ Worker créé avec succès');
      
      // Reconnaissance du texte
      console.log('🔍 Démarrage OCR...');
      const { data: { text } } = await worker.recognize(file);
      
      // 🧹 NETTOYAGE IMMÉDIAT DU WORKER (Libère la mémoire)
      await worker.terminate();

      console.log('📝 TEXTE BRUT DÉTECTÉ (Extrait):', text.substring(0, 100) + '...');
      
      // --- 🛡️ LE FILTRE ANTI-BRUIT (C'est ici que j'ai modifié) ---
      // On définit une liste noire de mots qui ne PEUVENT PAS être des noms de joueurs
      const noiseRegex = /Pari|Cote|Bet|Win|Score|Match|Set|Jeu|Point|Total|Gratuit|Paiement|Ligne|Resume|Support|Unique|Afficher|Formulaire|Connexion|Inscription|Prono|Analyse/i;

      // Parser les lignes
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3) // On vire les trucs trop courts
        .filter(l => !noiseRegex.test(l)); // On vire le bruit des sites de paris

      console.log(`📊 ${lines.length} lignes pertinentes conservées`);
      
      // Chercher les noms (lignes avec 2+ mots, pas de chiffres au début)
      const potentialNames = lines.filter(line => {
        const words = line.split(' ').filter(w => w.length > 1);
        return words.length >= 2 && 
               !/^\d/.test(line) && // Pas de chiffre au début
               line.length > 4 && 
               line.length < 40 &&
               !line.includes('%') && // Pas de stat %
               !/vs|versus|@/i.test(line);
      });
      
      console.log(`🎾 Noms potentiels trouvés:`, potentialNames);
      
      if (potentialNames.length >= 2) {
        // Nettoyage final des caractères spéciaux
        const name1 = potentialNames[0].replace(/[^a-zA-Z\s.-]/g, '').trim();
        const name2 = potentialNames[1].replace(/[^a-zA-Z\s.-]/g, '').trim();
        
        // ✅ VALIDATION STRICTE (Ton code original)
        const isValidName = (name: string) => {
          if (name.length < 3) return false;
          const words = name.split(' ').filter(w => w.length > 0);
          if (words.length < 2) return false;
          // Rejet si tout en majuscules (souvent des titres)
          if (name === name.toUpperCase() && name.length > 10) return false;
          return true;
        };
        
        const valid1 = isValidName(name1);
        const valid2 = isValidName(name2);
        
        if (valid1 && valid2) {
          player1Name = name1;
          player2Name = name2;
          console.log('🎉 Noms validés :', player1Name, 'vs', player2Name);
        } else {
          console.warn('⚠️ Noms détectés mais invalides (trop courts ou bruit).');
          needsManualInput = true;
        }
      } else {
        console.warn(`⚠️ Pas assez de noms détectés (${potentialNames.length}/2)`);
        needsManualInput = true;
      }
      
      // Détecter le tournoi (Ton code original)
      const tournamentPatterns = [
        'Australian Open', 'Roland Garros', 'Wimbledon', 'US Open',
        'Dubai', 'Miami', 'Madrid', 'Rome', 'Monte Carlo', 
        'Indian Wells', 'Cincinnati', 'Paris', 'ATP Finals', 'Challenger', 'ITF'
      ];
      
      for (const pattern of tournamentPatterns) {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
          tournament = pattern;
          break;
        }
      }
      
      // Détecter la surface (Ton code original)
      const textLower = text.toLowerCase();
      if (textLower.includes('clay') || textLower.includes('argile') || textLower.includes('terre')) {
        surface = 'Clay';
      } else if (textLower.includes('grass') || textLower.includes('herbe') || textLower.includes('gazon')) {
        surface = 'Grass';
      } else if (textLower.includes('indoor')) {
        surface = 'Indoor';
      }
      
    } catch (error) {
      console.error('❌ ERREUR OCR:', error);
      needsManualInput = true;
    }
    
    // ✅ POPUP DE CONFIRMATION (Indispensable pour corriger les erreurs OCR)
    const detectedName1 = player1Name || 'Non détecté';
    const detectedName2 = player2Name || 'Non détecté';
    
    const confirmedName1 = prompt(
      `✅ Joueur 1 détecté : "${detectedName1}"\n\nAppuyez sur OK pour valider, ou modifiez :`, 
      detectedName1 !== 'Non détecté' ? detectedName1 : ''
    );
    
    const confirmedName2 = prompt(
      `✅ Joueur 2 détecté : "${detectedName2}"\n\nAppuyez sur OK pour valider, ou modifiez :`, 
      detectedName2 !== 'Non détecté' ? detectedName2 : ''
    );
    
    player1Name = confirmedName1 && confirmedName1.trim() ? confirmedName1.trim() : (currentMatch?.player1?.name || 'Joueur 1');
    player2Name = confirmedName2 && confirmedName2.trim() ? confirmedName2.trim() : (currentMatch?.player2?.name || 'Joueur 2');
    
    // ID Unique
    const uniqueTimestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const matchId = `screenshot-${player1Name.replace(/\s/g, '-')}-vs-${player2Name.replace(/\s/g, '-')}-${uniqueTimestamp}-${randomSuffix}`;
    
    lastMatchId = matchId;
    lastAnalysisTimestamp = uniqueTimestamp;
    
    // --- TES FONCTIONS DE GÉNÉRATION DE DONNÉES (Je les ai gardées !) ---
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
    
    // Retourner le rapport complet
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: tournament || (currentMatch?.tournament || 'Tournoi'),
        surface: surface,
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00',
        round: 'À déterminer',
        matchId: lastMatchId
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
    } as unknown as GodModeReportV2;
  }
};
