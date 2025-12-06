import { GodModeReportV2 } from './types';

// Type pour Tesseract
interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

interface TesseractModule {
  createWorker: () => Promise<TesseractWorker>;
}

// Cache anti-contamination
let lastMatchId = '';
let analysisCount = 0;

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    const uniqueTimestamp = Date.now();
    
    console.log('===========================================');
    console.log(`📸 ANALYSE #${analysisCount}`);
    console.log(`⏰ Timestamp: ${uniqueTimestamp}`);
    console.log('===========================================');
    
    // Délai anti-spam
    await new Promise(r => setTimeout(r, 500));
    
    let player1Name = '';
    let player2Name = '';
    let isValid = false;
    
    try {
      console.log('🔄 Démarrage OCR Tesseract...');
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const worker = await Tesseract.createWorker();
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      console.log('📝 Texte OCR (100 premiers caractères):', text.substring(0, 100));
      
      // Extraire les noms
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      
      const potentialNames = lines.filter(line => {
        // Filtre basique : 2+ mots, pas de chiffres au début, longueur raisonnable
        const words = line.split(' ').filter(w => w.length > 1);
        return words.length >= 2 && 
               words.length <= 4 &&
               !/^\d/.test(line) && 
               line.length > 5 && 
               line.length < 35;
      });
      
      console.log(`🎾 ${potentialNames.length} noms potentiels:`, potentialNames.slice(0, 5));
      
      if (potentialNames.length >= 2) {
        const name1 = potentialNames[0].replace(/[^a-zA-Z\s.-]/g, '').trim();
        const name2 = potentialNames[1].replace(/[^a-zA-Z\s.-]/g, '').trim();
        
        // Validation basique
        const check1 = name1.length >= 4 && name1.split(' ').length >= 2;
        const check2 = name2.length >= 4 && name2.split(' ').length >= 2;
        
        if (check1 && check2) {
          player1Name = name1;
          player2Name = name2;
          isValid = true;
          console.log('✅ Noms détectés:', player1Name, 'vs', player2Name);
        } else {
          console.warn('⚠️ Noms invalides');
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur OCR:', error);
    }
    
    // POPUP DE VALIDATION (TOUJOURS)
    console.log('🔔 Affichage popup...');
    
    const confirmedName1 = prompt(
      `Joueur 1 détecté: "${player1Name || 'Non détecté'}"\n\nValidez ou modifiez:`,
      player1Name || 'Joueur 1'
    );
    
    const confirmedName2 = prompt(
      `Joueur 2 détecté: "${player2Name || 'Non détecté'}"\n\nValidez ou modifiez:`,
      player2Name || 'Joueur 2'  
    );
    
    player1Name = confirmedName1 && confirmedName1.trim() ? confirmedName1.trim() : `Joueur-${analysisCount}-A`;
    player2Name = confirmedName2 && confirmedName2.trim() ? confirmedName2.trim() : `Joueur-${analysisCount}-B`;
    
    console.log('✅ Noms finaux:', player1Name, 'vs', player2Name);
    
    // ID UNIQUE GARANTI
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newMatchId = `${player1Name.replace(/\s/g, '-')}-vs-${player2Name.replace(/\s/g, '-')}-${uniqueTimestamp}-${randomSuffix}`;
    
    // Vérification anti-doublon
    if (newMatchId === lastMatchId) {
      console.error('⚠️ Même ID détecté, ajout suffixe');
      lastMatchId = `${newMatchId}-retry`;
    } else {
      lastMatchId = newMatchId;
    }
    
    console.log('🆔 Match ID:', lastMatchId);
    console.log('===========================================');
    
    // RAPPORT VIERGE COMPLET
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: 'Tournoi',
        surface: 'Hard',
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
        winrateCareer: '?',
        winrateSeason: '?',
        winrateSurface: '?',
        aces: '?',
        doubleFaults: '?',
        firstServe: '?',
        form: '?/10',
        injury: 'À vérifier',
        motivation: 'Normale',
        last5: '?'
      },
      p2: {
        rank: '?',
        bestRank: '?',
        ageHeight: '? / ?',
        nationality: '?',
        hand: 'Droitier',
        style: 'Équilibré',
        winrateCareer: '?',
        winrateSeason: '?',
        winrateSurface: '?',
        aces: '?',
        doubleFaults: '?',
        firstServe: '?',
        form: '?/10',
        injury: 'À vérifier',
        motivation: 'Normale',
        last5: '?'
      },
      h2h: {
        global: '? - ?',
        surface: '? - ?',
        advantage: 'Équilibré',
        lastMatches: 'À analyser'
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
        xFactor: 'À déterminer',
        risk: 'Moyen'
      },
      prediction: {
        probA: '50%',
        probB: '50%',
        probOver: '50%',
        probTieBreak: '40%',
        probUpset: '30%',
        risk: 'MODERATE',
        recoWinner: 'À analyser avec GOD MODE',
        recoOver: '?',
        recoSet: '?'
      }
    } as any;
  }
};
