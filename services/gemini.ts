
import { GoogleGenAI, Type } from "@google/genai";
import { StylingFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeOutfit = async (
  base64Image: string,
  occasion: string,
  mood: string,
  weather: string
): Promise<StylingFeedback> => {
  try {
    const response = await ai.models.generateContent({
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
