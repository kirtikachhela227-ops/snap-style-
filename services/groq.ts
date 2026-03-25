
import Groq from "groq-sdk";
import { StylingFeedback } from '../types';

let groq: Groq | null = null;

const getGroq = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set. Please add it to your Vercel environment variables.");
    }
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
  return groq;
};

export const analyzeOutfitWithGroq = async (
  base64Image: string,
  occasion: string,
  mood: string,
  weather: string
): Promise<StylingFeedback> => {
  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this outfit for a ${occasion} occasion. The user wants a ${mood} vibe. The weather is ${weather}. 
              Provide reasoning for the style match, a visual balance score (1-10), weather practicality score (1-10), 
              three actionable styling improvement tips, a list of style tags, and a summary match status (e.g. YES, NO, PARTIALLY).
              Return the response in JSON format with these keys: reasoning, visualBalance, weatherPracticality, tips (array), tags (array), matchStatus.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error("Groq style analysis failed:", error);
    throw error;
  }
};
