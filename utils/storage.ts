import { SavedResult } from '../types';

const STORAGE_KEY = 'political_compass_result_v1';

export const saveResult = (result: SavedResult): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.error('Failed to save result:', error);
  }
};

export const getSavedResult = (): SavedResult | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as SavedResult;
  } catch (error) {
    console.error('Failed to load result:', error);
    return null;
  }
};

export const hasSavedResult = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const clearSavedResult = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
