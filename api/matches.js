export default async function handler(req, res) {
  const API_KEY = '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb'; 
  const API_HOST = 'sportscore1.p.rapidapi.com';

  const formatDate = (date) => date.toISOString().split('T')[0];

  const today = new Date();
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // ON RÉCUPÈRE 3 JOURS D'UN COUP POUR NE RIEN RATER (ITF, UTR, WTA125 inclus)
    const [resYesterday, resToday, resTomorrow] = await Promise.all([
      fetch(`https://${API_HOST}/events/date/${formatDate(yesterday)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } }),
      fetch(`https://${API_HOST}/events/date/${formatDate(today)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } }),
      fetch(`https://${API_HOST}/events/date/${formatDate(tomorrow)}?sport_id=2`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST } })
    ]);

    const dataYesterday = await resYesterday.json();
    const dataToday = await resToday.json();
    const dataTomorrow = await resTomorrow.json();

    // On fusionne tout
    let allMatches = [
      ...(dataYesterday.data || []),
      ...(dataToday.data || []),
      ...(dataTomorrow.data || [])
    ];

    // On s'assure que c'est bien du tennis (ID 2) et on retire les doublons éventuels par ID
    const tennisOnly = allMatches.filter(match => match.sport_id === 2);
    
    // Astuce pour retirer les doublons (parfois l'API renvoie le même match sur 2 jours à minuit)
    const uniqueMatches = Array.from(new Map(tennisOnly.map(item => [item.id, item])).values());

    res.status(200).json({ data: uniqueMatches });

  } catch (error) {
    res.status(500).json({ error: "Erreur connexion SportScore", details: error.message });
  }
}
