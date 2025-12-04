export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('📸 Analyzing screenshot with Claude Vision...');

    // Call Claude API with vision
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
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
                  data: image
                }
              },
              {
                type: 'text',
                text: `Analyze this tennis match screenshot and extract the following data. Return ONLY valid JSON, no other text:

{
  "p1Name": "Player 1 full name",
  "p1Rank": "ranking number",
  "p1Nationality": "country",
  "p1Hand": "Right or Left",
  "p2Name": "Player 2 full name",
  "p2Rank": "ranking number",
  "p2Nationality": "country",
  "p2Hand": "Right or Left",
  "tournament": "tournament name",
  "surface": "Hard/Clay/Grass",
  "date": "date if visible",
  "round": "round if visible",
  "h2h": "head to head record if visible"
}

If you cannot find a field, use null. Be precise with names and rankings.`
              }
            ]
          }
        ]
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Claude API error:', result);
      return res.status(500).json({ error: 'Claude API error', details: result });
    }

    console.log('✅ Claude response:', result);

    // Extract the text content
    const textContent = result.content[0].text;
    console.log('📝 Text from Claude:', textContent);

    // Parse JSON from Claude's response
    let data;
    try {
      // Try to extract JSON from the response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        data = JSON.parse(textContent);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Claude response was:', textContent);
      return res.status(500).json({ 
        error: 'Failed to parse Claude response',
        raw: textContent
      });
    }

    console.log('✅ Extracted data:', data);

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Error analyzing screenshot:', error);
    return res.status(500).json({
      error: 'Error analyzing screenshot',
      details: error.message
    });
  }
}
