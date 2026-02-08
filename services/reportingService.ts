import { Coordinates, AnalysisResult, Answer } from "../types";
import { QUESTIONS } from "../constants";

interface AnalyticsData {
  duration: number;
  answers: Answer[];
  userName: string;
  userEmail: string;
  comparedWith?: string; // Name of the friend they compared against
}

// Helper to get UTM parameters
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
};

// Helper to calculate "Radicalism" (Distance from center 0,0)
const calculateDistanceFromCenter = (x: number, y: number): string => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2);
};

// Helper to determine Quadrant text
const getQuadrantName = (x: number, y: number): string => {
  if (x >= 0 && y >= 0) return "ימין-סמכותני";
  if (x >= 0 && y < 0) return "ימין-ליברלי";
  if (x < 0 && y >= 0) return "שמאל-סמכותני";
  if (x < 0 && y < 0) return "שמאל-ליברלי";
  return "מרכז";
};

// Helper to get readable score text (Simple)
const getReadableScore = (score: number) => {
  switch (score) {
    case 2: return "מסכים בהחלט";
    case 1: return "מסכים";
    case 0: return "ניטרלי";
    case -1: return "לא מסכים";
    case -2: return "מתנגד בהחלט";
    default: return `${score}`;
  }
};

// Helper to get formatted score with number for the long-format sheet
// Example: "מסכים (2)"
const getScoreWithNumber = (score: number) => {
  const scoreText = getReadableScore(score);
  return `${scoreText} (${score})`;
};

export const reportResult = async (coords: Coordinates, analysis: AnalysisResult, extraData?: AnalyticsData) => {
  const reportingUrl = process.env.REPORTING_URL;
  const longFormatUrl = process.env.LONG_FORMAT_REPORTING_URL;
  
  const utm = getUtmParams();
  const isMobile = window.innerWidth < 768;
  const timestamp = new Date().toISOString();

  // --- 1. Report to Main Spreadsheet (Summary View) ---
  if (reportingUrl) {
    try {
      // Format answers for summary: "Question: Answer" list in one cell
      const answersSummary = extraData?.answers
        ? [...extraData.answers]
            .sort((a, b) => a.questionId - b.questionId)
            .map(a => {
              const question = QUESTIONS.find(q => q.id === a.questionId);
              const questionText = question ? question.text : `שאלה ${a.questionId}`;
              return `${questionText}: ${getReadableScore(a.score)}`;
            })
            .join('\n')
        : "";

      const payload = {
        timestamp,
        userName: extraData?.userName || "Anonymous",
        userEmail: extraData?.userEmail || "",        
        comparedWith: extraData?.comparedWith || "",
        x: coords.x,
        y: coords.y,
        quadrant: getQuadrantName(coords.x, coords.y),
        distanceFromCenter: calculateDistanceFromCenter(coords.x, coords.y),
        title: analysis.title,
        description: analysis.description ? analysis.description.substring(0, 500) : "",
        duration: extraData?.duration || 0,
        answers: answersSummary,
        referrer: document.referrer || "Direct",
        utm_source: utm.source,
        utm_medium: utm.medium,
        deviceType: isMobile ? "Mobile" : "Desktop",
        language: navigator.language || "Unknown",
        screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      };

      fetch(reportingUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      }).catch(err => console.error("Main reporting failed:", err));
      
      console.log("Report sent to Main Sheet.");
    } catch (error) {
      console.error("Error preparing main report:", error);
    }
  }

  // --- 2. Report to Long-Format Spreadsheet (Row per Answer) ---
  if (longFormatUrl && extraData?.answers) {
    try {
      // Create an array of rows. 
      // The Google Script at 'longFormatUrl' must be written to accept a JSON ARRAY and loop through it.
      const rows = extraData.answers.map(ans => {
        const questionObj = QUESTIONS.find(q => q.id === ans.questionId);
        return {
          timestamp,
          userName: extraData.userName || "Anonymous",
          question: questionObj ? questionObj.text : `Question ${ans.questionId}`,
          answer: getScoreWithNumber(ans.score) // Format: "מסכים (2)"
        };
      });

      // We wrap it in an object structure just in case the script parses 'e.postData.contents' 
      // If your script expects a raw array, you can pass 'rows' directly. 
      // Here passing the array directly is usually standard for bulk uploads.
      fetch(longFormatUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(rows), // Sending the array of rows
      }).catch(err => console.error("Long-format reporting failed:", err));

      console.log("Report sent to Long-Format Sheet.");
    } catch (error) {
      console.error("Error preparing long-format report:", error);
    }
  }
};