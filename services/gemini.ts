
import { GoogleGenAI, Type } from "@google/genai";
import { StylingFeedback } from '../types';

let ai: GoogleGenAI | null = null;
let currentKey: string | null = null;

const getAI = async () => {
  let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  
  // Fallback: Fetch from server-side config endpoint if not found in frontend env
  if (!apiKey) {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        apiKey = config.apiKey;
      }
    } catch (err) {
      console.error("Failed to fetch config from server:", err);
    }
  }

  // Re-initialize if key has changed or was previously empty
  if (!ai || (apiKey && apiKey !== currentKey)) {
    console.log(`[${new Date().toISOString()}] Initializing Gemini with key present:`, !!apiKey);
    ai = new GoogleGenAI({ apiKey: apiKey || "" });
    currentKey = apiKey || null;
  }
  return ai;
};

export const analyzeOutfit = async (
  base64Image: string,
  occasion: string,
  mood: string,
  weather: string
): Promise<StylingFeedback> => {
  try {
    const aiInstance = await getAI();
    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/jpeg"
            }
          },
          {
            text: `Analyze this outfit for a ${occasion} occasion. The user wants a ${mood} vibe. The weather is ${weather}. 
            Provide reasoning for the style match, a visual balance score (1-10), weather practicality score (1-10), 
            three actionable styling improvement tips, a list of style tags, and a summary match status (e.g. YES, NO, PARTIALLY).`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            visualBalance: { type: Type.NUMBER },
            weatherPracticality: { type: Type.NUMBER },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            matchStatus: { type: Type.STRING }
          },
          required: ["reasoning", "visualBalance", "weatherPracticality", "tips", "tags", "matchStatus"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Style analysis failed:", error);
    throw error;
  }
};
