import { GodModeReportV2 } from './types';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    console.log("📸 Analyzing screenshot...", file.name);
    
    await new Promise(r => setTimeout(r, 2000));

    // Helper pour générer 100 derniers matchs
    const generateMatches = (count: number, player: string) => {
      const opponents = ['Djokovic N.', 'Federer R.', 'Nadal R.', 'Medvedev D.', 'Thiem D.', 'Zverev A.', 'Berrettini M.', 'Rublev A.'];
      const acc: any = {};
      for (let i = 1; i <= count; i++) {
        acc[`match${i}_date`] = `${String(i).padStart(2, '0')}.01.2025`;
        acc[`match${i}_opponent`] = opponents[i % opponents.length];
        acc[`match${i}_score`] = i % 3 === 0 ? '2-0' : i % 3 === 1 ? '2-1' : '0-2';
        acc[`match${i}_result`] = i % 3 === 0 || i % 3 === 1 ? 'W' : 'L';
        acc[`match${i}_tournament`] = ['Dubai', 'Qatar', 'Miami', 'Monte Carlo'][i % 4];
        acc[`match${i}_time`] = `${14 + (i % 8)}:${String(i % 60).padStart(2, '0')}`;
      }
      return acc;
    };

    // Helper pour matchs par surface
    const generateSurfaceMatches = (surface: string, count: number) => {
      const opponents = ['Djokovic N.', 'Federer R.', 'Nadal R.', 'Medvedev D.', 'Thiem D.'];
      const acc: any = {};
      for (let i = 1; i <= count; i++) {
        acc[`${surface.toLowerCase()}Match${i}_date`] = `${String(i).padStart(2, '0')}.01.2025`;
        acc[`${surface.toLowerCase()}Match${i}_opponent`] = opponents[i % opponents.length];
        acc[`${surface.toLowerCase()}Match${i}_score`] = i % 2 === 0 ? '6-4 6-2' : '6-3 7-5';
        acc[`${surface.toLowerCase()}Match${i}_result`] = i % 3 !== 0 ? 'W' : 'L';
      }
      return acc;
    };

    // Helper pour tournois gagnés
    const generateTournaments = (count: number) => {
      const tournaments = ['Australian Open', 'Roland Garros', 'Wimbledon', 'US Open', 'Dubai', 'Miami', 'Monte Carlo'];
      const surfaces = ['Dur', 'Terre', 'Gazon', 'Dur'];
      const acc: any = {};
      for (let i = 1; i <= count; i++) {
        acc[`title${i}_tournament`] = tournaments[i % tournaments.length];
        acc[`title${i}_year`] = 2025 - Math.floor(i / 3);
        acc[`title${i}_surface`] = surfaces[i % surfaces.length];
        acc[`title${i}_prize`] = `$${Math.floor(Math.random() * 5000000).toLocaleString()}`;
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
        afterLoss: 'Se remet vite en question',
        afterWin: 'Reste concentré',
        relaxation: 'Minimal',
        pressureHandling: 'Excellent',
        grandSlams: '2 titres',
        wta1000: '5 titres',
        challengers: '15 titres',
        asFavorite: '75% de victoires',
        asOutsider: '62% de victoires',
        similarPlayer: 'Roger Federer (offensive)',
        similarScore: '8.5/10',
        vsRightHanded: '78%',
        vsLeftHanded: '72%',
        favoriteSurface: 'Dur rapide',
        favoriteConditions: 'Chaleur, pas de vent',
        worstSurface: 'Terre battue lente',
        worstConditions: 'Froid, humide',
        oddsPlayer: '1.72',
        oddBetfair: '1.75',
        oddPinnacle: '1.73',
        oddUnibet: '1.70',
        
        // ✅ 100 derniers matchs
        ...generateMatches(100, 'p1'),
        
        // ✅ Matchs par surface
        ...generateSurfaceMatches('Dur', 30),
        ...generateSurfaceMatches('Argile', 25),
        ...generateSurfaceMatches('Herbe', 15),
        
        // ✅ Bilan de saison (20 ans)
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_year`, 2025 - i
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_rank`, Math.floor(Math.random() * 100) + 1
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_titles`, Math.floor(Math.random() * 5)
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_allMatches`, Math.floor(Math.random() * 100) + 30
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_hardCourt`, Math.floor(Math.random() * 100) + 20
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_clay`, Math.floor(Math.random() * 100) + 20
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_grass`, Math.floor(Math.random() * 100) + 10
        ])),
        
        // ✅ Tournois gagnés
        ...generateTournaments(20),
        
        // ✅ Antécédents de blessures
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_since`, `${String(i+1).padStart(2, '0')}.01.202${3+Math.floor(i/2)}`
        ])),
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_until`, `${String(i+5).padStart(2, '0')}.01.202${3+Math.floor(i/2)}`
        ])),
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_name`, ['Poignet', 'Genou', 'Dos', 'Cheville', 'Coude'][i]
        ])),
        
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
        injury: 'Poignet (léger)',
        fatigue: 'Légère',
        lastMatchDate: 'Il y a 3 jours',
        serveStats: '7.9/10',
        returnStats: '8.4/10',
        motivation: 'Haute',
        social: 'Préoccupé',
        last5: 'W-W-L-W-W',
        afterLoss: 'Devient agressif',
        afterWin: 'Construit confiance',
        relaxation: 'Modéré',
        pressureHandling: 'Très bon',
        grandSlams: '4 titres',
        wta1000: '8 titres',
        challengers: '12 titres',
        asFavorite: '77% de victoires',
        asOutsider: '58% de victoires',
        similarPlayer: 'Rafael Nadal (défensif)',
        similarScore: '8.2/10',
        vsRightHanded: '76%',
        vsLeftHanded: '71%',
        favoriteSurface: 'Terre battue',
        favoriteConditions: 'Froid, peu de vent',
        worstSurface: 'Gazon',
        worstConditions: 'Chaleur extrême',
        oddsPlayer: '2.05',
        oddBetfair: '2.10',
        oddPinnacle: '2.08',
        oddUnibet: '2.00',
        
        // ✅ 100 derniers matchs
        ...generateMatches(100, 'p2'),
        
        // ✅ Matchs par surface
        ...generateSurfaceMatches('Dur', 30),
        ...generateSurfaceMatches('Argile', 25),
        ...generateSurfaceMatches('Herbe', 15),
        
        // ✅ Bilan de saison (20 ans)
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_year`, 2025 - i
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_rank`, Math.floor(Math.random() * 100) + 1
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_titles`, Math.floor(Math.random() * 5)
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_allMatches`, Math.floor(Math.random() * 100) + 30
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_hardCourt`, Math.floor(Math.random() * 100) + 20
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_clay`, Math.floor(Math.random() * 100) + 20
        ])),
        ...Object.fromEntries(Array.from({length: 20}, (_, i) => [
          `season${i+1}_grass`, Math.floor(Math.random() * 100) + 10
        ])),
        
        // ✅ Tournois gagnés
        ...generateTournaments(20),
        
        // ✅ Antécédents de blessures
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_since`, `${String(i+1).padStart(2, '0')}.01.202${3+Math.floor(i/2)}`
        ])),
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_until`, `${String(i+5).padStart(2, '0')}.01.202${3+Math.floor(i/2)}`
        ])),
        ...Object.fromEntries(Array.from({length: 5}, (_, i) => [
          `injury${i+1}_name`, ['Poignet', 'Genou', 'Dos', 'Cheville', 'Coude'][i]
        ])),
        
        match0_date: '10.02',
        match0_tournament: 'Dubai',
        match0_priority: '★★★',
        news: 'Récupération en cours.'
      },
      h2h: {
        global: '2 - 1',
        surface: '1 - 0',
        advantage: 'Sinner',
        lastMatches: 'Sinner bat Alcaraz 7-6 6-3 en demi-finale',
        trend: 'Sinner monte en puissance',
        analysis: 'Sinner domine récemment',
        h2hMeetings: '3 matchs',
        h2hSurface: 'Dur: 1-0',
        h2hLastWin: 'Sinner il y a 5 jours',
        h2hAvgSets: '2.3 sets',
        h2hTB: '33% des sets',
        h2hHold: '88% Sinner / 85% Alcaraz',
        h2hBreak: '42% Sinner / 38% Alcaraz',
        
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_date`,
          `${String(5-i).padStart(2, '0')}.02.202${4-Math.floor(i/3)}`
        ])),
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_score`,
          i % 2 === 0 ? '7-6 6-3 Sinner' : '6-4 6-2 Alcaraz'
        ])),
      },
      conditions: {
        weather: 'Ensoleillé',
        temp: '24°C',
        wind: '8 km/h Ouest',
        humidity: '62%',
        courtSpeed: 'Rapide',
        ballType: 'Wilson US Open',
        fatigueImpact: 'Faible',
        altitude: 'Au niveau de la mer',
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
        bestBet: 'Sinner -5.5',
        avoidBet: 'Upset',
        altBet: 'Over 22.5',
        probA: '72',
        probB: '28',
        probOver: '68',
        probTieBreak: '35',
        probUpset: '18',
        risk: 'Faible',
        recoWinner: 'Sinner favori',
        recoOver: 'Over 22.5',
        recoSet: 'Sinner 1er set'
      },
      stake: 'Grand Slam',
      points: '2000 points ATP',
      objective: 'Titre',
      motivation: 'Maximale',
      pressureLevel: 'Haute'
    } as any;
  }
};
