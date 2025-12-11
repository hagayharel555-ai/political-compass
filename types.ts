export enum Axis {
  ECONOMIC = 'economic', // X-axis: -10 (Left) to +10 (Right)
  SOCIAL = 'social',     // Y-axis: -10 (Libertarian) to +10 (Authoritarian)
}

export interface Question {
  id: number;
  text: string;
  axis: Axis;
  direction: 1 | -1; // 1 means Agreement moves towards Positive (Right/Auth), -1 means Agreement moves towards Negative (Left/Lib)
}

export interface Answer {
  questionId: number;
  score: number; // -2 (Strongly Disagree) to +2 (Strongly Agree)
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface AnalysisResult {
  title: string;
  description: string;
  ideology: string;
}

export interface SavedResult {
  coordinates: Coordinates;
  analysis: AnalysisResult;
  timestamp: number;
}
