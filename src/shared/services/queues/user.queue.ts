import { userService } from '@service/db/user.service';
import { BaseQueue } from './base.queue';

import { userWorker } from '@service/workers/user.worker';
import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('userWorker');
class UserQueue extends BaseQueue {
    constructor() {
        super('user');
        this.processJob('addUserToDB', 5, userWorker.addUserToDB);
    }

    public addUserJob(name: string, data: any) {
        this.addJob(name, data);
    }


    async updateUserInfo(job: Job): Promise<void> {
        try {
          const { key, value } = job.data;
          await userService.updateUserInfo(key, value);
          job.updateProgress(100);
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

export const userQueue: UserQueue = new UserQueue();
