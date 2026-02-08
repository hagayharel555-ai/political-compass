import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // The URL generated from the Google Apps Script deployment (Existing Summary Sheet)
  const REPORTING_URL = "https://script.google.com/macros/s/AKfycbw6w7yflyr-23z4JHDbit3pRAdqRRpgi2wNV4IVGeCgLDBsjlc4LRXo9Pd_OV13Dsui/exec";
  
  // URL for the NEW spreadsheet (Long format: User | Question | Answer)
  // Replace this empty string with your new Web App URL
  const LONG_FORMAT_REPORTING_URL = "https://script.google.com/macros/s/AKfycbwz8VLmcyRFbOw0-8dUNGwwRfPMW9U1pQ8W2CN-tHTyFlFxinw_lhkirD5XylwbBPgS/exec"; 

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Use the env var if it exists, otherwise use the hardcoded URL provided by the user
      'process.env.REPORTING_URL': JSON.stringify(env.REPORTING_URL || REPORTING_URL),
      'process.env.LONG_FORMAT_REPORTING_URL': JSON.stringify(env.LONG_FORMAT_REPORTING_URL || LONG_FORMAT_REPORTING_URL)
    }
  };
});