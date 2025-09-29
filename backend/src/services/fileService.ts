import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class FileService {
  private uploadDir = path.join(process.cwd(), 'uploads', 'audio');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info('Created upload directory:', this.uploadDir);
    }
  }

  async saveAudioFile(audioBuffer: Buffer, userId: string): Promise<string> {
    try {
      const filename = `${userId}-${Date.now()}-${uuidv4()}.mp3`;
      const filepath = path.join(this.uploadDir, filename);
      
      await fs.writeFile(filepath, audioBuffer);
      
      const publicUrl = `${config.baseUrl}/audio/${filename}`;
      logger.info('Audio file saved:', { filepath, publicUrl });
      
      return publicUrl;
    } catch (error) {
      logger.error('Error saving audio file:', error);
      throw new Error('Failed to save audio file');
    }
  }

  async deleteAudioFile(audioUrl: string): Promise<void> {
    try {
      const filename = path.basename(audioUrl);
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
      logger.info('Audio file deleted:', filepath);
    } catch (error) {
      logger.warn('Error deleting audio file:', error);
    }
  }
}