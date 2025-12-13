import { Coordinates, AnalysisResult, Answer } from "../types";

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

// Helper to get readable score text
const getReadableScore = (score: number) => {
  switch (score) {
    case 2: return "מסכים בהחלט (2)";
    case 1: return "מסכים (1)";
    case 0: return "ניטרלי (0)";
    case -1: return "לא מסכים (-1)";
    case -2: return "מתנגד בהחלט (-2)";
    default: return `${score}`;
  }
};

export const reportResult = async (coords: Coordinates, analysis: AnalysisResult, extraData?: AnalyticsData) => {
  // This URL should be your Google Apps Script Web App URL
  const reportingUrl = process.env.REPORTING_URL;
  
  if (!reportingUrl) {
    console.warn("Reporting URL is not configured");
    return;
  }

  console.log("Attempting to report results to Google Sheets...");
  
  try {
    // Format answers: Sort by ID for consistency and use readable text with newlines
    const answersString = extraData?.answers
      ? [...extraData.answers]
          .sort((a, b) => a.questionId - b.questionId)
          .map(a => `שאלה ${a.questionId}: ${getReadableScore(a.score)}`)
          .join('\n')
      : "";

    const utm = getUtmParams();
    const isMobile = window.innerWidth < 768;

    const payload = {
      timestamp: new Date().toISOString(),
      // User Identity
      userName: extraData?.userName || "Anonymous",
      userEmail: extraData?.userEmail || "",        
      comparedWith: extraData?.comparedWith || "",
      
      // Results
      x: coords.x,
      y: coords.y,
      quadrant: getQuadrantName(coords.x, coords.y),
      distanceFromCenter: calculateDistanceFromCenter(coords.x, coords.y), // Metric for "Extremism"
      title: analysis.title,
      description: analysis.description ? analysis.description.substring(0, 500) : "",
      
      // Quiz Data
      duration: extraData?.duration || 0,
      answers: answersString,
      
      // Technical / Marketing Data
      referrer: document.referrer || "Direct", // Where did they come from?
      utm_source: utm.source,
      utm_medium: utm.medium,
      deviceType: isMobile ? "Mobile" : "Desktop",
      language: navigator.language || "Unknown",
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      platform: navigator.platform || "Unknown",
      cores: navigator.hardwareConcurrency || "Unknown" // Can indicate device power/age
    };

    // Google Apps Script Web Apps have strict CORS policies.
    // We use 'no-cors' which allows the request to be sent, but we cannot read the response.
    // CRITICAL: We MUST use 'text/plain' as Content-Type for the body to be sent correctly in no-cors mode.
    // The Google Script blindly parses the postData.contents, so this works perfectly.
    await fetch(reportingUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    });
    
    console.log("Result report sent successfully (no-cors mode). Please check your Google Sheet.");
  } catch (error) {
    console.error("Reporting failed with error:", error);
  }
};