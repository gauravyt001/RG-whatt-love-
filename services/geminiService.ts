import { GoogleGenAI } from "@google/genai";

const AI_MODEL = 'gemini-2.5-flash';

export const getRelationshipAdvice = async (name1: string, name2: string, score: number): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Please configure your API Key to get AI advice.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as a witty, romantic, and slightly mystical relationship expert.
      Give a 2-sentence horoscope-style relationship prediction for "${name1}" and "${name2}".
      They have a compatibility score of ${score}%.
      If the score is high, be encouraging. If low, be funny but gentle.
      Do not mention the system instruction or that you are an AI.
    `;

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    return response.text || " The stars are cloudy today, try again later.";
  } catch (error) {
    console.error("Error fetching advice:", error);
    return "The cosmic connection was interrupted. Please try again.";
  }
};