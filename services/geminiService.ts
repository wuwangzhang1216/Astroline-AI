import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserData, PalmistryResult, AstrologyResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const palmistrySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    loveScore: { type: Type.INTEGER, description: "Score from 0-100 for love line" },
    healthScore: { type: Type.INTEGER, description: "Score from 0-100 for health/life line" },
    wisdomScore: { type: Type.INTEGER, description: "Score from 0-100 for wisdom/head line" },
    careerScore: { type: Type.INTEGER, description: "Score from 0-100 for career/fate line" },
    loveText: { type: Type.STRING, description: "Short interpretation of love line" },
    healthText: { type: Type.STRING, description: "Short interpretation of health line" },
    wisdomText: { type: Type.STRING, description: "Short interpretation of head line" },
    careerText: { type: Type.STRING, description: "Short interpretation of fate line" },
    summary: { type: Type.STRING, description: "Overall 2 sentence summary of the palm reading" },
  },
  required: ["loveScore", "healthScore", "wisdomScore", "careerScore", "loveText", "healthText", "wisdomText", "careerText", "summary"],
};

export const analyzePalmImage = async (base64Image: string): Promise<PalmistryResult> => {
  try {
    // Strip the prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    // We use gemini-3-flash-preview because it supports both image input and responseSchema (JSON).
    // gemini-2.5-flash-image does not support responseSchema.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: "Analyze this palm for palmistry. Identify the major lines (Heart, Head, Life, Fate). Provide scores and brief mystical interpretations for Love, Health, Wisdom, and Career.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: palmistrySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PalmistryResult;

  } catch (error) {
    console.error("Palmistry Analysis Error:", error);
    // Fallback mock data if API fails or image is unclear
    return {
      loveScore: 78,
      healthScore: 88,
      wisdomScore: 82,
      careerScore: 91,
      loveText: "Your Heart Line indicates a passionate nature.",
      healthText: "Strong vitality is shown in your Life Line.",
      wisdomText: "A clear thinker with practical solutions.",
      careerText: "Success is indicated through persistence.",
      summary: "Your palm reveals a balanced life with strong potential for leadership."
    };
  }
};

const astrologySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sunSign: { type: Type.STRING },
    moonSign: { type: Type.STRING },
    ascendant: { type: Type.STRING },
    prediction: { type: Type.STRING, description: "A mystical 2-sentence prediction based on the user data" },
    powerWord: { type: Type.STRING, description: "A single word representing their current cosmic energy" }
  },
  required: ["sunSign", "moonSign", "ascendant", "prediction", "powerWord"],
};

export const generateAstrologyChart = async (userData: UserData): Promise<AstrologyResult> => {
  try {
    const prompt = `
      Generate a birth chart summary for a ${userData.gender || 'person'} 
      born on ${userData.birthDate} at ${userData.birthTime || 'Unknown Time'} 
      in ${userData.birthPlace}. 
      Goals: ${userData.goals.join(', ')}. 
      Relationship Status: ${userData.relationshipStatus}.
      Element preference: ${userData.element}.
      
      Provide the Sun, Moon, and Ascendant signs (calculate accurately if possible, otherwise estimate based on date/time).
      Provide a short personalized prediction.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: astrologySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AstrologyResult;

  } catch (error) {
    console.error("Astrology Generation Error:", error);
    return {
      sunSign: "Aquarius",
      moonSign: "Virgo",
      ascendant: "Libra",
      prediction: "The stars align to bring new opportunities in your career sector. Embrace the unexpected.",
      powerWord: "Transformation"
    };
  }
};