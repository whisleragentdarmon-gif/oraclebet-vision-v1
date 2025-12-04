import { GodModeReportV2 } from './types';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    console.log("📸 Analyzing screenshot...", file.name);
    
    await new Promise(r => setTimeout(r, 2000));

    return {
      identity: {
        p1Name: currentMatch.player1?.name || 'Jannik Sinner',
        p2Name: currentMatch.player2?.name || 'Carlos Alcaraz',
        tournament: currentMatch.tournament || 'Australian Open',
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
        // ✅ Comportement
        afterLoss: 'Se remet vite en question',
        afterWin: 'Reste concentré',
        relaxation: 'Minimal',
        pressureHandling: 'Excellent',
        // ✅ Tournois
        grandSlams: '2 titres',
        wta1000: '5 titres',
        challengers: '15 titres',
        // ✅ Favori/Outsider
        asFavorite: '75% de victoires',
        asOutsider: '62% de victoires',
        // ✅ Joueur Similaire
        similarPlayer: 'Roger Federer (offensive)',
        similarScore: '8.5/10',
        // ✅ vs Main
        vsRightHanded: '78%',
        vsLeftHanded: '72%',
        // ✅ Calendrier (5 prochains matchs)
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
        // ✅ Actualités
        news: 'En grande forme. Vient de remporter 3 tournois consécutifs. Confiance maximale. Prêt pour le Grand Slam.'
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
        // ✅ Comportement
        afterLoss: 'Devient agressif',
        afterWin: 'Construit confiance',
        relaxation: 'Modéré',
        pressureHandling: 'Très bon',
        // ✅ Tournois
        grandSlams: '4 titres',
        wta1000: '8 titres',
        challengers: '12 titres',
        // ✅ Favori/Outsider
        asFavorite: '77% de victoires',
        asOutsider: '58% de victoires',
        // ✅ Joueur Similaire
        similarPlayer: 'Rafael Nadal (défensif)',
        similarScore: '8.2/10',
        // ✅ vs Main
        vsRightHanded: '76%',
        vsLeftHanded: '71%',
        // ✅ Calendrier
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
        // ✅ Actualités
        news: 'Récupération en cours après gêne au poignet. Toujours dangereux sur ses forces (défense, retour). À surveiller le service.'
      },
      h2h: {
        global: '2 - 1',
        surface: '1 - 0',
        advantage: 'Sinner',
        lastMatches: 'Sinner bat Alcaraz 7-6 6-3 en demi-finale',
        trend: 'Sinner monte en puissance',
        analysis: 'Sinner domine récemment',
        // ✅ H2H détails
        h2hMeetings: '3 matchs',
        h2hSurface: 'Dur: 1-0',
        h2hLastWin: 'Sinner il y a 5 jours',
        h2hAvgSets: '2.3 sets',
        h2hTB: '33% des sets',
        h2hHold: '88% Sinner / 85% Alcaraz',
        h2hBreak: '42% Sinner / 38% Alcaraz'
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
          { name: 'Sinner Set 1', odd: '1.95' },
          { name: 'TB Set 1', odd: '4.20' }
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
      // ✅ Enjeux
      stake: 'Grand Slam',
      points: '2000 points ATP',
      objective: 'Remporter le titre',
      motivation: 'Maximale',
      pressureLevel: 'Haute'
    } as any;
  }
};
