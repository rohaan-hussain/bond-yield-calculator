export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  globalPrefix: 'api',
  cors: true,
} as const;
