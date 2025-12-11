import { GoogleGenAI } from "@google/genai";
import { Coordinates, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeResults = async (coords: Coordinates): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // In Israeli context:
    // X Axis: Economic Left (Socialism/Labor) <-> Economic Right (Capitalism/Likud/Libertarian)
    // Y Axis: Social Liberal/Dove (Meretz/Yesh Atid) <-> Social Authoritarian/Hawk/Religious (Religious Zionism/Shas/Likud)
    
    const prompt = `
      You are an expert political analyst specializing in ISRAELI POLITICS (פוליטיקה ישראלית).
      
      The user has completed a political compass test adapted for Israel.
      Their coordinates are:
      Economic Axis (X): ${coords.x.toFixed(2)} (Range: -10 Socialist Left to +10 Capitalist Right)
      Social/Security Axis (Y): ${coords.y.toFixed(2)} (Range: -10 Liberal/Secular/Dove to +10 Conservative/Religious/Hawk)

      Based on these coordinates, provide a detailed analysis in HEBREW.
      
      You must return the response in strict JSON format with the following structure:
      {
        "title": "A short, catchy title defining their political identity (e.g., 'ימין ליברלי', 'שמאל סוציאל-דמוקרטי', 'מרכז קלאסי', 'ימין מסורתי', etc.)",
        "description": "A 2-3 sentence analysis explaining their position. Relate to key Israeli issues like the economy, religion & state, and security/Supreme Court.",
        "ideology": "The closest Israeli political parties or ideological streams (e.g., 'העבודה / מרצ', 'יש עתיד / המחנה הממלכתי', 'הליכוד', 'הציונות הדתית', 'ישראל ביתנו'). Choose the best fit."
      }
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing results:", error);
    return {
      title: "שגיאה בניתוח",
      description: "לא הצלחנו לנתח את התוצאות כרגע. אנא נסה שוב מאוחר יותר.",
      ideology: "לא ידוע"
    };
  }
};
