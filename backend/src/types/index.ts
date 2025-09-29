export interface VideoGenerationRequest {
  name: string;
  phone: string;
  country: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    audioUrl?: string;
    finalVideoUrl?: string;
  };
  error?: string;
}

export interface ElevenLabsConfig {
  voiceId: string;
  modelId: string;
  outputFormat: string;
}

export interface SyncLabsJob {
  id: string;
  status: string;
  outputUrl?: string;
}
