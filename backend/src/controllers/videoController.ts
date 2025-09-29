import { Request, Response } from 'express';
import { VideoGenerationRequest } from '../types';
import { ElevenLabsService } from '../services/elevenlabsService';
import { SyncLabsService } from '../services/synclabsService';
import { WhatsAppService } from '../services/whatsappService';
import { FileService } from '../services/fileService';
import { prisma } from '../models';
import { logger } from '../utils/logger';

export class VideoController {
  private elevenLabsService = new ElevenLabsService();
  private syncLabsService = new SyncLabsService();
  private whatsAppService = new WhatsAppService();
  private fileService = new FileService();

  async generateVideo(req: Request, res: Response): Promise<void> {
    const { name, phone, country }: VideoGenerationRequest = req.body;
    
    try {
      logger.info('Starting video generation:', { name, phone, country });

      // Create database record
      const videoGeneration = await prisma.videoGeneration.create({
        data: { name, phone, country, status: 'processing' },
      });

      // Process asynchronously
      this.processVideoGeneration(videoGeneration.id, name, phone, country);

      res.json({
        success: true,
        data: {
          id: videoGeneration.id,
          status: 'processing',
        },
      });
    } catch (error) {
      logger.error('Error starting video generation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start video generation',
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const videoGeneration = await prisma.videoGeneration.findUnique({
        where: { id },
      });

      if (!videoGeneration) {
        res.status(404).json({ success: false, error: 'Video generation not found' });
        return;
      }

      res.json({
        success: true,
        data: {
          id: videoGeneration.id,
          status: videoGeneration.status,
          audioUrl: videoGeneration.audioUrl,
          finalVideoUrl: videoGeneration.finalVideoUrl,
          error: videoGeneration.errorMessage,
        },
      });
    } catch (error) {
      logger.error('Error getting status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get status',
      });
    }
  }

  private async processVideoGeneration(
    id: string,
    name: string,
    phone: string,
    country: string
  ): Promise<void> {
    try {
      // Step 1: Generate audio with ElevenLabs
      logger.info('Step 1: Generating audio', { id });
      const text = this.elevenLabsService.generatePersonalizedText(name, country);
      const audioBuffer = await this.elevenLabsService.generateAudio(text);
      const audioUrl = await this.fileService.saveAudioFile(audioBuffer, id);

      await prisma.videoGeneration.update({
        where: { id },
        data: { audioUrl, status: 'audio_generated' },
      });

      // Step 2: Create SyncLabs lip-sync job
      logger.info('Step 2: Creating lip-sync job', { id });
      const syncJobId = await this.syncLabsService.createLipSyncJob(audioUrl);

      await prisma.videoGeneration.update({
        where: { id },
        data: { syncLabsJobId: syncJobId, status: 'syncing' },
      });

      // Step 3: Wait for SyncLabs completion
      logger.info('Step 3: Waiting for lip-sync completion', { id, syncJobId });
      const finalVideoUrl = await this.syncLabsService.waitForCompletion(syncJobId);

      await prisma.videoGeneration.update({
        where: { id },
        data: { finalVideoUrl, status: 'video_ready' },
      });

      // Step 4: Send WhatsApp message
      logger.info('Step 4: Sending WhatsApp message', { id });
      await this.whatsAppService.sendVideo(phone, finalVideoUrl, name);

      await prisma.videoGeneration.update({
        where: { id },
        data: { status: 'completed' },
      });

      logger.info('Video generation completed successfully', { id });

      // Cleanup: Delete local audio file
      await this.fileService.deleteAudioFile(audioUrl);
    } catch (error) {
      logger.error('Error in video generation process:', { id, error });
      
      await prisma.videoGeneration.update({
        where: { id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}
