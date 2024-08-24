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

export const addUserQueue = new UserQueue('user', 'addUserToDB', CONCURRENCY_LIMIT, userWorker.addUserToDB);
export const updateSocialLinksQueue = new UserQueue('user', 'updateSocialLinksInDB', CONCURRENCY_LIMIT, userWorker.updateSocialLinks);
export const updateBasicInfoQueue = new UserQueue('user', 'updateBasicInfoInDB', CONCURRENCY_LIMIT, userWorker.updateUserInfo);
export const updateNotificationSettingsQueue = new UserQueue('user', 'updateNotificationSettings', CONCURRENCY_LIMIT, userWorker.updateNotificationSettings);

// export function addUser(userData: IUserJob): void {
//   addUserQueue.addUserJob('addUserToDB', userData);
// }

// export function updateSocialLinks(userData: IUserJob): void {
//   updateSocialLinksQueue.addUserJob('updateSocialLinksInDB', userData);
// }

// export function updateBasicInfo(userData: IUserJob): void {
//   updateBasicInfoQueue.addUserJob('updateBasicInfoInDB', userData);
// }

// export function updateNotificationSettings(userData: IUserJob): void {
//   updateNotificationSettingsQueue.addUserJob('updateNotificationSettings', userData);
// }
