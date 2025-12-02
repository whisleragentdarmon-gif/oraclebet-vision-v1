export default async function handler(req, res) {
  // 1. TA CLÉ (Vérifie que c'est bien celle de SportScore sur RapidAPI)
  const API_KEY = '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb'; 
  const API_HOST = 'sportscore1.p.rapidapi.com';

  const formatDate = (date) => date.toISOString().split('T')[0];
  const today = new Date();

  try {
    console.log("Tentative de connexion à SportScore...");
    
    const response = await fetch(`https://${API_HOST}/events/date/${formatDate(today)}?sport_id=2`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST
      }
    });

    // SI L'API RENVOIE UNE ERREUR (Clé fausse, Quota dépassé...)
    if (!response.ok) {
      console.log("Erreur API:", response.status);
      // On lance le mode secours
      return sendBackupData(res, `Erreur API (${response.status}). Mode Secours activé.`);
    }

    const json = await response.json();

    // SI L'API RENVOIE 0 MATCHS (Bug ou mauvaise clé)
    if (!json.data || json.data.length === 0) {
      console.log("API vide.");
      return sendBackupData(res, "L'API a répondu mais 0 matchs trouvés. Mode Secours activé.");
    }

    // SI TOUT VA BIEN : On renvoie les vraies données
    res.status(200).json({ data: json.data });

  } catch (error) {
    console.error("Crash serveur:", error);
    return sendBackupData(res, "Crash du serveur Vercel. Mode Secours activé.");
  }
}

// --- FONCTION DE SECOURS (BACKUP) ---
// Elle renvoie tes matchs préférés si l'API plante
function sendBackupData(res, reason) {
  console.log("Activation Backup:", reason);
  
  const backupMatches = [
    {
      id: 'live-bogota-backup',
      slug: 'live', // Pour être détecté comme LIVE
      status: 'inprogress',
      league: { name: 'Challenger Bogota (MODE SECOURS)' },
      start_at: new Date().toISOString(),
      home_score: { display: 1 },
      away_score: { display: 0 },
      home_team: { name: 'Ficovich J.P.', country_code: 'ARG' },
      away_team: { name: 'Gomez J.S.', country_code: 'COL' },
      sport_id: 2
    },
    {
      id: 'upcoming-rune-backup',
      slug: 'upcoming',
      status: 'notstarted',
      league: { name: 'ATP Munich (MODE SECOURS)' },
      start_at: new Date(Date.now() + 86400000).toISOString(), // Demain
      home_team: { name: 'H. Rune', country_code: 'DEN' },
      away_team: { name: 'J. Struff', country_code: 'GER' },
      sport_id: 2
    }
  ];

  // On renvoie les données de secours avec un petit message d'erreur caché
  res.status(200).json({ 
    data: backupMatches,
    warning: reason 
  });
}
