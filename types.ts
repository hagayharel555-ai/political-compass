
export enum Axis {
  ECONOMIC = 'economic',        // X-axis: -10 (Left) to +10 (Right)
  NATIONAL_SECURITY = 'national', // Y-axis: -10 (Dove) to +10 (Hawk)
  SOCIAL_CULTURAL = 'social',    // Z-axis: -10 (Progressive) to +10 (Conservative)
  CONSERVATISM = 'conservatism'  // Supplemental Z-axis questions
}

export interface Question {
  id: number;
  text: string;
  axis: Axis;
  direction: 1 | -1; 
}

export interface Answer {
  questionId: number;
  score: number; 
}

export interface Coordinates {
  x: number;
  y: number;
  z: number; // Added Z axis for the social metric
}

export interface AnalysisResult {
  title: string;
  description: string;
  ideology: string;
  economicAnalysis: string;
  nationalAnalysis: string;
  religiousAnalysis: string;
  socialAnalysis?: string; // Analysis for the new axis
}

export interface SavedResult {
  coordinates: Coordinates;
  analysis: AnalysisResult;
  timestamp: number;
  userName?: string;
  userEmail?: string;
}