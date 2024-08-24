import { BaseQueue } from './base.queue';
import { postWorker } from '@worker/post.worker';
import { IPostJobData } from '@post/interfaces/post.interface';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';
class PostQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const addPostQueue = new PostQueue('addPostQueue', 'addPostToDB', CONCURRENCY_LIMIT, postWorker.savePostToDB);
export const deletePostQueue = new PostQueue('deletePostQueue', 'deletePostFromDB', CONCURRENCY_LIMIT, postWorker.deletePostFromDB);
export const updatePostQueue = new PostQueue('updatePostQueue', 'updatePostInDB', CONCURRENCY_LIMIT, postWorker.updatePostInDB);

// export function addPostJob(postData: IPostJobData): void {
//   addPostQueue.addPostJob('addPostToDB', postData);
// }

// export function deletePostJob(postData: IPostJobData): void {
//   deletePostQueue.addPostJob('deletePostFromDB', postData);
// }

// export function updatePostJob(postData: IPostJobData): void {
//   updatePostQueue.addPostJob('updatePostInDB', postData);
// }
