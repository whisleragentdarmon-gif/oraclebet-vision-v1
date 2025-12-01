export default async function handler(req, res) {
  const API_KEY = '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb'; 
  const API_HOST = 'sportscore1.p.rapidapi.com';

  const today = new Date().toISOString().split('T')[0];

  try {
    // On demande spécifiquement le sport_id=2 (Tennis)
    const url = `https://${API_HOST}/events/date/${today}?sport_id=2`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST
      }
    });

    const data = await response.json();
    
    // --- FILTRE DE SÉCURITÉ ---
    // On vérifie manuellement que chaque match est bien du Tennis (ID 2)
    // Si l'API renvoie du foot (ID 1) ou basket (ID 3), on le vire ici.
    const tennisOnly = data.data ? data.data.filter(match => match.sport_id === 2) : [];

    // On renvoie la liste filtrée
    res.status(200).json({ data: tennisOnly });

  } catch (error) {
    res.status(500).json({ error: "Erreur connexion SportScore", details: error.message });
  }
}
