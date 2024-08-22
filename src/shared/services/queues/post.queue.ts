// import { IPostJobData } from '@post/interfaces/post.interface';
// import { BaseQueue } from '@service/queues/base.queue';
// import { postWorker } from '@worker/post.worker';

// class PostQueue extends BaseQueue {
//   constructor() {
//     super('posts');
//     this.processJob('addPostToDB', 1, postWorker.savePostToDB);
//     this.processJob('deletePostFromDB', 1, postWorker.deletePostFromDB);
//     // this.processJob('updatePostInDB', 5, postWorker.updatePostInDB);
//   }

//   public addPostJob(name: string, data: IPostJobData): void {
//     this.log.info(`Adding Post Job: ${name}`);
//     this.addJob(name, data);
//   }
// }

// export const postQueue: PostQueue = new PostQueue();

import { BaseQueue } from './base.queue';
import { postWorker } from '@worker/post.worker';
import { IPostJobData } from '@post/interfaces/post.interface';
import { Queue as QueueMQ } from 'bullmq'
export class AddPostQueue extends BaseQueue {
  constructor() {
    super('addPostQueue', new QueueMQ('addPostQueue', { connection: { port: 6379, password: '', host: 'localhost' } }));
    this.processJob('addPostToDB', 5, postWorker.savePostToDB);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export class DeletePostQueue extends BaseQueue {
  constructor() {
    super('deletePostQueue', new QueueMQ('deletePostQueue', { connection: { port: 6379, password: '', host: 'localhost' } }));
    this.processJob('deletePostFromDB', 5, postWorker.deletePostFromDB);
  }

  public deletePostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

// Create instances
export const addPostQueue: AddPostQueue = new AddPostQueue();
export const deletePostQueue: DeletePostQueue = new DeletePostQueue();  