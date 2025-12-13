import { SavedResult } from '../types';

const STORAGE_KEY = 'political_compass_result_v1';
const USER_DETAILS_KEY = 'political_compass_user_details_v1';

export const saveResult = (result: SavedResult): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    
    // Also save user details separately for quick access on registration screen
    if (result.userName) {
        const userDetails = { name: result.userName, email: result.userEmail };
        localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(userDetails));
    }
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

export const getSavedUserDetails = (): { name: string, email: string } | null => {
    try {
        const data = localStorage.getItem(USER_DETAILS_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export const hasSavedResult = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const clearSavedResult = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  // We strictly do NOT clear user details here, so they don't have to re-type name next time
};