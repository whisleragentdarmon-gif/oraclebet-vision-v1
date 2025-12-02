export default async function handler(req, res) {
  // TA CLÉ SERPER (C'est la bonne)
  const API_KEY = 'da8db13df8b4724e5b2588f0df9a1962f2b5274a'; 

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
        // 👇 MODIFICATION IMPORTANTE : ON PASSE À 10
        // Plus de résultats = Plus de chance que le Scraper trouve des matchs "Nom - Nom"
        num: 10, 
        gl: 'fr', // Google France
        hl: 'fr'  // Langue Français
      })
    });

    const data = await response.json();
    
    // Extraction propre
    const snippets = data.organic?.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    })) || [];

    res.status(200).json({ results: snippets });

  } catch (error) {
    console.error("Erreur Search API:", error);
    res.status(500).json({ error: "Erreur recherche Google", details: error.message });
  }
}
