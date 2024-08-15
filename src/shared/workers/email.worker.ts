import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { mailTransport } from '@service/emails/mail.transport';

const log: Logger = config.createLogger('emailWorker');

class EmailWorker {
  async addNotificationEmail(job: Job): Promise<void> {
    try {
      const { template, receiverEmail, subject } = job.data;
      await mailTransport.sendEmail(receiverEmail, subject, template);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
