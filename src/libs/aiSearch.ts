import fetch from "node-fetch";

export interface AISearchResult {
  collection: "SNEAKERS" | "RUNNING" | "BOOTS" | "LIMITED_DROP" | null;
  color: string | null;
  keywords: string[];
  recommendation: string;
}

const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3.5-flash",
  "gemini-flash-latest"
];

/**
 * Direct Gemini AI Semantic Query Extractor (Zero-fallback)
 * Uses Google Gemini Generative Language API
 */
export async function extractAISearchIntent(
  userQuery: string
): Promise<AISearchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  const systemPrompt = `You are an expert AI Footwear Stylist and Shopping Assistant for KIXORA Luxury Footwear.
Analyze the user's natural language shoe request (which may be written in Uzbek, English, or Russian).
Extract the user's intent into a clean JSON object with the following schema:
{
  "collection": "SNEAKERS" | "RUNNING" | "BOOTS" | "LIMITED_DROP" | null,
  "color": "Black" | "White" | "Red" | "Blue" | "Grey" | "Brown" | "Green" | null,
  "keywords": string[],
  "recommendation": string
}

Rules:
1. "collection" must be one of the 4 exact enum values if identifiable, or null if general.
2. "color" must be the primary color in English title case (e.g., "Black", "White"), or null if not specified.
3. "keywords" should be 2 to 5 English search tokens describing the shoe purpose or style (e.g., "comfortable", "running", "casual", "leather", "daily").
4. "recommendation" MUST be a sleek, warm, professional 1-2 sentence stylist recommendation written in ENGLISH explaining why these models match the user's desire.
5. Return ONLY the raw JSON object inside markdown code block or plain text.`;

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUser request: "${userQuery}"` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`Gemini Model ${model} returned status ${response.status}: ${errorBody}`);
        lastError = new Error(`Gemini API Error (${response.status}) on ${model}: ${errorBody}`);
        continue;
      }

      const data = (await response.json()) as any;
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        lastError = new Error(`No response candidates returned from Gemini AI model ${model}`);
        continue;
      }

      // Clean markdown json blocks if present
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson) as AISearchResult;
      return parsed;
    } catch (err: any) {
      console.warn(`Attempt with ${model} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to extract intent from all Gemini AI models");
}
