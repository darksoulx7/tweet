import { IUserJob } from '@user/interfaces/user.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { userWorker } from '@worker/user.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class UserQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addUserJob(name: string, data: IUserJob): void {
    this.addJob(name, data);
  }
}

export const addUserQueue = new UserQueue('AddUserQueue', 'addUserToDB', CONCURRENCY_LIMIT, userWorker.addUserToDB);
export const updateSocialLinksQueue = new UserQueue('UpdateSocialLinksQueue', 'updateSocialLinksInDB', CONCURRENCY_LIMIT, userWorker.updateSocialLinks);
export const updateBasicInfoQueue = new UserQueue('UpdateBasicInfoQueue', 'updateBasicInfoInDB', CONCURRENCY_LIMIT, userWorker.updateUserInfo);
export const updateNotificationSettingsQueue = new UserQueue('UpdateNotificationSettingsQueue', 'updateNotificationSettings', CONCURRENCY_LIMIT, userWorker.updateNotificationSettings);
