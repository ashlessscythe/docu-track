// Constants for use in both server and client components
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DocuTrack";

// Client-side config
export const config = {
  appName: APP_NAME,
} as const;
