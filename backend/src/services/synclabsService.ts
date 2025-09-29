import { SyncClient } from '@sync.so/sdk';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { SyncLabsJob } from '../types';

export class SyncLabsService {
  private client: SyncClient;

  constructor() {
    this.client = new SyncClient({ apiKey: config.syncLabsApiKey });
  }

  async createLipSyncJob(audioUrl: string): Promise<string> {
    try {
      logger.info('Creating SyncLabs job:', { audioUrl, videoUrl: config.baseVideoUrl });

      const response = await this.client.generations.create({
        input: [
          {
            type: 'video',
            url: config.baseVideoUrl,
          },
          {
            type: 'audio',
            url: audioUrl,
          },
        ],
        model: 'lipsync-2',
        options: {
          sync_mode: 'cut_off',
        },
        outputFileName: `personalized-video-${Date.now()}`
      });

      logger.info('SyncLabs job created:', { jobId: response.id });
      return response.id;
    } catch (error) {
      logger.error('SyncLabs API error:', error);
      throw new Error('Failed to create lip-sync job');
    }
  }

  async getJobStatus(jobId: string): Promise<SyncLabsJob> {
    try {
      const generation = await this.client.generations.get(jobId);
      
      return {
        id: generation.id,
        status: generation.status,
        outputUrl: generation.outputUrl || undefined,
      };
    } catch (error) {
      logger.error('SyncLabs status check error:', error);
      throw new Error('Failed to check job status');
    }
  }

  async waitForCompletion(jobId: string, maxAttempts: number = 60): Promise<string> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const status = await this.getJobStatus(jobId);
        
        logger.info(`SyncLabs job status (attempt ${attempt}):`, status);

        if (status.status === 'COMPLETED' && status.outputUrl) {
          return status.outputUrl;
        } else if (status.status === 'FAILED' || status.status === 'REJECTED') {
          throw new Error(`SyncLabs job failed with status: ${status.status}`);
        }

        // Wait 10 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        logger.warn(`SyncLabs status check failed (attempt ${attempt}):`, error);
      }
    }

    throw new Error('SyncLabs job timed out');
  }
}
