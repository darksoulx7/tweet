import Logger from 'bunyan';
import { Job } from 'bullmq';
import { config } from '@root/config';
import { notificationService } from '@service/db/notification.service';

const log: Logger = config.createLogger('notificationWorker');

class NotificationWorker {
  async updateNotification(job: Job): Promise<void> {
    try {
      const { key } = job.data;
      await notificationService.updateNotification(key);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async deleteNotification(job: Job): Promise<void> {
    try {
      const { key } = job.data;
      await notificationService.deleteNotification(key);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const notificationWorker: NotificationWorker = new NotificationWorker();
