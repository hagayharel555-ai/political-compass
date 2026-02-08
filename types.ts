export enum Axis {
  ECONOMIC = 'economic',        // X-axis: -10 (Left) to +10 (Right)
  NATIONAL_SECURITY = 'national', // Y-axis: -10 (Dove) to +10 (Hawk)
  SOCIAL_CULTURAL = 'social',    // Legacy Z-axis (kept for compatibility)
  CONSERVATISM = 'conservatism',  // Z-axis: Progressive vs Conservative
  CIVIL_LIBERTY = 'civil_liberty' // New Axis: Libertarian vs Authoritarian
}

// ממשק חדש להגדרת השפעה (ציר + משקל)
export interface Effect {
  axis: Axis;
  weight: number; 
}

export interface Question {
  id: number;
  text: string;
  effects: Effect[]; // שינוי: רשימה של השפעות במקום axis/direction בודדים
}

export interface Answer {
  questionId: number;
  score: number; 
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
  liberty: number; // הוספת ציר החירות לתוצאות
}

export interface AnalysisResult {
  title: string;
  description: string;
  ideology: string;
  economicAnalysis: string;
  nationalAnalysis: string;
  religiousAnalysis: string;
  socialAnalysis?: string;
  libertyAnalysis?: string; // הוספת מקום לניתוח חירות
}

export interface SavedResult {
  coordinates: Coordinates;
  analysis: AnalysisResult;
  timestamp: number;
  userName?: string;
  userEmail?: string;
}