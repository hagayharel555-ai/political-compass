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
    title = "ימין-ליברלי (ליברליזם קלאסי / ליברטריאניזם)";
    description = "אתה מאמין בשוק חופשי מוחלט, יוזמה פרטית וצמצום כוח המדינה למינימום ההכרחי.";
    economicAnalysis = "תמיכה מובהקת בליברליזם כלכלי, הפרטות, צמצום רגולציה ושיטת השוברים בחינוך.";
    nationalAnalysis = "עמדה ניצית פרגמטית, תוך דגש על חופש הפרט וצמצום כפייה ממסדית.";
    religiousAnalysis = "התנגדות לכפייה דתית ותמיכה בחופש מוחלט לפרט לבחור את אורח חייו.";
  } else { // x >= 0 && y >= 0
    title = "ימין-שמרני (המחנה הלאומי / שמרנות)";
    description = "אתה דוגל בערכים לאומיים עמוקים, ריבונות, ביטחון תקיף וכלכלה חופשית.";
    economicAnalysis = "תמיכה בקפיטליזם ושוק חופשי, צמצום כוחם של הוועדים וחיזוק המגזר העסקי.";
    nationalAnalysis = "עמדה ביטחונית נצית, תמיכה בהתיישבות, ריבונות ורפורמות במערכת המשפט.";
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
    const model = 'gemini-3-flash-preview'; // Upgraded model for better reasoning
    
    const prompt = `
      You are an expert political analyst for ISRAELI POLITICS.
      Analyze the user's political profile based on their coordinates.
      
      User Coordinates:
      Economic (X): ${coords.x.toFixed(2)} (-10 Socialist/Left to +10 Capitalist/Right)
      Social/Security (Y): ${coords.y.toFixed(2)} (-10 Liberal/Libertarian/Dove to +10 Conservative/Nationalist/Authoritarian/Hawk)

      Key dimensions to consider:
      - Economic: Market freedom, privatization, vouchers, flat tax vs Welfare, regulation, unions.
      - National/Security: Sovereignty, settlement, judicial reform, gun rights, sovereignty in Judea & Samaria vs diplomacy, 2-state solution, judicial independence.
      - Religious: Separation of church & state, civil marriage vs status quo, Jewish identity laws.

      Provide a deep and professional analysis in HEBREW.
      Return strictly JSON.

      Structure:
      title: Short catchy political identity title (e.g. "ליברטריאני שמרן", "סוציאל-דמוקרט ליברלי").
      description: General summary (2-3 sentences).
      economicAnalysis: Detailed analysis of their economic views. Mention concepts like market freedom or welfare based on X.
      nationalAnalysis: Analysis of security, territories, sovereignty, and nationalism based on Y and its interaction with X.
      religiousAnalysis: Analysis of religion & state.
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