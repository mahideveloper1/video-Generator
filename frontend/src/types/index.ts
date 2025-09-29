export interface FormData {
  name: string;
  phone: string;
  country: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  data?: {
    jobId: string;
    status: string;
    audioUrl?: string;
    finalVideoUrl?: string;
  };
  error?: string;
}