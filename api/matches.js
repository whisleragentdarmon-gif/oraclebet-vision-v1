export default async function handler(req, res) {
  const API_KEY = '7dfb0411a7msh9454626accfa550p183513jsn32f03233f2eb'; 
  const API_HOST = 'sportscore1.p.rapidapi.com';

  // Fonction pour formater une date YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // On lance les 2 requêtes en parallèle (J et J+1)
    const [resToday, resTomorrow] = await Promise.all([
      fetch(`https://${API_HOST}/events/date/${formatDate(today)}?sport_id=2`, {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST }
      }),
      fetch(`https://${API_HOST}/events/date/${formatDate(tomorrow)}?sport_id=2`, {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST }
      })
    ]);

    const dataToday = await resToday.json();
    const dataTomorrow = await resTomorrow.json();

    // On fusionne les listes
    const allMatches = [
      ...(dataToday.data || []),
      ...(dataTomorrow.data || [])
    ];

    // On filtre uniquement le tennis (Sécurité)
    const tennisOnly = allMatches.filter(match => match.sport_id === 2);

    res.status(200).json({ data: tennisOnly });

  } catch (error) {
    res.status(500).json({ error: "Erreur connexion SportScore", details: error.message });
  }
}
