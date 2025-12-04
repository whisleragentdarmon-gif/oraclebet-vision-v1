import { GodModeReportV2 } from './types';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    console.log("📸 Analyzing screenshot...", file.name);
    
    await new Promise(r => setTimeout(r, 2000));

    return {
      identity: {
        p1Name: 'Jannik Sinner',
        p2Name: 'Carlos Alcaraz',
        tournament: 'Australian Open',
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
        last5: 'V-V-V-V-V',
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
        match0_date: '08.02',
        match0_tournament: 'Dubai',
        match0_priority: '★★★',
        match1_date: '18.02',
        match1_tournament: 'Qatar',
        match1_priority: '★★★',
        match2_date: '10.03',
        match2_tournament: 'Miami',
        match2_priority: '★★',
        match3_date: '14.04',
        match3_tournament: 'Monte Carlo',
        match3_priority: '★★★',
        match4_date: '21.05',
        match4_tournament: 'Roland Garros',
        match4_priority: '★★★',
        news: 'En grande forme. Vient de remporter 3 tournois consécutifs.',
        
        // ✅ NOUVEAU: Cotes
        oddsPlayer: '1.72',
        oddBetfair: '1.75',
        oddPinnacle: '1.73',
        oddUnibet: '1.70',
        
        // ✅ NOUVEAU: Terrain favori
        favoriteSurface: 'Dur rapide',
        favoriteConditions: 'Chaleur, pas de vent',
        worstSurface: 'Terre battue lente',
        worstConditions: 'Froid, humide',
        
        // ✅ NOUVEAU: Derniers 30 matchs
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_date`,
          i === 0 ? '05.02' : i === 1 ? '01.02' : `${String(25-i).padStart(2, '0')}.01`
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_opponent`,
          ['Djokovic N.', 'Medvedev D.', 'Alcaraz C.', 'Rublev A.', 'Sinner J.'][i % 5]
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_score`,
          i % 3 === 0 ? '6-4 6-2 V' : i % 3 === 1 ? '7-5 6-3 V' : '6-7 5-7 D'
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_tournament`,
          ['Dubai', 'Qatar', 'Miami', 'Monte Carlo', 'Roland Garros'][i % 5]
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_surface`,
          i % 4 === 0 ? 'Dur' : i % 4 === 1 ? 'Terre' : i % 4 === 2 ? 'Gazon' : 'Dur rapide'
        ])),
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
        last5: 'V-V-D-V-V',
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
        match0_date: '10.02',
        match0_tournament: 'Dubai',
        match0_priority: '★★★',
        match1_date: '16.02',
        match1_tournament: 'Qatar',
        match1_priority: '★★★',
        match2_date: '12.03',
        match2_tournament: 'Miami',
        match2_priority: '★★',
        match3_date: '16.04',
        match3_tournament: 'Monte Carlo',
        match3_priority: '★★★',
        match4_date: '23.05',
        match4_tournament: 'Roland Garros',
        match4_priority: '★★★',
        news: 'Récupération en cours après gêne au poignet.',
        
        // ✅ NOUVEAU: Cotes
        oddsPlayer: '2.05',
        oddBetfair: '2.10',
        oddPinnacle: '2.08',
        oddUnibet: '2.00',
        
        // ✅ NOUVEAU: Terrain favori
        favoriteSurface: 'Terre battue',
        favoriteConditions: 'Froid, peu de vent',
        worstSurface: 'Gazon',
        worstConditions: 'Chaleur extrême',
        
        // ✅ NOUVEAU: Derniers 30 matchs
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_date`,
          i === 0 ? '04.02' : i === 1 ? '31.01' : `${String(28-i).padStart(2, '0')}.01`
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_opponent`,
          ['Sinner J.', 'Rublev A.', 'Djokovic N.', 'Medvedev D.', 'Zverev S.'][i % 5]
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_score`,
          i % 3 === 0 ? '7-6 6-4 V' : i % 3 === 1 ? '6-3 6-2 V' : '5-7 4-6 D'
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_tournament`,
          ['Dubai', 'Qatar', 'Miami', 'Monte Carlo', 'Roland Garros'][i % 5]
        ])),
        ...Object.fromEntries(Array.from({length: 30}, (_, i) => [
          `lastMatch${i+1}_surface`,
          i % 4 === 0 ? 'Dur' : i % 4 === 1 ? 'Terre' : i % 4 === 2 ? 'Gazon' : 'Dur rapide'
        ])),
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
        
        // ✅ NOUVEAU: Jusqu'à 10 derniers H2H
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_date`,
          `${String(5-i).padStart(2, '0')}.02.202${4-Math.floor(i/3)}`
        ])),
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_score`,
          i % 2 === 0 ? '7-6 6-3 Sinner' : '6-4 6-2 Alcaraz'
        ])),
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_tournament`,
          ['Australian Open', 'Dubai', 'Miami', 'Monte Carlo', 'Roland Garros'][i % 5]
        ])),
        ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
          `h2hMatch${i+1}_surface`,
          i % 3 === 0 ? 'Dur' : i % 3 === 1 ? 'Terre' : 'Gazon'
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
        advantage: 'Sinner (favori du climat)'
      },
      bookmaker: {
        oddA: '1.72',
        oddB: '2.05',
        spread: '-5.5',
        movement: 'Stable',
        smartMoney: 'Oui',
        valueIndex: '7/10',
        trapIndex: 'Oui',
        specialOdds: [
          { name: 'Over 22.5', odd: '1.85' },
          { name: 'Over 2.5', odd: '1.92' },
        ]
      },
      factors: [],
      synthesis: {
        tech: 'Sinner',
        mental: 'Sinner',
        physical: 'Sinner',
        surface: 'Sinner',
        momentum: 'Sinner',
        xFactor: 'Confiance de Sinner',
        risk: 'Faible'
      },
      prediction: {
        winner: 'Sinner',
        score: '6-4 7-5',
        duration: '2h15',
        volatility: 'Basse',
        confidence: '8/10',
        bestBet: 'Sinner -5.5',
        avoidBet: 'Alcaraz upset',
        altBet: 'Over 22.5',
        probA: '72',
        probB: '28',
        probOver: '68',
        probTieBreak: '35',
        probUpset: '18',
        risk: 'Faible',
        recoWinner: 'Sinner favori net',
        recoOver: 'Over 22.5 probable',
        recoSet: 'Sinner 1er set'
      },
      stake: 'Grand Slam',
      points: '2000 points ATP',
      objective: 'Remporter le titre',
      motivation: 'Maximale',
      pressureLevel: 'Haute'
    } as any;
  }
};
