import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  
  // ElevenLabs
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY!,
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',
  
  // SyncLabs
  syncLabsApiKey: process.env.SYNCLABS_API_KEY!,
  baseVideoUrl: process.env.BASE_VIDEO_URL || 'https://assets.sync.so/docs/example-video.mp4',
  
  // Twilio
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID!,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN!,
  twilioWhatsAppNumber: process.env.TWILIO_WHATSAPP_NUMBER!,
  
  // Server
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
};
