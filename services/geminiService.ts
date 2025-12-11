import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates, AnalysisResult } from "../types";

// Fallback logic for when API key is missing or calls fail
const getFallbackAnalysis = (coords: Coordinates): AnalysisResult => {
  const { x, y } = coords;
  let title = "";
  // Ideology is left empty as requested
  let ideology = "";
  let description = "";

  // Logic:
  // X: -10 (Left/Socialist) to +10 (Right/Capitalist)
  // Y: -10 (Libertarian/Dove) to +10 (Authoritarian/Hawk)
  
  if (x < 0 && y < 0) {
    title = "שמאל-ליברלי (שמאל ציוני)";
    description = "אתה תומך במדיניות רווחה כלכלית וצמצום פערים, לצד עמדות ליברליות מובהקות בנושאי דת ומדינה, זכויות אדם ופתרון מדיני. אתה מאמין בשוויון אזרחי מלא ובחשיבות מערכת המשפט.";
  } else if (x < 0 && y >= 0) {
    title = "שמאל חברתי-שמרני";
    description = "אתה תומך במעורבות ממשלתית עמוקה בכלכלה ובביטחון סוציאלי, אך מחזיק בעמדות שמרניות יותר בנושאי ביטחון, לאום או מסורת. אתה מעדיף יציבות חברתית על פני ליברליזם רדיקלי.";
  } else if (x >= 0 && y < 0) {
    title = "ימין-ליברלי (ליברליזם קלאסי)";
    description = "אתה מאמין בשוק חופשי, הפחתת מיסים ויוזמה פרטית, אך מדגיש גם את חשיבותן של זכויות הפרט, שלטון החוק והפרדת רשויות. אתה נוטה לפרגמטיות מדינית.";
  } else { // x >= 0 && y >= 0
    title = "ימין-שמרני (המחנה הלאומי)";
    description = "אתה דוגל בערכים לאומיים ומסורתיים, עמדה ביטחונית תקיפה וחיזוק המשילות. מבחינה כלכלית אתה נוטה לשוק חופשי, אך רואה חשיבות בשמירה על האופי היהודי של המדינה.";
  }

  // NOTE: Removed the appended text warning about automatic generation as requested.
  return {
    title,
    description,
    ideology
  };
};

export const analyzeResults = async (coords: Coordinates): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // Immediate fallback if no key is configured
    if (!apiKey) {
      console.warn("API Key is missing, using fallback analysis.");
      return getFallbackAnalysis(coords);
    }

    const ai = new GoogleGenAI({ apiKey });
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
        "description": "A 2-3 sentence analysis explaining their position. Relate to key Israeli issues like the economy, religion & state, and security/Supreme Court."
      }
      
      Note: The 'ideology' field is NOT required anymore.
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            // Ideology intentionally omitted/made optional in prompt
            ideology: { type: Type.STRING }, 
          },
          required: ["title", "description"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text);
    // Ensure ideology field exists to satisfy type definition, even if empty
    if (!result.ideology) result.ideology = "";
    
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing results with AI:", error);
    // If AI fails (quota, network, invalid key), return fallback
    return getFallbackAnalysis(coords);
  }
};