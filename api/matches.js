export default async function handler(req, res) {
  // ✅ TA NOUVELLE CLÉ EST ICI
  const API_KEY = 'd95f9c6d94msh91b4f8d1ad05d42p1353acjsnc68090e28eb2'; 
  const API_HOST = 'sportscore1.p.rapidapi.com';

  const formatDate = (date) => date.toISOString().split('T')[0];

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // On récupère Hier, Aujourd'hui et Demain pour être sûr d'avoir des matchs
    const [resYesterday, resToday, resTomorrow] = await Promise.all([
      fetch(`https://${API_HOST}/events/date/${formatDate(yesterday)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } }),
      fetch(`https://${API_HOST}/events/date/${formatDate(today)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } }),
      fetch(`https://${API_HOST}/events/date/${formatDate(tomorrow)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } })
    ]);

    const d1 = await resYesterday.json();
    const d2 = await resToday.json();
    const d3 = await resTomorrow.json();

    // Fusion
    let allMatches = [
      ...(d1.data || []),
      ...(d2.data || []),
      ...(d3.data || [])
    ];

    // Filtre Tennis (ID 2) et Dédoublonnage
    const tennisOnly = allMatches.filter(match => match.sport_id === 2);
    const uniqueMatches = Array.from(new Map(tennisOnly.map(item => [item.id, item])).values());

    res.status(200).json({ data: uniqueMatches });

  } catch (error) {
    res.status(500).json({ error: "Erreur API", details: error.message });
  }
}
