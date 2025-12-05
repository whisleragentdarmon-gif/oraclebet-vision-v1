import { GodModeReportV2 } from './types';

export const ImageEngine = {
  analyzeScreenshot: async (file: File, currentMatch: any): Promise<GodModeReportV2> => {
    console.log("📸 Analyzing screenshot...", file.name);
    
    try {
      // Convertir le fichier en base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      console.log('🔄 Appel Claude Vision API...');
      
      // ✅ APPEL CLAUDE API VISION
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: file.type || "image/png",
                    data: base64
                  }
                },
                {
                  type: "text",
                  text: `Analyse ce screenshot de match de tennis et extrait TOUTES les informations visibles.

Retourne un JSON avec cette structure EXACTE :

{
  "player1": {
    "name": "Nom complet",
    "rank": "Classement",
    "country": "Pays",
    "age": "Age",
    "height": "Taille",
    "hand": "Main",
    "odds": "Cote"
  },
  "player2": {
    "name": "Nom complet",
    "rank": "Classement",
    "country": "Pays",
    "age": "Age",
    "height": "Taille",
    "hand": "Main",
    "odds": "Cote"
  },
  "match": {
    "tournament": "Nom tournoi",
    "round": "Tour",
    "surface": "Surface",
    "date": "Date",
    "time": "Heure"
  }
}

Si une info n'est pas visible, mets "?". Réponds UNIQUEMENT le JSON.`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content.find((c: any) => c.type === 'text')?.text || '{}';
      const cleanJson = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      console.log('📊 Données extraites:', parsed);
      
      const matchId = `screenshot-${Date.now()}`;
      
      return {
        identity: {
          p1Name: parsed.player1.name,
          p2Name: parsed.player2.name,
          tournament: parsed.match.tournament,
          surface: parsed.match.surface,
          date: parsed.match.date || new Date().toLocaleDateString('fr-FR'),
          matchId: matchId
        },
        p1: {
          rank: parsed.player1.rank || '?',
          bestRank: '?',
          ageHeight: `${parsed.player1.age || '?'} / ${parsed.player1.height || '?'}`,
          nationality: parsed.player1.country || '?',
          hand: parsed.player1.hand || '?',
          style: '?',
          winrateCareer: '?',
          winrateSeason: '?',
          winrateSurface: '?',
          aces: '?',
          doubleFaults: '?',
          firstServe: '?',
          form: '?',
          injury: '?',
          motivation: '?',
          last5: '?'
        },
        p2: {
          rank: parsed.player2.rank || '?',
          bestRank: '?',
          ageHeight: `${parsed.player2.age || '?'} / ${parsed.player2.height || '?'}`,
          nationality: parsed.player2.country || '?',
          hand: parsed.player2.hand || '?',
          style: '?',
          winrateCareer: '?',
          winrateSeason: '?',
          winrateSurface: '?',
          aces: '?',
          doubleFaults: '?',
          firstServe: '?',
          form: '?',
          injury: '?',
          motivation: '?',
          last5: '?'
        },
        h2h: {
          global: '?',
          surface: '?',
          advantage: '?',
          lastMatches: '?'
        },
        conditions: {
          weather: '?',
          temp: '?',
          wind: '?',
          altitude: '?'
        },
        bookmaker: {
          oddA: parsed.player1.odds || '?',
          oddB: parsed.player2.odds || '?',
          movement: 'STABLE'
        },
        synthesis: {
          tech: '?',
          mental: '?',
          physical: '?',
          surface: '?',
          momentum: '?',
          xFactor: '?',
          risk: '?'
        },
        prediction: {
          probA: '50%',
          probB: '50%',
          probOver: '?',
          probTieBreak: '?',
          probUpset: '?',
          risk: 'MODERATE',
          recoWinner: '?',
          recoOver: '?',
          recoSet: '?'
        }
      } as any;
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      
      // FALLBACK avec ID unique
      return {
        identity: {
          p1Name: `Match-${Date.now()}-J1`,
          p2Name: `Match-${Date.now()}-J2`,
          tournament: '?',
          surface: 'Hard',
          date: new Date().toLocaleDateString('fr-FR'),
          matchId: `screenshot-${Date.now()}`
        },
        p1: { rank: '?', bestRank: '?', ageHeight: '?', nationality: '?', hand: '?', style: '?', winrateCareer: '?', winrateSeason: '?', winrateSurface: '?', aces: '?', doubleFaults: '?', firstServe: '?', form: '?', injury: '?', motivation: '?', last5: '?' },
        p2: { rank: '?', bestRank: '?', ageHeight: '?', nationality: '?', hand: '?', style: '?', winrateCareer: '?', winrateSeason: '?', winrateSurface: '?', aces: '?', doubleFaults: '?', firstServe: '?', form: '?', injury: '?', motivation: '?', last5: '?' },
        h2h: { global: '?', surface: '?', advantage: '?', lastMatches: '?' },
        conditions: { weather: '?', temp: '?', wind: '?', altitude: '?' },
        bookmaker: { oddA: '?', oddB: '?', movement: 'STABLE' },
        synthesis: { tech: '?', mental: '?', physical: '?', surface: '?', momentum: '?', xFactor: '?', risk: '?' },
        prediction: { probA: '50%', probB: '50%', probOver: '?', probTieBreak: '?', probUpset: '?', risk: 'MODERATE', recoWinner: '?', recoOver: '?', recoSet: '?' }
      } as any;
    }
  }
};
