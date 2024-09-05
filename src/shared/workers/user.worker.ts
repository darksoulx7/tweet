import { userService } from '@service/db/user.service';
import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('userWorker');

class UserWorker {
  async addUserToDB(job: Job): Promise<void> {
    try {
      const { value } = job.data;
      await userService.addUserData(value);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async updateUserInfo(job: Job): Promise<void> {
    try {
      const { key, value } = job.data;
      await userService.updateUserInfo(key, value);
    } catch (error) {
      log.error(error);
    }
  }

  async updateSocialLinks(job: Job): Promise<void> {
    try {
      const { key, value } = job.data;
      await userService.updateSocialLinks(key, value);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async updateNotificationSettings(job: Job): Promise<void> {
    try {
      const { key, value } = job.data;
      await userService.updateNotificationSettings(key, value);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
