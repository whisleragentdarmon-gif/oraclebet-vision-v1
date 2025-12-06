import { GodModeReportV2 } from './types';

interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}

interface TesseractModule {
  createWorker: () => Promise<TesseractWorker>;
}

let analysisCount = 0;

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    analysisCount++;
    
    console.log('==========================================');
    console.log(`🔧 ANALYSE FLASHSCORE #${analysisCount}`);
    console.log('==========================================');
    
    await new Promise(r => setTimeout(r, 500));
    
    let player1Name = '';
    let player2Name = '';
    let player1Rank = '?';
    let player2Rank = '?';
    let player1Matches: any[] = [];
    let player2Matches: any[] = [];
    
    try {
      console.log('🔄 OCR Tesseract...');
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const worker = await Tesseract.createWorker();
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      console.log('📝 Texte OCR:', text.length, 'caractères');
      
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // EXTRACTION NOMS
      console.log('👤 Extraction noms...');
      for (const line of lines) {
        const words = line.split(' ').filter(w => w.length > 1);
        if (words.length >= 2 && words.length <= 4 && !/^\d/.test(line)) {
          const cleaned = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
          const lower = cleaned.toLowerCase();
          const keywords = ['resume', 'chances', 'support', 'uniquement', 'profil', 'stats', 'match', 'tournoi'];
          
          if (cleaned.length > 4 && !keywords.some(k => lower.includes(k))) {
            if (!player1Name) {
              player1Name = cleaned;
              console.log('  ✅ J1:', player1Name);
            } else if (!player2Name && cleaned !== player1Name) {
              player2Name = cleaned;
              console.log('  ✅ J2:', player2Name);
              break;
            }
          }
        }
      }
      
      // EXTRACTION CLASSEMENTS
      console.log('🏆 Extraction classements...');
      for (const line of lines) {
        const rankMatch = line.match(/(?:ATP|WTA|Rank|#)[-:\s]*(\d+)/i);
        if (rankMatch) {
          const rank = rankMatch[1];
          if (player1Rank === '?') {
            player1Rank = rank;
            console.log('  ✅ Rang J1:', rank);
          } else if (player2Rank === '?') {
            player2Rank = rank;
            console.log('  ✅ Rang J2:', rank);
          }
        }
      }
      
      // EXTRACTION MATCHS
      console.log('🎾 Extraction matchs...');
      for (let i = 0; i < lines.length && (player1Matches.length + player2Matches.length) < 20; i++) {
        const line = lines[i];
        
        // Chercher des dates
        const hasDate = /\d{1,2}\s*(décembre|novembre|octobre|septembre|août|juillet|juin|mai|avril|mars|février|janvier|BS|HH|MM|BH)/i.test(line);
        
        if (hasDate) {
          let opponent = '';
          let score = '';
          
          // Chercher dans les 5 lignes suivantes
          for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
            const nextLine = lines[j];
            
            // Chercher adversaire
            if (!opponent) {
              const words = nextLine.split(' ').filter(w => w.length > 1);
              if (words.length >= 2 && !/^\d/.test(nextLine)) {
                const cleaned = nextLine.replace(/[^a-zA-Z\s.-]/g, '').trim();
                if (cleaned.length > 3 && cleaned.length < 30) {
                  opponent = cleaned;
                }
              }
            }
            
            // Chercher score
            if (!score) {
              const scoreMatch = nextLine.match(/(\d+)[-\s]+(\d+)/);
              if (scoreMatch) {
                score = `${scoreMatch[1]}-${scoreMatch[2]}`;
              }
            }
            
            if (opponent && score) break;
          }
          
          if (opponent || score) {
            const match = {
              date: line.substring(0, 15).trim(),
              opponent: opponent || 'Adversaire',
              score: score || '2-0',
              tournament: 'Tour',
              time: ''
            };
            
            // Alterner J1/J2
            if (player1Matches.length <= player2Matches.length) {
              player1Matches.push(match);
              console.log(`  ✅ Match J1: ${match.date} vs ${match.opponent} ${match.score}`);
            } else {
              player2Matches.push(match);
              console.log(`  ✅ Match J2: ${match.date} vs ${match.opponent} ${match.score}`);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur OCR:', error);
    }
    
    if (!player1Name) player1Name = `Player-${analysisCount}-A`;
    if (!player2Name) player2Name = `Player-${analysisCount}-B`;
    
    console.log('📊 RÉSULTAT:');
    console.log(`  J1: ${player1Name} (#${player1Rank}) - ${player1Matches.length} matchs`);
    console.log(`  J2: ${player2Name} (#${player2Rank}) - ${player2Matches.length} matchs`);
    console.log('==========================================');
    
    return {
      identity: {
        p1Name: player1Name,
        p2Name: player2Name,
        tournament: 'Tournoi',
        surface: 'Hard',
        date: new Date().toLocaleDateString('fr-FR'),
        time: '15:00',
        round: 'À déterminer'
      },
      p1: createPlayerData(player1Name, player1Rank, player1Matches),
      p2: createPlayerData(player2Name, player2Rank, player2Matches),
      h2h: { global: '? - ?', surface: '? - ?', advantage: 'Équilibré', lastMatches: 'À analyser' },
      conditions: { weather: 'Ensoleillé', temp: '24°C', wind: '10 km/h', altitude: 'Niveau mer', humidity: '60%' },
      bookmaker: { oddA: '1.95', oddB: '1.95', movement: 'STABLE' },
      synthesis: { tech: player1Name, mental: 'Équilibré', physical: player1Name, surface: 'Équilibré', momentum: player1Name, xFactor: 'À déterminer', risk: 'Moyen' },
      prediction: { probA: '50%', probB: '50%', probOver: '50%', probTieBreak: '40%', probUpset: '30%', risk: 'MODERATE', recoWinner: 'Analyse requise', recoOver: '?', recoSet: '?' }
    } as any;
  }
};

function createPlayerData(name: string, rank: string, matches: any[]) {
  const data: any = {
    rank, bestRank: '?', ageHeight: '? / ?', nationality: '?', hand: 'Droitier',
    style: 'Équilibré', winrateCareer: '?', winrateSeason: '?', winrateSurface: '?',
    aces: '?', doubleFaults: '?', firstServe: '?', form: '?/10', injury: 'À vérifier',
    motivation: 'Normale', last5: '?', tournamentRank: '1/2', oddsPlayer: '1.95',
    holdPercent: '?', breakPercent: '?', trend: '?', avgSets: '?', tbPercent: '?',
    firstSetWin: '?', windImpact: '?', coldImpact: '?', oddBetfair: '1.95',
    oddPinnacle: '1.95', oddUnibet: '1.95'
  };
  
  // Remplir les 100 matchs avec les données extraites
  for (let i = 0; i < 100; i++) {
    if (i < matches.length) {
      data[`match${i+1}_date`] = matches[i].date;
      data[`match${i+1}_opponent`] = matches[i].opponent;
      data[`match${i+1}_score`] = matches[i].score;
      data[`match${i+1}_tournament`] = matches[i].tournament;
      data[`match${i+1}_time`] = matches[i].time;
    } else {
      data[`match${i+1}_date`] = '';
      data[`match${i+1}_opponent`] = '';
      data[`match${i+1}_score`] = '';
      data[`match${i+1}_tournament`] = '';
      data[`match${i+1}_time`] = '';
    }
  }
  
  return data;
}
