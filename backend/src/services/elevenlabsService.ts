// src/services/elevenlabsService.ts (CORRECTED VERSION)
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class ElevenLabsService {
  private client: ElevenLabsClient;

  constructor() {
    this.client = new ElevenLabsClient({ apiKey: config.elevenLabsApiKey });
  }

  async generateAudio(text: string): Promise<Buffer> {
    try {
      logger.info('Generating audio with ElevenLabs:', { text: text.substring(0, 100) });

      const audioStream = await this.client.textToSpeech.convert(config.elevenLabsVoiceId, {
        text,
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      });

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.from(chunk));
      }
      
      const audioBuffer = Buffer.concat(chunks);
      logger.info('Audio generated successfully:', { size: audioBuffer.length });
      
      return audioBuffer;
    } catch (error) {
      logger.error('ElevenLabs API error:', error);
      throw new Error('Failed to generate audio');
    }
  }

  generatePersonalizedText(name: string, country: string): string {
    return `Hello ${name}! Welcome to our amazing video generation service. We're excited to have you here from ${country}. This personalized video was created just for you using advanced AI technology. We hope you enjoy this unique experience tailored specifically to your preferences. Thank you for choosing our service, ${name}!`;
  }
}