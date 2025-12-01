// Fichier : src/services/telegram.ts

export const TelegramService = {
  // Fonction pour envoyer un message texte
  sendMessage: async (text: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Récupérer la config stockée
    const configStr = localStorage.getItem('oracle_config');
    if (!configStr) return { success: false, error: "Configuration introuvable." };

    const config = JSON.parse(configStr);
    const { botToken, chatId } = config.telegramConfig || {};

    if (!botToken || !chatId) {
      return { success: false, error: "Token Bot ou Chat ID manquant dans la config." };
    }

    // 2. Appel à l'API Telegram
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML' // Permet de mettre du gras/italique
        })
      });

      const data = await response.json();

      if (data.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.description };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Générateur de message stylé pour un match
  formatMatchAlert: (match: any): string => {
    const p1 = match.player1.name;
    const p2 = match.player2.name;
    const bet = match.ai.recommendedBet;
    const odds = match.ai.winner === p1 ? match.odds.p1 : match.odds.p2;
    const confidence = match.ai.confidence;
    const bookie = match.ai.oddsAnalysis?.recommendedBookie || 'Bookmaker';

    return `
🔥 <b>ORACLE GOD MODE</b> 🔥

🎾 <b>${p1} vs ${p2}</b>
🏆 ${match.tournament}

👉 <b>${bet}</b>
💰 Cote: <b>${odds.toFixed(2)}</b> (${bookie})
💎 Confiance: ${confidence}%

📊 <i>${match.ai.qualitativeAnalysis}</i>

#Tennis #OracleBet
    `.trim();
  }
};
