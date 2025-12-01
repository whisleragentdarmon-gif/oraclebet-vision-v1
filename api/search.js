export default async function handler(req, res) {
  // 👇 COLLE TA CLÉ SERPER ICI
  const API_KEY = 'TA_CLE_SERPER_ICI'; 

  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Pas de recherche demandée" });

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: 3, // On veut les 3 premiers résultats
        gl: 'fr', // Google France
        hl: 'fr'  // Langue Français
      })
    });

    const data = await response.json();
    
    // On extrait juste ce qui nous intéresse (Titres et petits résumés)
    const snippets = data.organic?.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    })) || [];

    res.status(200).json({ results: snippets });

  } catch (error) {
    res.status(500).json({ error: "Erreur recherche Google", details: error.message });
  }
}
