// Constants for use in both server and client components
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DocuTrack";
export const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/images/logo.png";

// Client-side config
export const config = {
  appName: APP_NAME,
  logoUrl: LOGO_URL,
} as const;
