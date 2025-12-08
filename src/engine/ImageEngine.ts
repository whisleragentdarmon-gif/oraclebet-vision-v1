import { GodModeReportV2 } from './types';

// Fonction utilitaire pour convertir le fichier en Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch?: any): Promise<GodModeReportV2> => {
    console.log('🌐 Envoi à l\'API GPT-4o...');

    try {
      const base64 = await fileToBase64(file);

      // Appel à TA route API créée à l'étape 2
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }

      const data = await response.json();

      // Construction du rapport avec les données fiables de GPT
      const p1Name = data.p1Name || 'Inconnu 1';
      const p2Name = data.p2Name || 'Inconnu 2';
      const p1Rank = data.p1Rank || '-';
      const p2Rank = data.p2Rank || '-';
      const tournament = data.tournament || 'Tournoi Inconnu';
      const surface = data.surface || 'Dur';

      return {
        identity: {
          p1Name,
          p2Name,
          tournament,
          surface,
          date: new Date().toLocaleDateString('fr-FR'),
          time: '12:00',
          round: '1er Tour'
        },
        // On remplit le reste avec des valeurs par défaut propres
        p1: createPlayerData(p1Name, p1Rank),
        p2: createPlayerData(p2Name, p2Rank),
        h2h: { global: '? - ?' },
        conditions: { weather: '?', temp: '?' },
        bookmaker: { oddA: '1.90', oddB: '1.90', movement: 'STABLE' },
        synthesis: { risk: 'MEDIUM', xFactor: 'Analyse IA requise' },
        prediction: { probA: '50%', probB: '50%', recoWinner: 'En attente', risk: 'MEDIUM' }
      } as any;

    } catch (error) {
      console.error("❌ Erreur Scan :", error);
      // Fallback propre en cas d'erreur
      return {
        identity: { p1Name: 'Erreur Scan', p2Name: 'Réessayez', tournament: '-', surface: '-' },
        p1: createPlayerData('?', '-'),
        p2: createPlayerData('?', '-'),
        h2h: {}, conditions: {}, bookmaker: {}, synthesis: {}, prediction: {}
      } as any;
    }
  }
};

function createPlayerData(name: string, rank: string) {
    const d: any = { rank, form: '5/10', hand: 'Droitier', nationality: '?' };
    for(let i=1; i<=20; i++) {
        d[`match${i}_date`] = ''; d[`match${i}_score`] = ''; d[`match${i}_opponent`] = '';
    }
    return d;
}
