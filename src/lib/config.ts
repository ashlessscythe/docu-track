// src/lib/config.ts
import { env } from '$env/dynamic/public';

// Export configuration constants with defaults
export const APP_NAME = env.PUBLIC_APP_NAME || 'DocumentTracker';
export const API_URL = env.PUBLIC_API_URL || 'https://api.example.com';
export const APP_URL = env.PUBLIC_APP_URL || 'http://localhost:8000'
export const AUTHORIZER_URL = env.PUBLIC_AUTHORIZER_URL || 'https://your-authorizer-instance.com';
export const CLIENT_ID = env.PUBLIC_AUTHORIZER_CLIENT_ID || 'your-client-id';
// Add other environment variables as needed
