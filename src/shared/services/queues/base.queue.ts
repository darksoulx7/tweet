import Logger from 'bunyan'
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Job, Queue as QueueMQ, Worker } from 'bullmq';

type IBaseJobData =
    | IAuthJob
    | IEmailJob
    | IUserJob;

    let bullAdapters: BullMQAdapter[] = [];
    export let serverAdapter: ExpressAdapter;

const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t * 1000));

export abstract class BaseQueue {
    queue: QueueMQ;
    log: Logger;
  
    constructor(queueName: string) {
      this.queue = new QueueMQ(queueName, { connection: { port: 6379, password: '', host: 'localhost',}});
      bullAdapters.push(new BullMQAdapter(this.queue));
      bullAdapters = [...new Set(bullAdapters)];
      serverAdapter = new ExpressAdapter();
      serverAdapter.setBasePath('/queues');
  
      createBullBoard({
        queues: bullAdapters,
        serverAdapter
      });
  
      this.log = config.createLogger(`${queueName}Queue`);
  
      this.queue.on('removed', (job) => {
        job.remove()
      });
  
      this.queue.on('error', (err) => {
        this.log.info(`err Job ${err} completed`);
      });
  
      this.queue.on('progress', (job: Job<IBaseJobData>) => {
        this.log.info(`error Job ${job.id} is in progress`);
      });
    }
  
    protected addJob(name: string, data: IBaseJobData): void {
      this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
    }
  
    // protected processJob(name: string, concurrency: number, callback: ): void {
    //   this.queue.r (name, concurrency, callback);
    // }
  }