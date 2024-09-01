import { IBlockedUserJobData } from '@follower/interfaces/follower.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { blockedUserWorker } from '@worker/blocked.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class BlockedUserQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addBlockedUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const addBlockedUserQueue = new BlockedUserQueue('BlockedUsersQueue', 'addBlockedUserToDB', CONCURRENCY_LIMIT, blockedUserWorker.addBlockedUserToDB);
// export const removeBlockedUserQueue = new BlockedUserQueue('RemoveBlockedUserQueue', 'removeBlockedUserFromDB', CONCURRENCY_LIMIT, blockedUserWorker.removeBlockedUserFromDB);


// export function addBlockedUser(userData: IBlockedUserJobData): void {
//   addBlockedUserQueue.addBlockedUserJob('addBlockedUserToDB', userData);
// }

// export function removeBlockedUser(userData: IBlockedUserJobData): void {
//   removeBlockedUserQueue.addBlockedUserJob('removeBlockedUserFromDB', userData);
// }
