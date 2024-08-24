import { ICommentJob } from '@comment/interfaces/comment.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { commentWorker } from '@worker/comment.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class CommentQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addCommentJob(name: string, data: ICommentJob): void {
    this.addJob(name, data);
  }
}

export const addCommentQueue = new CommentQueue('comments', 'addCommentToDB', CONCURRENCY_LIMIT, commentWorker.addCommentToDB);

// export function addComment(commentData: ICommentJob): void {
//   addCommentQueue.addCommentJob('addCommentToDB', commentData);
// }
