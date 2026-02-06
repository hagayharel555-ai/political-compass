import { Coordinates, AnalysisResult } from "../types";

/**
 * Local deterministic political analysis engine (No AI).
 * Analyzes X (Economic), Y (National Security), and Z (Conservatism)
 */
export const analyzeResults = async (coords: Coordinates): Promise<AnalysisResult> => {
  // Simulate network delay for UX
  await new Promise(resolve => setTimeout(resolve, 800));
  return fallbackAnalysis(coords);
};

const fallbackAnalysis = (coords: Coordinates): AnalysisResult => {
  const { x, y, z } = coords;
  
  const isRight = x >= 0;
  const isHawk = y >= 0;
  const isConservative = z >= 0;

  let title = "";
  let description = "";
  let economicAnalysis = "";
  let nationalAnalysis = "";
  let religiousAnalysis = "";

  if (isRight) {
    economicAnalysis = x > 5 ? "אתה דוגל בקפיטליזם מובהק, שוק חופשי ללא התערבות, הפרטה וצמצום מיסים." : "אתה נוטה לכלכלת שוק חופשי עם הבנה לצורך ברשת ביטחון בסיסית.";
    if (isHawk) {
      title = isConservative ? "ימין לאומי-שמרני" : "ימין לאומי-ליברלי";
      description = "אתה מאמין בשילוב של עוצמה צבאית, ריבונות יהודית וחופש כלכלי.";
      nationalAnalysis = "גישה ביטחונית תקיפה, תמיכה בהתיישבות וראיית הכוח כמרכיב הכרחי להרתעה.";
      religiousAnalysis = isConservative ? "שמירה על זהותה היהודית של המדינה וכיבוד ערכי המסורת במרחב הציבורי." : "תמיכה במדינה יהודית לצד חופש דת וצמצום כפייה.";
    } else {
      title = isConservative ? "ימין פרגמטי-שמרני" : "ליברטריאניזם / ימין ליברלי";
      description = "החופש האישי והכלכלי עומדים בראש סדר העדיפויות שלך.";
      nationalAnalysis = "נכונות לפשרות טריטוריאליות או פרגמטיזם מדיני כל עוד נשמר החופש הכלכלי.";
      religiousAnalysis = isConservative ? "שמרנות חברתית ומסורתיות." : "ליברליזם חברתי מלא, הפרדת דת ומדינה וחופש הפרט.";
    }
  } else {
    economicAnalysis = x < -5 ? "אתה דוגל בסוציאליזם מובהק, מדינת רווחה רחבה, צמצום פערים אגרסיבי והלאמה." : "אתה תומך במודל סוציאל-דמוקרטי המשלב שוק חופשי עם פיקוח ממשלתי הדוק.";
    if (isHawk) {
      title = isConservative ? "שמאל ביטחוני-שמרני" : "שמאל ביטחוני-ליברלי";
      description = "שילוב ייחודי של עמדות חברתיות-כלכליות משמאל עם תפיסת עולם ביטחונית ניצית.";
      nationalAnalysis = "למרות עמדותיך החברתיות, אתה מחזיק בגישה חשדנית כלפי הסדרים מדיניים ותומך ביד קשה מול הטרור.";
      religiousAnalysis = isConservative ? "חיבור למסורת וערכים קהילתיים שמרניים." : "קידום ערכים ליברליים וזכויות מיעוטים.";
    } else {
      title = isConservative ? "שמאל חברתי-מסורתי" : "שמאל ליברלי / סוציאל-דמוקרטיה";
      description = "חתירה לשוויון חברתי, צדק חלוקתי ופשרה מדינית מול השכנים.";
      nationalAnalysis = "אמונה בפתרון שתי המדינות, דיפלומטיה וראיית הכיבוש כנטל מוסרי וביטחוני.";
      religiousAnalysis = isConservative ? "זהות יהודית תרבותית ומסורתית לצד ערכי שוויון." : "חילוניות מובהקת, שוויון מגדרי מלא והפרדת דת ומדינה.";
    }
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