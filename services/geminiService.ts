import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserData, PalmistryResult, AstrologyResult, ZodiacSign } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper: Clean JSON Response ---
// Gemini sometimes wraps JSON in markdown blocks (```json ... ```). This helper strips them.
function cleanJsonString(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean.trim();
}

// --- Helper: Deterministic Astronomy ---
function getSunSign(dateStr: string): ZodiacSign {
  if (!dateStr) return ZodiacSign.Aries;
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return ZodiacSign.Capricorn;
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return ZodiacSign.Aquarius;
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return ZodiacSign.Pisces;
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return ZodiacSign.Aries;
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return ZodiacSign.Taurus;
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return ZodiacSign.Gemini;
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return ZodiacSign.Cancer;
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return ZodiacSign.Leo;
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return ZodiacSign.Virgo;
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return ZodiacSign.Libra;
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return ZodiacSign.Scorpio;
  if ((month == 11 && day >= 22) || (month == 12 && day >= 21)) return ZodiacSign.Sagittarius;
  
  return ZodiacSign.Aries; 
}

// --- Palmistry Logic ---

const palmistrySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    loveScore: { type: Type.INTEGER, description: "Score 0-100 based on line depth/clarity" },
    healthScore: { type: Type.INTEGER, description: "Score 0-100 based on life line vitality" },
    wisdomScore: { type: Type.INTEGER, description: "Score 0-100 based on head line length" },
    careerScore: { type: Type.INTEGER, description: "Score 0-100 based on fate line presence" },
    loveText: { type: Type.STRING, description: "Analysis of emotional capacity and heart line" },
    healthText: { type: Type.STRING, description: "Analysis of vitality (not lifespan) and energy" },
    wisdomText: { type: Type.STRING, description: "Analysis of thinking style and head line" },
    careerText: { type: Type.STRING, description: "Analysis of life path and fate line" },
    summary: { type: Type.STRING, description: "A mystical 2-sentence summary of the hand" },
    dominantHandPrediction: { type: Type.STRING, description: "A specific prediction about their near future based on the palm" }
  },
  required: ["loveScore", "healthScore", "wisdomScore", "careerScore", "loveText", "healthText", "wisdomText", "careerText", "summary", "dominantHandPrediction"],
};

export const analyzePalmImage = async (base64Image: string): Promise<PalmistryResult> => {
  try {
    const base64Data = base64Image.split(',')[1] || base64Image;

    // Use gemini-3-flash-preview for balanced speed and multimodal reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Analyze this palm image carefully." },
        ],
      },
      config: {
        systemInstruction: `You are 'Mystic Aurora', a world-class palmistry expert.
        
        YOUR MISSION:
        1. VALIDATION: Check if the image is a human palm. If not, return neutral scores (50) and a summary stating the image was unclear.
        2. ANALYSIS: Identify the Heart, Head, Life, and Fate lines. Gauge their depth, length, and continuity.
        3. SCORING: 
           - Deep, unbroken lines = 80-100.
           - Faint or broken lines = 40-70.
        4. INTERPRETATION: Provide empowering, psychological, and spiritual insights.
           - Avoid fatalism (death, disasters).
           - Focus on potential, energy, and personal growth.
        5. OUTPUT: Strict JSON format.
        `,
        responseMimeType: "application/json",
        responseSchema: palmistrySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJsonString(text)) as PalmistryResult;

  } catch (error) {
    console.error("Palmistry Analysis Error:", error);
    return {
      loveScore: 50, healthScore: 50, wisdomScore: 50, careerScore: 50,
      loveText: "Analysis interrupted.", healthText: "Analysis interrupted.",
      wisdomText: "Analysis interrupted.", careerText: "Analysis interrupted.",
      summary: "We encountered a cosmic interference reading this image. Please ensure the photo is well-lit and clear.",
      dominantHandPrediction: "N/A"
    };
  }
};

// --- Astrology Logic ---

const astrologySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sunSign: { type: Type.STRING, description: "Confirmed Sun Sign" },
    moonSign: { type: Type.STRING, description: "Calculated or Estimated Moon Sign" },
    ascendant: { type: Type.STRING, description: "Calculated or Estimated Ascendant/Rising Sign" },
    prediction: { type: Type.STRING, description: "A personalized 3-sentence horoscope based on goals" },
    powerWord: { type: Type.STRING, description: "One single powerful word" },
    luckyColor: { type: Type.STRING, description: "A lucky color for them based on the reading" },
    compatibilityNote: { type: Type.STRING, description: "One sentence on relationship compatibility" }
  },
  required: ["sunSign", "moonSign", "ascendant", "prediction", "powerWord", "luckyColor", "compatibilityNote"],
};

export const generateAstrologyChart = async (userData: UserData): Promise<AstrologyResult> => {
  try {
    const calculatedSunSign = getSunSign(userData.birthDate);
    
    const prompt = `
      User Profile for Astrology Reading:
      - Sun Sign (Calculated): ${calculatedSunSign}
      - Gender: ${userData.gender}
      - Birth Date: ${userData.birthDate}
      - Birth Time: ${userData.birthTime || "Noon (Estimate)"}
      - Birth Place: ${userData.birthPlace}
      - Relationship Status: ${userData.relationshipStatus}
      - Core Goals: ${userData.goals.join(', ')}
      - Element Resonance: ${userData.element}
      - Power Color Preference: ${userData.favoriteColor}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are 'Celestial Guide', a master astrologer with deep knowledge of planetary transits and psychological astrology.

        TASK:
        1. CHART CALCULATION: Estimate the Moon Sign and Ascendant based on the provided date, time, and place. If time is missing, use solar noon defaults.
        2. SYNTHESIS: Weave the user's specific GOALS and RELATIONSHIP status into the 'prediction'.
           - If they seek 'Career', mention Saturn or Jupiter aspects.
           - If they seek 'Love', focus on Venus and the Moon.
        3. TONE: Professional, mystical, empathetic, but grounded in astrological theory.
        4. OUTPUT: Strict JSON.
        `,
        responseMimeType: "application/json",
        responseSchema: astrologySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(cleanJsonString(text)) as AstrologyResult;
    
    // Safety override to ensure the primary sign matches user expectation
    return { ...result, sunSign: calculatedSunSign };

  } catch (error) {
    console.error("Astrology Generation Error:", error);
    return {
      sunSign: getSunSign(userData.birthDate),
      moonSign: "Unknown",
      ascendant: "Unknown",
      prediction: "The stars are currently veiled. Your energy is shifting, suggesting a time for quiet reflection rather than action.",
      powerWord: "Patience",
      luckyColor: "White",
      compatibilityNote: "Focus on self-alignment."
    };
  }
};