import { Injectable, Logger } from '@nestjs/common';
import firebaseAdmin from '../config/firebase';
import { UserDocument } from '../user/user.schema'; // Adjust path if needed

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendPushNotificationToUsers(
    users: UserDocument[],
    title: string,
    message: string
  ): Promise<void> {
    const tokens = users
      .map(user => user.notificationToken)
      .filter(token => !!token); // Remove empty/null/undefined

    if (tokens.length === 0) {
      this.logger.warn('❌ No valid notification tokens found for users.');
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
      this.logger.log(`📲 Sending push notification to ${tokens.length} user(s)...`);

      const response = await firebaseAdmin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });

      this.logger.log(`✅ Notifications sent: ${response.successCount} succeeded, ${response.failureCount} failed.`);

      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.logger.warn(`⚠️ Token ${tokens[idx]} failed: ${resp.error?.message}`);
          }
        });
      }
    } catch (error) {
      this.logger.error('🔥 Error sending push notifications:', error);
    }
  }
}
