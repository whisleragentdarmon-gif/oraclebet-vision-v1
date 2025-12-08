import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Config pour accepter les grosses images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Pas d'image reçue" });
    }

    console.log("🚀 Envoi à GPT-4o Vision...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en données sportives tennis. Tu extrais les infos d'un screenshot (Flashscore, appli de paris). Tu ignores les pubs, les dates (Aujourd'hui, Demain), les cotes et les menus. Tu ne renvoies QUE du JSON valide."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extrais les infos du match. Si tu vois 'Paquet C. Salkova D.', comprends que c'est Joueur 1 vs Joueur 2. Format JSON attendu : { p1Name, p1Rank (juste le chiffre), p2Name, p2Rank, tournament, surface (devine selon le tournoi) }." },
            {
              type: "image_url",
              image_url: {
                "url": imageBase64, // L'image est déjà en data:image/jpeg;base64...
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }, // Force le JSON
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Réponse vide de l'IA");

    const data = JSON.parse(content);
    console.log("✅ Résultat GPT-4o :", data);

    res.status(200).json(data);

  } catch (error: any) {
    console.error("❌ Erreur OpenAI :", error);
    res.status(500).json({ error: error.message || "Erreur interne" });
  }
}
