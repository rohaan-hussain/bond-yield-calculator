export const config = {
  apiBaseUrl: `${import.meta.env.VITE_BACKEND_URL ?? ''}/api`,
} as const;
