import { Coordinates, AnalysisResult } from "../types";

export const reportResult = async (coords: Coordinates, analysis: AnalysisResult) => {
  // This URL should be your Google Apps Script Web App URL
  const reportingUrl = process.env.REPORTING_URL;
  
  if (!reportingUrl) {
    console.warn("Reporting URL is not configured");
    return;
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      x: coords.x,
      y: coords.y,
      title: analysis.title,
      description: analysis.description ? analysis.description.substring(0, 500) : "",
      userAgent: navigator.userAgent
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
    
    console.log("Result reported securely.");
  } catch (error) {
    console.error("Reporting failed", error);
  }
};