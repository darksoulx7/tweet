import Logger from 'bunyan';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Job, Queue as QueueMQ, QueueEvents, Worker } from 'bullmq';
import { IPostJobData } from '@post/interfaces/post.interface';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ICommentJob } from '@comment/interfaces/comment.interface';
import {
  IBlockedUserJobData,
  IFollowerJobData,
} from '@follower/interfaces/follower.interface';
import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { IFileImageJobData } from '@image/interfaces/image.interface';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';

type IBaseJobData =
  | IAuthJob
  | IEmailJob
  | IPostJobData
  | IReactionJob
  | ICommentJob
  | IFollowerJobData
  | IBlockedUserJobData
  | INotificationJobData
  | IFileImageJobData
  | IChatJobData
  | IMessageData
  | IUserJob;

let bullAdapters: BullMQAdapter[] = [];
export let serverAdapter: ExpressAdapter;

const sleep = (t: number) =>
  new Promise((resolve) => setTimeout(resolve, t * 1000));

export abstract class BaseQueue {
  queue: QueueMQ;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new QueueMQ(queueName, {
      connection: { port: 6379, password: '', host: 'localhost' },
    });
    bullAdapters.push(new BullMQAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter,
    });

    this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('removed', (job) => {
      job.remove();
    });

    this.queue.on('error', (err) => {
      this.log.info(`${queueName} - err Job ${err} completed`);
    });

    this.queue.on('progress', (job: Job<IBaseJobData>) => {
      this.log.info(`${queueName} - Queue Job ${job.id} is in progress`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 },
    });
  }

  protected processJob(name: string, concurrency: number, callback: any): void {
    const worker = new Worker(
      this.queue.name,
      async (job: Job<IBaseJobData>) => {
        try {
          await callback(job);
          this.log.info(
            `${name} - worker job ${job.id} has been processed successfully`,
          );
        } catch (error) {
          this.log.error(`Error processing job ${job.id}: ${error}`);
          throw error;
        }
      },
      { concurrency },
    );

    worker.on('completed', (job: Job) => {
      this.log.info(`${name} - worker job ${job.id} completed`);
      job.remove();
    });

    worker.on('failed', (job: Job | undefined, error: Error) => {
      this.log.info(
        `${name} - worker job ${job?.id} failed with error ${error.message}`,
      );
    });

    worker.on(
      'progress',
      (job: Job<IBaseJobData>, progress: number | object) => {
        this.log.info(
          `${name} - worker job ${job.id} is ${progress}% complete`,
        );
      },
    );
  }
}
