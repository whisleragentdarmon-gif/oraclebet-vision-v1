import { GodModeReportV2 } from './types';

interface TesseractWorker {
  recognize: (image: File | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
  setParameters: (params: any) => Promise<void>;
}

interface TesseractModule {
  createWorker: (langs?: string) => Promise<TesseractWorker>;
}

// Nettoyage d'image standard
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Zoom x2 suffisant
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Binarisation simple
        const idata = ctx.getImageData(0,0,canvas.width,canvas.height);
        const data = idata.data;
        for(let i=0; i<data.length; i+=4) {
            const avg = (data[i]+data[i+1]+data[i+2])/3;
            const c = avg < 160 ? 0 : 255;
            data[i]=data[i+1]=data[i+2]=c;
        }
        ctx.putImageData(idata,0,0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File): Promise<GodModeReportV2> => {
    console.log('🔍 Moteur Image V3 (Architecture Clean)...');
    
    let p1 = 'Joueur 1 (Non détecté)';
    let p2 = 'Joueur 2 (Non détecté)';
    let p1Rank = '';
    let p2Rank = '';

    try {
      const Tesseract = await import('tesseract.js') as unknown as TesseractModule;
      const img = await preprocessImage(file);
      const worker = await Tesseract.createWorker('eng'); // Anglais suffit souvent pour les noms
      
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.,() ',
        preserve_interword_spaces: '1',
      } as any);

      const { data: { text } } = await worker.recognize(img);
      await worker.terminate();

      // FILTRAGE STRICT
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3) // Trop court = bruit
        .filter(l => !/\d{2}:\d{2}/.test(l)) // Exclure les heures
        .filter(l => !/\d{2}\.\d{2}/.test(l)) // Exclure les dates
        .filter(l => !['bet', 'bet365', 'odds', 'match', 'score', 'live', 'stat'].some(bad => l.toLowerCase().includes(bad)));

      const candidates: string[] = [];

      for (const line of lines) {
          // On cherche un nom propre : Commence par une Majuscule, contient des lettres min, pas de chiffres au milieu
          // Regex : ^[A-Z] (commence maj) ... [a-z] (a des minuscules) ... pas trop de chiffres
          if (/^[A-Z]/.test(line) && /[a-z]/.test(line) && (line.match(/\d/g) || []).length < 2) {
              // Nettoyage final
              const clean = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
              if (clean.length > 3 && clean.length < 25) {
                  candidates.push(clean);
              }
          }
          
          // Detection Rang (#123)
          const rankM = line.match(/#\s?(\d+)/);
          if (rankM) {
              if (!p1Rank) p1Rank = rankM[1];
              else if (!p2Rank) p2Rank = rankM[1];
          }
      }

      console.log('Candidats trouvés:', candidates);

      // On prend les 2 premiers candidats valides qui ne se ressemblent pas
      if (candidates.length > 0) p1 = candidates[0];
      if (candidates.length > 1) {
          // On vérifie que c'est pas le même
          if (!candidates[1].includes(p1)) p2 = candidates[1];
          else if (candidates.length > 2) p2 = candidates[2];
      }

    } catch (e) {
      console.error(e);
    }

    // Structure Vierge propre
    return {
      identity: {
        p1Name: p1,
        p2Name: p2,
        tournament: 'Analyse Image',
        surface: 'Dur',
        date: new Date().toLocaleDateString(),
        time: '12:00'
      },
      p1: createEmptyPlayer(p1Rank),
      p2: createEmptyPlayer(p2Rank),
      h2h: { global: '?-?' },
      conditions: { weather: '?', temp: '?' },
      bookmaker: { oddA: '-', oddB: '-' },
      synthesis: { risk: 'HIGH' },
      prediction: { probA: '50%', probB: '50%', recoWinner: 'Analyse Manuelle' }
    } as any;
  }
};

function createEmptyPlayer(rank: string) {
    const d: any = { rank: rank || '-', form: '5/10', hand: 'Droitier', nationality: '-' };
    // Boucle propre pour éviter les erreurs undefined
    for(let i=1; i<=20; i++) {
        d[`match${i}_date`] = ''; d[`match${i}_opponent`] = ''; d[`match${i}_score`] = '';
    }
    return d;
}
