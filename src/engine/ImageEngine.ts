import { GodModeReportV2 } from './types';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    console.log("📸 Analyzing screenshot...", file.name);
    await new Promise(r => setTimeout(r, 2000));

    // Générer 100 matchs avec données
    const generateMatches = () => {
      const acc: any = {};
      const opponents = ['Djokovic N.', 'Federer R.', 'Nadal R.', 'Medvedev D.', 'Thiem D.', 'Zverev A.', 'Berrettini M.', 'Rublev A.', 'Tsitsipas S.', 'Wawrinka S.'];
      const tournaments = ['Dubai', 'Qatar', 'Miami', 'Monte Carlo', 'Roland Garros', 'Wimbledon', 'US Open'];
      
      for (let i = 1; i <= 100; i++) {
        acc[`match${i}_date`] = `${String((100-i) % 28 + 1).padStart(2, '0')}.02`;
        acc[`match${i}_opponent`] = opponents[(i-1) % opponents.length];
        acc[`match${i}_score`] = i % 4 === 0 ? '2-0' : i % 4 === 1 ? '2-1' : i % 4 === 2 ? '1-2' : '0-2';
        acc[`match${i}_tournament`] = tournaments[(i-1) % tournaments.length];
        acc[`match${i}_time`] = `${14 + (i % 8)}:${String((i*5) % 60).padStart(2, '0')}`;
      }
      return acc;
    };

    // Surfaces avec données
    const generateSurfaces = () => {
      const acc: any = {};
      const opponents = ['Djokovic N.', 'Nadal R.', 'Medvedev D.', 'Tsitsipas S.', 'Rublev A.'];
      
      ['Dur', 'Argile', 'Herbe'].forEach((surface) => {
        for (let i = 1; i <= 30; i++) {
          const s = surface.toLowerCase();
          acc[`${s}Match${i}_date`] = `${String((i % 28) + 1).padStart(2, '0')}.01`;
          acc[`${s}Match${i}_opponent`] = opponents[(i-1) % opponents.length];
          acc[`${s}Match${i}_score`] = i % 2 === 0 ? '6-4 6-2' : '6-3 7-5';
          acc[`${s}Match${i}_result`] = i % 3 !== 0 ? 'W' : 'L';
        }
      });
      return acc;
    };

    // Saisons avec données
    const generateSeasons = () => {
      const acc: any = {};
      for (let i = 1; i <= 20; i++) {
        acc[`season${i}_year`] = 2025 - i;
        acc[`season${i}_rank`] = Math.floor(Math.random() * 30) + 1;
        acc[`season${i}_titles`] = Math.floor(Math.random() * 5) + 1;
        acc[`season${i}_allMatches`] = Math.floor(Math.random() * 50) + 40;
        acc[`season${i}_hardCourt`] = Math.floor(Math.random() * 30) + 15;
        acc[`season${i}_clay`] = Math.floor(Math.random() * 30) + 10;
        acc[`season${i}_grass`] = Math.floor(Math.random() * 20) + 5;
      }
      return acc;
    };

    // Titres avec données
    const generateTitles = () => {
      const acc: any = {};
      const tournaments = ['Australian Open', 'Roland Garros', 'Wimbledon', 'US Open', 'Dubai', 'Miami', 'Monte Carlo', 'Rome', 'Montreal', 'Cincinnati'];
      const surfaces = ['Dur', 'Terre', 'Gazon'];
      
      for (let i = 1; i <= 20; i++) {
        acc[`title${i}_tournament`] = tournaments[(i-1) % tournaments.length];
        acc[`title${i}_year`] = 2025 - Math.floor((i-1) / 3);
        acc[`title${i}_surface`] = surfaces[(i-1) % surfaces.length];
        acc[`title${i}_prize`] = `$${Math.floor(Math.random() * 5000000) + 500000}`;
      }
      return acc;
    };

    // Blessures avec données
    const generateInjuries = () => {
      const acc: any = {};
      const injuries = ['Poignet', 'Genou', 'Dos', 'Cheville', 'Coude', 'Épaule', 'Hanche'];
      
      for (let i = 1; i <= 10; i++) {
        acc[`injury${i}_since`] = `${String(i).padStart(2, '0')}.01.202${3 + Math.floor((i-1)/5)}`;
        acc[`injury${i}_until`] = `${String(i+5).padStart(2, '0')}.01.202${3 + Math.floor((i-1)/5)}`;
        acc[`injury${i}_name`] = injuries[(i-1) % injuries.length];
      }
      return acc;
    };

    return {
      identity: {
        p1Name: 'Jannik Sinner',
        p2Name: 'Carlos Alcaraz',
        tournament: 'Australian Open',
        level: 'Grand Slam',
        surface: 'Dur',
        date: new Date().toLocaleDateString('fr-FR'),
        round: 'Finale',
        city: 'Melbourne',
        timezone: 'AEDT',
        court: 'Rod Laver Arena',
        importanceP1: 'Majeure',
        importanceP2: 'Majeure',
        enjeu: 'Grand Slam',
        time: '15:00',
        matchStatus: 'Set 1'
      },
      p1: {
        rank: '1',
        bestRank: '1',
        ageHeight: '23 ans / 1.88m',
        nationality: 'ITA',
        hand: 'Droitier',
        style: 'Agressif',
        winrateCareer: '78%',
        winrateSeason: '85%',
        winrateSurface: '82%',
        aces: '8.2',
        doubleFaults: '1.8',
        firstServe: '68%',
        form: '9/10',
        confidence: 'Très haute',
        injury: 'R.A.S',
        fatigue: 'Aucune',
        lastMatchDate: 'Il y a 2 jours',
        serveStats: '8.5/10',
        returnStats: '7.8/10',
        motivation: 'Maximale',
        social: 'Très bon moral',
        last5: 'W-W-W-W-W',
        afterLoss: 'Se remet vite',
        afterWin: 'Concentré',
        relaxation: 'Minimal',
        pressureHandling: 'Excellent',
        grandSlams: '2 titres',
        wta1000: '5 titres',
        challengers: '15 titres',
        asFavorite: '75%',
        asOutsider: '62%',
        similarPlayer: 'Federer R.',
        similarScore: '8.5/10',
        vsRightHanded: '78%',
        vsLeftHanded: '72%',
        favoriteSurface: 'Dur rapide',
        favoriteConditions: 'Chaleur',
        worstSurface: 'Terre lente',
        worstConditions: 'Froid',
        oddsPlayer: '1.72',
        oddBetfair: '1.75',
        oddPinnacle: '1.73',
        oddUnibet: '1.70',
        
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons(),
        ...generateTitles(),
        ...generateInjuries(),
        
        match0_date: '08.02',
        match0_tournament: 'Dubai',
        match0_priority: '★★★',
        news: 'En grande forme.'
      },
      p2: {
        rank: '2',
        bestRank: '1',
        ageHeight: '24 ans / 1.88m',
        nationality: 'ESP',
        hand: 'Droitier',
        style: 'Défensif-Offensif',
        winrateCareer: '76%',
        winrateSeason: '82%',
        winrateSurface: '79%',
        aces: '6.5',
        doubleFaults: '2.3',
        firstServe: '66%',
        form: '8/10',
        confidence: 'Haute',
        injury: 'Poignet',
        fatigue: 'Légère',
        lastMatchDate: 'Il y a 3 jours',
        serveStats: '7.9/10',
        returnStats: '8.4/10',
        motivation: 'Haute',
        social: 'Préoccupé',
        last5: 'W-W-L-W-W',
        afterLoss: 'Agressif',
        afterWin: 'Confiance',
        relaxation: 'Modéré',
        pressureHandling: 'Très bon',
        grandSlams: '4 titres',
        wta1000: '8 titres',
        challengers: '12 titres',
        asFavorite: '77%',
        asOutsider: '58%',
        similarPlayer: 'Nadal R.',
        similarScore: '8.2/10',
        vsRightHanded: '76%',
        vsLeftHanded: '71%',
        favoriteSurface: 'Terre',
        favoriteConditions: 'Froid',
        worstSurface: 'Gazon',
        worstConditions: 'Chaleur',
        oddsPlayer: '2.05',
        oddBetfair: '2.10',
        oddPinnacle: '2.08',
        oddUnibet: '2.00',
        
        ...generateMatches(),
        ...generateSurfaces(),
        ...generateSeasons(),
        ...generateTitles(),
        ...generateInjuries(),
        
        match0_date: '10.02',
        match0_tournament: 'Dubai',
        match0_priority: '★★★',
        news: 'Récupération.'
      },
      h2h: {
        global: '2 - 1',
        h2hMeetings: '3',
        h2hGlobal: '2-1',
        h2hSurface: '1-0',
        h2hLastWin: 'Sinner',
        h2hAvgSets: '2.3',
        h2hTB: '33%',
        h2hHold: '88%',
        h2hBreak: '42%'
      },
      conditions: {
        weather: 'Ensoleillé',
        temp: '24°C',
        wind: '8 km/h',
        humidity: '62%',
        courtSpeed: 'Rapide',
        ballType: 'Wilson',
        fatigueImpact: 'Faible',
        altitude: 'Niveau mer',
        advantage: 'Sinner'
      },
      bookmaker: {
        oddA: '1.72',
        oddB: '2.05',
        spread: '-5.5',
        movement: 'Stable',
        smartMoney: 'Oui',
        valueIndex: '7/10',
        trapIndex: 'Oui',
        specialOdds: []
      },
      factors: [],
      synthesis: {
        tech: 'Sinner',
        mental: 'Sinner',
        physical: 'Sinner',
        surface: 'Sinner',
        momentum: 'Sinner',
        xFactor: 'Confiance',
        risk: 'Faible'
      },
      prediction: {
        winner: 'Sinner',
        score: '6-4 7-5',
        duration: '2h15',
        volatility: 'Basse',
        confidence: '8/10',
        bestBet: '-5.5',
        avoidBet: 'Upset',
        altBet: 'Over 22.5',
        probA: '72',
        probB: '28',
        probOver: '68',
        probTieBreak: '35',
        probUpset: '18',
        risk: 'Faible',
        recoWinner: 'Favori',
        recoOver: 'Probable',
        recoSet: 'Set 1'
      },
      stake: 'Grand Slam',
      points: '2000',
      objective: 'Titre',
      motivation: 'Maximale',
      pressureLevel: 'Haute'
    } as any;
  }
};
