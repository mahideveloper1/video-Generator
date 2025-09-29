import twilio from 'twilio';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(config.twilioAccountSid, config.twilioAuthToken);
  }

  async sendVideo(phoneNumber: string, videoUrl: string, name: string): Promise<void> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `Hi ${name}! 🎥 Your personalized video is ready! Check it out: ${videoUrl}`;

      logger.info('Sending WhatsApp message:', { phone: formattedPhone, name });

      await this.client.messages.create({
        from: `whatsapp:${config.twilioWhatsAppNumber}`,
        to: `whatsapp:${formattedPhone}`,
        body: message,
      });

      logger.info('WhatsApp message sent successfully:', { phone: formattedPhone });
    } catch (error) {
      logger.error('WhatsApp API error:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters except +
    let formatted = phone.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!formatted.startsWith('+')) {
      formatted = `+${formatted}`;
    }
    
    return formatted;
  }
}
