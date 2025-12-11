import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates, AnalysisResult } from "../types";

// Fallback logic for when API key is missing or calls fail
const getFallbackAnalysis = (coords: Coordinates): AnalysisResult => {
  const { x, y } = coords;
  let title = "";
  let ideology = "";
  let description = "";

  // Logic:
  // X: -10 (Left/Socialist) to +10 (Right/Capitalist)
  // Y: -10 (Libertarian/Dove) to +10 (Authoritarian/Hawk)
  
  if (x < 0 && y < 0) {
    title = "שמאל-ליברלי (שמאל ציוני)";
    ideology = "העבודה / מרצ / הדמוקרטים";
    description = "אתה תומך במדיניות רווחה כלכלית וצמצום פערים, לצד עמדות ליברליות מובהקות בנושאי דת ומדינה, זכויות אדם ופתרון מדיני. אתה מאמין בשוויון אזרחי מלא ובחשיבות מערכת המשפט.";
  } else if (x < 0 && y >= 0) {
    title = "שמאל חברתי-שמרני";
    ideology = "שמאל מסורתי / מפלגות חברתיות";
    description = "אתה תומך במעורבות ממשלתית עמוקה בכלכלה ובביטחון סוציאלי, אך מחזיק בעמדות שמרניות יותר בנושאי ביטחון, לאום או מסורת. אתה מעדיף יציבות חברתית על פני ליברליזם רדיקלי.";
  } else if (x >= 0 && y < 0) {
    title = "ימין-ליברלי (ליברליזם קלאסי)";
    ideology = "יש עתיד / תקווה חדשה / גישה ליברלית בליכוד";
    description = "אתה מאמין בשוק חופשי, הפחתת מיסים ויוזמה פרטית, אך מדגיש גם את חשיבותן של זכויות הפרט, שלטון החוק והפרדת רשויות. אתה נוטה לפרגמטיות מדינית.";
  } else { // x >= 0 && y >= 0
    title = "ימין-שמרני (המחנה הלאומי)";
    ideology = "הליכוד / הציונות הדתית / ש\"ס";
    description = "אתה דוגל בערכים לאומיים ומסורתיים, עמדה ביטחונית תקיפה וחיזוק המשילות. מבחינה כלכלית אתה נוטה לשוק חופשי, אך רואה חשיבות בשמירה על האופי היהודי של המדינה.";
  }

  return {
    title,
    description: description + "\n\n(הערה: תוצאה זו נוצרה באופן אוטומטי מכיוון שלא זוהה חיבור פעיל לשירות הבינה המלאכותית).",
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
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            ideology: { type: Type.STRING },
          },
          required: ["title", "description", "ideology"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing results with AI:", error);
    // If AI fails (quota, network, invalid key), return fallback
    return getFallbackAnalysis(coords);
  }
};