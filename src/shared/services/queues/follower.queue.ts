import { IFollowerJobData } from '@follower/interfaces/follower.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { followerWorker } from '@worker/follower.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class FollowerQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addFollowerJob(name: string, data: IFollowerJobData): void {
    this.addJob(name, data);
  }
}

export const addFollowerQueue = new FollowerQueue('AddFollowerQueue', 'addFollowerToDB', CONCURRENCY_LIMIT, followerWorker.addFollowerToDB);
export const removeFollowerQueue = new FollowerQueue('RemoveFollowerQueue', 'removeFollowerFromDB', CONCURRENCY_LIMIT, followerWorker.removeFollowerFromDB);

// export function addFollower(followerData: IFollowerJobData): void {
//   addFollowerQueue.addFollowerJob('addFollowerToDB', followerData);
// }

// export function removeFollower(followerData: IFollowerJobData): void {
//   removeFollowerQueue.addFollowerJob('removeFollowerFromDB', followerData);
// }
