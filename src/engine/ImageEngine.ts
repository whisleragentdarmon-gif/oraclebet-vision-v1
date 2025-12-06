import { GodModeReportV2 } from './types';

// DICTIONNAIRE TENNIS
const TENNIS_DICT = {
  surfaces: {
    'dur': 'Hard', 'hard': 'Hard', 'duro': 'Hard',
    'terre': 'Clay', 'clay': 'Clay', 'battue': 'Clay',
    'herbe': 'Grass', 'grass': 'Grass', 'gazon': 'Grass',
    'indoor': 'Indoor', 'salle': 'Indoor'
  },
  
  rejectKeywords: [
    'resume', 'chances', 'support', 'uniquement', 'ligne',
    'formulaire', 'afficher', 'match', 'tournoi', 'h2h'
  ]
};

interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

interface TesseractModule {
  createWorker: () => Promise<TesseractWorker>;
}

let analysisCounter = 0;

const isValidPlayerName = (name: string): boolean => {
  if (!name || name.length < 4) return false;
  
  const words = name.split(' ').filter(w => w.length > 1);
  if (words.length < 2 || words.length > 4) return false;
  
  if (name === name.toUpperCase()) return false;
  
  const nameLower = name.toLowerCase();
  for (const keyword of TENNIS_DICT.rejectKeywords) {
    if (nameLower.includes(keyword)) return false;
  }
  
  if (/\d/.test(name)) return false;
  
  return true;
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCounter++;
    const timestamp = Date.now();
    
    console.log('==========================================');
    console.log(`📸 ANALYSE #${analysisCounter} - ${file.name}`);
    console.log('==========================================');
    
    await new Promise(r => setTimeout(r, 800));
    
    let detectedName1 = '';
    let detectedName2 = '';
    let detectedSurface: 'Hard' | 'Clay' | 'Grass' | 'Indoor' = 'Hard';
    
    try {
      console.log('🔄 OCR Tesseract...');
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const worker = await Tesseract.createWorker();
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      console.log('📝 OCR:', text.substring(0, 150));
      
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      
      const namesCandidates: string[] = [];
      
      for (const line of lines) {
        const cleaned = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
        if (cleaned && isValidPlayerName(cleaned)) {
          namesCandidates.push(cleaned);
        }
      }
      
      console.log(`🎾 ${namesCandidates.length} noms:`, namesCandidates.slice(0, 3));
      
      if (namesCandidates.length >= 2) {
        detectedName1 = namesCandidates[0];
        detectedName2 = namesCandidates[1];
        console.log('✅ Noms:', detectedName1, 'vs', detectedName2);
      }
      
      const textLower = text.toLowerCase();
      for (const [key, value] of Object.entries(TENNIS_DICT.surfaces)) {
        if (textLower.includes(key)) {
          detectedSurface = value as any;
          break;
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur OCR:', error);
    }
    
    const finalName1 = prompt(
      `Joueur 1: "${detectedName1 || 'Non détecté'}"\n\nValidez:`,
      detectedName1 || 'Joueur 1'
    );
    
    const finalName2 = prompt(
      `Joueur 2: "${detectedName2 || 'Non détecté'}"\n\nValidez:`,
      detectedName2 || 'Joueur 2'
    );
    
    const player1Name = finalName1?.trim() || `Player-${analysisCounter}-A`;
    const player2Name = finalName2?.trim() || `Player-${analysisCounter}-B`;
    
    console.log('✅ Noms:', player1Name, 'vs', player2Name);
    console.log('==========================================');
    
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: 'Tournoi',
        surface: detectedSurface,
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00',
        round: 'À déterminer'
      },
      p1: {
        rank: '?', bestRank: '?', ageHeight: '? / ?', nationality: '?',
        hand: 'Droitier', style: 'Équilibré', winrateCareer: '?',
        winrateSeason: '?', winrateSurface: '?', aces: '?',
        doubleFaults: '?', firstServe: '?', form: '?/10',
        injury: 'À vérifier', motivation: 'Normale', last5: '?'
      },
      p2: {
        rank: '?', bestRank: '?', ageHeight: '? / ?', nationality: '?',
        hand: 'Droitier', style: 'Équilibré', winrateCareer: '?',
        winrateSeason: '?', winrateSurface: '?', aces: '?',
        doubleFaults: '?', firstServe: '?', form: '?/10',
        injury: 'À vérifier', motivation: 'Normale', last5: '?'
      },
      h2h: {
        global: '? - ?', surface: '? - ?', advantage: 'Équilibré', lastMatches: 'À analyser'
      },
      conditions: {
        weather: 'Ensoleillé', temp: '24°C', wind: '10 km/h', altitude: 'Niveau mer', humidity: '60%'
      },
      bookmaker: {
        oddA: '1.95', oddB: '1.95', movement: 'STABLE'
      },
      synthesis: {
        tech: player1Name, mental: 'Équilibré', physical: player1Name,
        surface: 'Équilibré', momentum: player1Name, xFactor: 'À déterminer', risk: 'Moyen'
      },
      prediction: {
        probA: '50%', probB: '50%', probOver: '50%', probTieBreak: '40%',
        probUpset: '30%', risk: 'MODERATE', recoWinner: 'GOD MODE requis', recoOver: '?', recoSet: '?'
      }
    } as any;
  }
};
