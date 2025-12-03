export default async function handler(req, res) {
  // 👇 TA CLÉ RAPIDAPI ICI
  const API_KEY = process.env.RAPIDAPI_KEY || '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb';
  const API_HOST = 'tennis-api.p.rapidapi.com';

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query manquante" });
  }

  try {
    console.log(`🎾 Tennis API Server Call: ${query}`);

    // Endpoint: /player-profile (chercher par nom)
    const response = await fetch(
      `https://${API_HOST}/player-profile?name=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ Tennis API Error: ${response.status}`);
      return res.status(response.status).json({ error: `Tennis API ${response.status}` });
    }

    const data = await response.json();
    console.log(`✅ Tennis API Response:`, data);

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Server Error tennis_search:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
