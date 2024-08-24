import { BaseQueue } from '@service/queues/base.queue';
import { IEmailJob } from '@user/interfaces/user.interface';
import { emailWorker } from '@worker/email.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class EmailQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const forgotPasswordEmailQueue = new EmailQueue('emails', 'forgotPasswordEmail', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);
export const commentsEmailQueue = new EmailQueue('emails', 'commentsEmail', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);
export const followersEmailQueue = new EmailQueue('emails', 'followersEmail', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);
export const reactionsEmailQueue = new EmailQueue('emails', 'reactionsEmail', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);
export const directMessageEmailQueue = new EmailQueue('emails', 'directMessageEmail', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);
export const changePasswordEmailQueue = new EmailQueue('emails', 'changePassword', CONCURRENCY_LIMIT, emailWorker.addNotificationEmail);

// export function sendForgotPasswordEmail(emailData: IEmailJob): void {
//   forgotPasswordEmailQueue.addEmailJob('forgotPasswordEmail', emailData);
// }

// export function sendCommentsEmail(emailData: IEmailJob): void {
//   commentsEmailQueue.addEmailJob('commentsEmail', emailData);
// }

// export function sendFollowersEmail(emailData: IEmailJob): void {
//   followersEmailQueue.addEmailJob('followersEmail', emailData);
// }

// export function sendReactionsEmail(emailData: IEmailJob): void {
//   reactionsEmailQueue.addEmailJob('reactionsEmail', emailData);
// }

// export function sendDirectMessageEmail(emailData: IEmailJob): void {
//   directMessageEmailQueue.addEmailJob('directMessageEmail', emailData);
// }

// export function sendChangePasswordEmail(emailData: IEmailJob): void {
//   changePasswordEmailQueue.addEmailJob('changePassword', emailData);
// }
