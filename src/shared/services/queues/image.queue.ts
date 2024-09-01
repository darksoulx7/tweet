import { IFileImageJobData } from '@image/interfaces/image.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { imageWorker } from '@worker/image.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class ImageQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}

export const addUserProfileImageQueue = new ImageQueue('AddUserProfileImageQueue', 'addUserProfileImageToDB', CONCURRENCY_LIMIT, imageWorker.addUserProfileImageToDB);
export const updateBGImageQueue = new ImageQueue('UpdateBGImageQueue', 'updateBGImageInDB', CONCURRENCY_LIMIT, imageWorker.updateBGImageInDB);
export const addImageQueue = new ImageQueue('AddImageQueue', 'addImageToDB', CONCURRENCY_LIMIT, imageWorker.addImageToDB);
export const removeImageQueue = new ImageQueue('RemoveImageQueue', 'removeImageFromDB', CONCURRENCY_LIMIT, imageWorker.removeImageFromDB);

// export function addUserProfileImage(imageData: IFileImageJobData): void {
//   addUserProfileImageQueue.addImageJob('addUserProfileImageToDB', imageData);
// }

// export function updateBGImage(imageData: IFileImageJobData): void {
//   updateBGImageQueue.addImageJob('updateBGImageInDB', imageData);
// }

// export function addImage(imageData: IFileImageJobData): void {
//   addImageQueue.addImageJob('addImageToDB', imageData);
// }

// export function removeImage(imageData: IFileImageJobData): void {
//   removeImageQueue.addImageJob('removeImageFromDB', imageData);
// }
