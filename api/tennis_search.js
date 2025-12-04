export default async function handler(req, res) {
  // ✅ TA CLÉ RAPIDAPI
  const API_KEY = process.env.RAPIDAPI_KEY || '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb';
  const API_HOST = 'tennis-api.p.rapidapi.com';

  // 🎯 Récupère le query du POST
  const { query } = req.body;

  if (!query) {
    console.log('❌ Query manquante');
    return res.status(400).json({ error: "Query manquante" });
  }

  console.log(`🎾 Tennis Search API: ${query}`);

  try {
    // 📡 Appel Tennis API depuis le serveur (PAS depuis le navigateur!)
    const apiUrl = `https://${API_HOST}/player-profile?name=${encodeURIComponent(query)}`;
    console.log(`📡 Appel: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    });

    console.log(`📊 Status: ${response.status}`);

    if (!response.ok) {
      console.error(`❌ Tennis API Error: ${response.status}`);
      return res.status(response.status).json({ 
        error: `Tennis API ${response.status}` 
      });
    }

    const data = await response.json();
    console.log(`✅ Tennis API Success!`);
    console.log(`📋 Data:`, JSON.stringify(data).substring(0, 200));

    // ✅ Retourne les données au frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    return res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
}
