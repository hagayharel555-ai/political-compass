import { Coordinates, AnalysisResult } from "../types";

export const reportResult = async (coords: Coordinates, analysis: AnalysisResult) => {
  // This URL should be your Google Apps Script Web App URL
  const reportingUrl = process.env.REPORTING_URL;
  
  if (!reportingUrl) return;

  try {
    // We use payload construction to ensure clean data
    const payload = {
      timestamp: new Date().toISOString(),
      x: coords.x,
      y: coords.y,
      title: analysis.title,
      // We truncate description to avoid huge cells in sheets if necessary
      description: analysis.description.substring(0, 500),
      // Basic analytics (optional)
      userAgent: navigator.userAgent
    };

    // 'no-cors' mode is essential for posting to Google Scripts from a browser
    // It means we can write data, but we won't get a readable response confirmation (which is fine for logging)
    await fetch(reportingUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log("Result reported securely.");
  } catch (error) {
    // Fail silently so the user experience isn't affected
    console.error("Reporting failed", error);
  }
};