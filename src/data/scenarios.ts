import { GodModeReportV2 } from '../engine/types';

export const DEMO_SCENARIOS: GodModeReportV2[] = [
    // 1. LE CHOC : Sinner (Favori) vs Alcaraz (Outsider léger)
    {
        identity: {
            matchId: "demo_sinner_alcaraz",
            p1Name: "Jannik Sinner", p2Name: "Carlos Alcaraz",
            tournament: "ATP Indian Wells", surface: "Dur", date: "10.03.2025", time: "20:00", round: "Semi-Final"
        },
        p1: {
            rank: "1", bestRank: "1", nationality: "ITA", ageHeight: "23 / 1.88m", hand: "Droitier",
            style: "Fond de court", strength: "Revers", weakness: "Volée",
            holdPercent: "88%", breakPercent: "29%", aces: "8.5", doubleFaults: "2.1",
            firstServe: "64%", winFirstServe: "78%", winSecondServe: "56%",
            confidence: "10", pressure: "9", form: "9/10", injury: "Aucune",
            wl2024: "15-1", wlCareer: "210-75", vsTop10: "65%",
            match1_score: "2-0", match1_opponent: "Shelton", oddsPlayer: "1.85"
        },
        p2: {
            rank: "2", bestRank: "1", nationality: "ESP", ageHeight: "21 / 1.83m", hand: "Droitier",
            style: "Explosif", strength: "Coup droit", weakness: "Mental",
            holdPercent: "86%", breakPercent: "32%", aces: "5.5", doubleFaults: "3.2",
            firstServe: "66%", winFirstServe: "75%", winSecondServe: "58%",
            confidence: "8", pressure: "8", form: "8/10", injury: "Cheville légère",
            wl2024: "12-3", wlCareer: "180-50", vsTop10: "60%",
            match1_score: "2-1", match1_opponent: "Zverev", oddsPlayer: "1.95"
        },
        h2h: { global: "4-4", h2hSurface: "2-2" },
        conditions: { weather: "Ensoleillé", temp: "24°C" },
        prediction: { probA: "55%", probB: "45%", recoWinner: "Jannik Sinner" }
    } as unknown as GodModeReportV2,

    // 2. LE PIÈGE : Nadal (Vieux Lion) vs Djokovic (Sur Terre)
    {
        identity: {
            matchId: "demo_nadal_djokovic",
            p1Name: "Rafael Nadal", p2Name: "Novak Djokovic",
            tournament: "Roland Garros", surface: "Terre Battue", date: "05.06.2025", time: "15:00", round: "Quarter-Final"
        },
        p1: {
            rank: "15", bestRank: "1", nationality: "ESP", ageHeight: "38 / 1.85m", hand: "Gaucher",
            style: "Légende", holdPercent: "82%", breakPercent: "35%", form: "7/10", injury: "Genou (Doute)",
            wl2024: "10-5", oddsPlayer: "2.50"
        },
        p2: {
            rank: "1", bestRank: "1", nationality: "SRB", ageHeight: "37 / 1.88m", hand: "Droitier",
            style: "Robot", holdPercent: "90%", breakPercent: "30%", form: "9/10", injury: "Aucune",
            wl2024: "20-2", oddsPlayer: "1.50"
        },
        h2h: { global: "29-30", h2hSurface: "20-9 (Nadal)" },
        conditions: { weather: "Nuageux", temp: "18°C" },
        prediction: { probA: "40%", probB: "60%", recoWinner: "Novak Djokovic" }
    } as unknown as GodModeReportV2,

    // 3. LE DUEL WTA : Swiatek (Reine) vs Sabalenka (Puissance)
    {
        identity: {
            matchId: "demo_swiatek_sabalenka",
            p1Name: "Iga Swiatek", p2Name: "Aryna Sabalenka",
            tournament: "WTA Madrid", surface: "Terre Battue", date: "02.05.2025", time: "18:00", round: "Final"
        },
        p1: {
            rank: "1", nationality: "POL", hand: "Droitier", style: "Agression controlée",
            holdPercent: "80%", breakPercent: "45%", form: "10/10",
            match1_score: "2-0", match1_opponent: "Gauff", oddsPlayer: "1.40"
        },
        p2: {
            rank: "2", nationality: "BLR", hand: "Droitier", style: "Puissance pure",
            holdPercent: "85%", breakPercent: "35%", form: "9/10",
            match1_score: "2-1", match1_opponent: "Rybakina", oddsPlayer: "2.75"
        },
        h2h: { global: "7-3" },
        conditions: { weather: "Toit fermé", temp: "22°C" },
        prediction: { probA: "70%", probB: "30%", recoWinner: "Iga Swiatek" }
    } as unknown as GodModeReportV2,

    // 4. L'OUTSIDER : Medvedev vs Kyrgios (Herbe)
    {
        identity: {
            matchId: "demo_medvedev_kyrgios",
            p1Name: "Daniil Medvedev", p2Name: "Nick Kyrgios",
            tournament: "Wimbledon", surface: "Herbe", date: "05.07.2025", time: "14:00", round: "R16"
        },
        p1: {
            rank: "4", nationality: "RUS", hand: "Droitier", style: "Mur",
            holdPercent: "85%", breakPercent: "28%", form: "8/10",
            wl2024: "25-10", oddsPlayer: "1.60"
        },
        p2: {
            rank: "35", nationality: "AUS", hand: "Droitier", style: "Service Volée",
            holdPercent: "92%", breakPercent: "15%", form: "6/10",
            wl2024: "5-2", oddsPlayer: "2.30"
        },
        h2h: { global: "1-4" },
        conditions: { weather: "Vent", temp: "20°C" },
        prediction: { probA: "45%", probB: "55%", recoWinner: "Nick Kyrgios" }
    } as unknown as GodModeReportV2,

    // 5. LE SPECIALISTE : Ruud vs Schwartzman
    {
        identity: {
            matchId: "demo_ruud_schwartzman",
            p1Name: "Casper Ruud", p2Name: "D. Schwartzman",
            tournament: "ATP Monte Carlo", surface: "Terre Battue", date: "15.04.2025", time: "11:00", round: "R32"
        },
        p1: {
            rank: "8", nationality: "NOR", hand: "Droitier",
            holdPercent: "84%", breakPercent: "26%", form: "9/10 (Terre)",
            oddsPlayer: "1.25"
        },
        p2: {
            rank: "110", nationality: "ARG", hand: "Droitier",
            holdPercent: "70%", breakPercent: "20%", form: "3/10",
            oddsPlayer: "4.50"
        },
        h2h: { global: "3-1" },
        conditions: { weather: "Soleil", temp: "26°C" },
        prediction: { probA: "85%", probB: "15%", recoWinner: "Casper Ruud" }
    } as unknown as GodModeReportV2,

    // 6. LE MATCH PIÈGE : Bublik vs Monfils (Indoor)
    {
        identity: {
            matchId: "demo_bublik_monfils",
            p1Name: "Alexander Bublik", p2Name: "Gael Monfils",
            tournament: "ATP Montpellier", surface: "Indoor", date: "06.02.2025", time: "19:00", round: "R16"
        },
        p1: {
            rank: "25", nationality: "KAZ", style: "Imprévisible",
            holdPercent: "80%", breakPercent: "18%", form: "5/10",
            doubleFaults: "10.0", oddsPlayer: "1.90"
        },
        p2: {
            rank: "45", nationality: "FRA", style: "Athlétique",
            holdPercent: "78%", breakPercent: "22%", form: "6/10",
            oddsPlayer: "1.90"
        },
        h2h: { global: "1-1" },
        conditions: { weather: "Indoor", temp: "20°C" },
        prediction: { probA: "50%", probB: "50%", recoWinner: "NO BET" }
    } as unknown as GodModeReportV2
];
