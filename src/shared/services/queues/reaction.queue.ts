import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { reactionWorker } from '@worker/reaction.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class ReactionQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addReactionJob(name: string, data: IReactionJob): void {
    this.addJob(name, data);
  }
}

export const addReactionQueue = new ReactionQueue('reactions', 'addReactionToDB', CONCURRENCY_LIMIT, reactionWorker.addReactionToDB);
export const removeReactionQueue = new ReactionQueue('reactions', 'removeReactionFromDB', CONCURRENCY_LIMIT, reactionWorker.removeReactionFromDB);

// export function addReaction(reactionData: IReactionJob): void {
//   addReactionQueue.addReactionJob('addReactionToDB', reactionData);
// }

// export function removeReaction(reactionData: IReactionJob): void {
//   removeReactionQueue.addReactionJob('removeReactionFromDB', reactionData);
// }
