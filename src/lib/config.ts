// src/lib/config.ts
import { browser } from '$app/environment';

const isProd = !browser || import.meta.env.PROD;

// Function to get required environment variables
const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key] || import.meta.env[key];
  if (!value && isProd) {
    console.error(`Missing required environment variable: ${key}`);
    return ''; // Return empty string instead of throwing an error
  }
  return value || '';
};

// Export configuration constants
export const APP_NAME = getRequiredEnvVar('PUBLIC_APP_NAME') || 'DocumentTracker';
export const APP_URL = getRequiredEnvVar('PUBLIC_APP_URL') || 'http://localhost:3000';
export const AUTHORIZER_URL = getRequiredEnvVar('PUBLIC_AUTHORIZER_URL');
export const CLIENT_ID = getRequiredEnvVar('PUBLIC_AUTHORIZER_CLIENT_ID');

// Log a warning if running in development mode with default values
if (!isProd) {
  console.warn('Running in development mode. Make sure to set all required environment variables in production.');
} else {
  // Check if any required variables are missing in production
  const missingVars = ['PUBLIC_APP_URL', 'PUBLIC_AUTHORIZER_URL', 'PUBLIC_AUTHORIZER_CLIENT_ID'].filter(
    key => !getRequiredEnvVar(key)
  );
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables in production: ${missingVars.join(', ')}`);
  }
}
