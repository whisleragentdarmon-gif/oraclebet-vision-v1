export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const matchData = req.body;

    console.log('🎾 Match data received from extension:', matchData);

    // Validation basique
    if (!matchData.p1Name || !matchData.p2Name) {
      return res.status(400).json({ error: 'Joueurs manquants' });
    }

    // TODO: Sauvegarder dans la base de données
    // Pour l'instant, on simule juste une sauvegarde en mémoire
    // Plus tard: Firebase, Supabase, etc.

    // Génère un ID unique pour le match
    const matchId = `${matchData.p1Name}_vs_${matchData.p2Name}_${Date.now()}`;

    // Log la sauvegarde
    console.log(`✅ Match sauvegardé: ${matchId}`);
    console.log(`P1: ${matchData.p1Name} (${matchData.p1Rank})`);
    console.log(`P2: ${matchData.p2Name} (${matchData.p2Rank})`);
    console.log(`Tournament: ${matchData.tournament}`);
    console.log(`Surface: ${matchData.surface}`);
    console.log(`H2H: ${matchData.p1H2H}`);

    // Retourne succès avec l'ID du match
    return res.status(200).json({
      success: true,
      matchId: matchId,
      message: 'Match importé avec succès',
      data: matchData
    });

  } catch (error) {
    console.error('❌ Erreur import_match:', error);
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error.message
    });
  }
}
