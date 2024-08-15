import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { reactionService } from '@service/db/reaction.service';

const log: Logger = config.createLogger('reactionWorker');

class ReactionWorker {
  async addReactionToDB(job: Job): Promise<void> {
    try {
      const { data } = job;
      await reactionService.addReactionDataToDB(data);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async removeReactionFromDB(job: Job): Promise<void> {
    try {
      const { data } = job;
      await reactionService.removeReactionDataFromDB(data);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const reactionWorker: ReactionWorker = new ReactionWorker();
