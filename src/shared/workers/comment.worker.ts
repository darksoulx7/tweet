import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { commentService } from '@service/db/comment.service';

const log: Logger = config.createLogger('commentWorker');

class CommentWorker {
  async addCommentToDB(job: Job): Promise<void> {
    try {
      const { data } = job;
      await commentService.addCommentToDB(data);
      job.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const commentWorker: CommentWorker = new CommentWorker();
