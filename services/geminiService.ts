import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates, AnalysisResult } from "../types";

// Fallback logic for when API key is missing or calls fail
const getFallbackAnalysis = (coords: Coordinates): AnalysisResult => {
  const { x, y } = coords;
  let title = "";
  let description = "";
  let economicAnalysis = "";
  let nationalAnalysis = "";
  let religiousAnalysis = "";

  // Logic:
  // X: -10 (Left/Socialist) to +10 (Right/Capitalist)
  // Y: -10 (Libertarian/Dove) to +10 (Authoritarian/Hawk)
  
  if (x < 0 && y < 0) {
    title = "שמאל-ליברלי (שמאל ציוני)";
    description = "אתה תומך במדיניות רווחה כלכלית וצמצום פערים, לצד עמדות ליברליות מובהקות בנושאי דת ומדינה, זכויות אדם ופתרון מדיני.";
    economicAnalysis = "תמיכה במדיניות רווחה, מיסוי פרוגרסיבי ושירותים ציבוריים חזקים.";
    nationalAnalysis = "גישה יונית מדינית, תמיכה בפתרון שתי המדינות וחיזוק מערכת המשפט.";
    religiousAnalysis = "תמיכה מובהקת בהפרדת דת ומדינה, תחבורה ציבורית בשבת ונישואים אזרחיים.";
  } else if (x < 0 && y >= 0) {
    title = "שמאל חברתי-שמרני";
    description = "אתה תומך במעורבות ממשלתית עמוקה בכלכלה, אך מחזיק בעמדות שמרניות בנושאי ביטחון או מסורת.";
    economicAnalysis = "תמיכה בכלכלה סוציאליסטית, הגנה על עובדים וחיזוק רשת הביטחון החברתית.";
    nationalAnalysis = "עמדה ביטחונית פרגמטית אך נוטה לשמרנות וחשדנות מדינית.";
    religiousAnalysis = "כבוד למסורת ישראל, עם נכונות לשמור על הסטטוס קוו הדתי.";
  } else if (x >= 0 && y < 0) {
    title = "ימין-ליברלי (ליברליזם קלאסי)";
    description = "אתה מאמין בשוק חופשי ויוזמה פרטית, לצד הגנה על זכויות הפרט ושלטון החוק.";
    economicAnalysis = "תמיכה מובהקת בשוק חופשי, צמצום רגולציה והורדת מיסים.";
    nationalAnalysis = "עמדה ניצית מתונה, תוך שמירה על עקרונות דמוקרטיים וזכויות אדם.";
    religiousAnalysis = "התנגדות לכפייה דתית ותמיכה בחופש הפרט לבחור את אורח חייו.";
  } else { // x >= 0 && y >= 0
    title = "ימין-שמרני (המחנה הלאומי)";
    description = "אתה דוגל בערכים לאומיים, עמדה ביטחונית תקיפה ושוק חופשי, תוך שמירה על צביון המדינה.";
    economicAnalysis = "נטייה לקפיטליזם ושוק חופשי, אך לעיתים עם גישה פופוליסטית כלכלית.";
    nationalAnalysis = "עמדה ביטחונית נצית, תמיכה בהתיישבות וגישה ספקנית כלפי מערכת המשפט.";
    religiousAnalysis = "תמיכה בחיזוק האופי היהודי של המדינה ובשמירה על המסורת במרחב הציבורי.";
  }

  return {
    title,
    description,
    ideology: "",
    economicAnalysis,
    nationalAnalysis,
    religiousAnalysis
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
    
    const prompt = `
      You are an expert political analyst for ISRAELI POLITICS.
      User Coordinates:
      Economic (X): ${coords.x.toFixed(2)} (-10 Socialist to +10 Capitalist)
      Social/Security (Y): ${coords.y.toFixed(2)} (-10 Liberal/Dove to +10 Conservative/Hawk)

      Provide a detailed analysis in HEBREW.
      Return strictly JSON.

      Structure:
      title: Short political identity title.
      description: General summary (2 sentences).
      economicAnalysis: Analysis of their economic views (Market, Welfare, Unions, Taxes).
      nationalAnalysis: Analysis of security, territories, supreme court, and nationalism.
      religiousAnalysis: Analysis of religion & state (Shabbat, Marriage, secularism).
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
            economicAnalysis: { type: Type.STRING },
            nationalAnalysis: { type: Type.STRING },
            religiousAnalysis: { type: Type.STRING },
          },
          required: ["title", "description", "economicAnalysis", "nationalAnalysis", "religiousAnalysis"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text);
    if (!result.ideology) result.ideology = "";
    
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing results with AI:", error);
    return getFallbackAnalysis(coords);
  }
};