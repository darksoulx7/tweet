import Logger from 'bunyan';
import { config } from '@root/config';
import { followerService } from '@service/db/follower.service';
import { Job } from 'bullmq';

const log: Logger = config.createLogger('followerWorker');

class FollowerWorker {
  async addFollowerToDB(job: Job): Promise<void> {
    try {
      const { keyOne, keyTwo, username, followerDocumentId } = job.data;
      await followerService.addFollowerToDB(keyOne, keyTwo, username, followerDocumentId);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async removeFollowerFromDB(job: Job): Promise<void> {
    try {
      const { keyOne, keyTwo } = job.data;
      await followerService.removeFollowerFromDB(keyOne, keyTwo);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const followerWorker: FollowerWorker = new FollowerWorker();
