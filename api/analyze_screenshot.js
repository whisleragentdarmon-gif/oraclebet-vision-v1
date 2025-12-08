// Configuration importante pour autoriser les images lourdes (jusqu'à 10MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // 1. Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Récupération de l'image (base64) depuis le corps de la requête
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Vérification de la clé API
    if (!process.env.CLAUDE_API_KEY) {
      console.error('❌ CLAUDE_API_KEY is missing in .env file');
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    console.log('📸 Sending image to Claude Vision (High Res)...');

    // 3. Appel à l'API Anthropic (Claude 3.5 Sonnet)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Le meilleur modèle pour la vision
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image // L'image reçue du frontend
                }
              },
              {
                type: 'text',
                text: `You are an expert tennis data analyst used to reading scoreboards from Flashscore, Sofascore, and Google Sports.
                
                Analyze this image and extract the match details.
                
                IMPORTANT RULES FOR NAMES:
                1. If names are formatted like "Djokovic N.", infer the full name if it's a famous player (e.g., "Novak Djokovic").
                2. If names are all uppercase (e.g., "ALCARAZ"), convert to Title Case (e.g., "Carlos Alcaraz").
                3. If rankings are visible (e.g., "ATP 4", "#12"), extract ONLY the number.
                
                Return ONLY a valid JSON object. No markdown formatting, no text before or after.
                
                JSON Structure required:
                {
                  "p1Name": "Full Name",
                  "p1Rank": "123", 
                  "p1Nationality": "Country Code (e.g. ESP, FRA) if visible, else null",
                  "p2Name": "Full Name",
                  "p2Rank": "456",
                  "p2Nationality": "Country Code if visible, else null",
                  "tournament": "Tournament Name (e.g. Roland Garros, Miami Open)",
                  "surface": "Hard/Clay/Grass (Infer from tournament name or color of court if visible)",
                  "round": "Round (e.g. Final, R16) if visible",
                  "score": "Current score or Final score if visible"
                }`
              }
            ]
          }
        ]
      })
    });

    // 4. Gestion de la réponse brute de Claude
    const result = await response.json();

    if (!response.ok) {
      console.error('Claude API error details:', result);
      return res.status(500).json({ error: 'Claude API error', details: result });
    }

    // 5. Extraction et Parsing du JSON
    // Claude renvoie parfois du texte autour, on nettoie tout ça.
    const textContent = result.content[0].text;
    
    // On enlève les balises Markdown éventuelles (```json ... ```)
    const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
      data = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content was:', textContent);
      return res.status(500).json({ 
        error: 'Failed to parse Claude response', 
        raw: textContent 
      });
    }

    console.log('✅ Data successfully extracted:', data.p1Name, 'vs', data.p2Name);

    // 6. Envoi de la réponse finale au frontend
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Critical Error in analyze_screenshot:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
