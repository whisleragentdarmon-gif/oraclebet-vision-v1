export default async function handler(req, res) {
  // ✅ TA CLÉ EST ICI
  const API_KEY = '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb'; 
  
  // L'adresse de l'API SportScore
  const API_HOST = 'sportscore1.p.rapidapi.com';

  // Date du jour automatique (Format YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  try {
    // ID 2 = Tennis sur SportScore
    // On demande les matchs du jour
    const url = `https://${API_HOST}/events/date/${today}?sport_id=2`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST
      }
    });

    const data = await response.json();
    
    // On renvoie les données à ton site
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Erreur connexion SportScore", details: error.message });
  }
}
