import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // The URL generated from the Google Apps Script deployment
  const REPORTING_URL = "https://script.google.com/macros/s/AKfycbwfin0gD43LDtWEootai2bClAWq9dBRwiX0Hou0ixJfufdcJ0Rwhr22BhC0HiqD-IyA/exec";

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Use the env var if it exists, otherwise use the hardcoded URL provided by the user
      'process.env.REPORTING_URL': JSON.stringify(env.REPORTING_URL || REPORTING_URL)
    }
  };
});