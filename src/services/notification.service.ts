import { Injectable, Logger } from '@nestjs/common';
import firebaseAdmin from '../config/firebase';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendPushNotification(tokens: string[], title: string, message: string): Promise<void> {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('❌ No tokens provided for push notification.');
      return;
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        sound: 'default',
      },
    };

    try {
      this.logger.log(`📲 Sending push notification to: ${tokens.join(', ')}`);
      
      const response = await firebaseAdmin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });

      this.logger.log(`✅ Successfully sent message: ${JSON.stringify(response)}`);
      
      if (response.failureCount > 0) {
        this.logger.warn(`⚠️ Some messages failed to send:`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.logger.warn(`Token ${tokens[idx]} failed: ${resp.error?.message}`);
          }
        });
      }
    } catch (error) {
      this.logger.error('🔥 Error sending push notification:', error);
    }
  }
}
