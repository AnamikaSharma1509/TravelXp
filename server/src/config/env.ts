import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5434/travelxp',
  jwtSecret: process.env.JWT_SECRET || 'travelxp-jwt-secret-key-2026-production',
  jwtExpiresIn: '7d',
  sessionSecret: process.env.SESSION_SECRET || 'travelxp-session-secret-2026',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  emailApiKey: process.env.EMAIL_PROVIDER_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@travelxp.local',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
};
