import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { notificationWorker } from '@worker/notification.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class NotificationQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addNotificationJob(name: string, data: INotificationJobData): void {
    this.addJob(name, data);
  }
}

export const updateNotificationQueue = new NotificationQueue('UpdateNotificationQueue', 'updateNotification', CONCURRENCY_LIMIT, notificationWorker.updateNotification);
export const deleteNotificationQueue = new NotificationQueue('DeleteNotificationQueue', 'deleteNotification', CONCURRENCY_LIMIT, notificationWorker.deleteNotification);

// export function updateNotification(notificationData: INotificationJobData): void {
//   updateNotificationQueue.addNotificationJob('updateNotification', notificationData);
// }

// export function deleteNotification(notificationData: INotificationJobData): void {
//   deleteNotificationQueue.addNotificationJob('deleteNotification', notificationData);
// }
