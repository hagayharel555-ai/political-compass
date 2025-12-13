import { Coordinates, AnalysisResult, Answer } from "../types";

interface AnalyticsData {
  duration: number;
  answers: Answer[];
  userName: string;
  userEmail: string;
  comparedWith?: string; // Name of the friend they compared against
}

export const reportResult = async (coords: Coordinates, analysis: AnalysisResult, extraData?: AnalyticsData) => {
  // This URL should be your Google Apps Script Web App URL
  const reportingUrl = process.env.REPORTING_URL;
  
  if (!reportingUrl) {
    console.warn("Reporting URL is not configured");
    return;
  }

  console.log("Attempting to report results to Google Sheets...");
  
  try {
    // Format answers into a compact string like "1:2, 2:-1, 3:0" (QuestionID : Score)
    const answersString = extraData?.answers
      ? extraData.answers.map(a => `${a.questionId}:${a.score}`).join(', ')
      : "";

    const payload = {
      timestamp: new Date().toISOString(),
      userName: extraData?.userName || "Anonymous",
      userEmail: extraData?.userEmail || "",        
      comparedWith: extraData?.comparedWith || "", // New Field sent to sheet
      x: coords.x,
      y: coords.y,
      title: analysis.title,
      description: analysis.description ? analysis.description.substring(0, 500) : "",
      userAgent: navigator.userAgent,
      duration: extraData?.duration || 0,
      answers: answersString,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`
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