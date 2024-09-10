import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { chatWorker } from '@worker/chat.worker';
import { Queue as QueueMQ } from 'bullmq';
import { CONNECTION_CONFIG, CONCURRENCY_LIMIT } from '@global/helpers/constants';

class ChatQueue extends BaseQueue {
  constructor(queueName: string, jobName: string, jobConcurrency: number, jobProcessor: any) {
    super(queueName, new QueueMQ(queueName, CONNECTION_CONFIG));
    this.processJob(jobName, jobConcurrency, jobProcessor);
  }

  public addChatJob(name: string, data: IChatJobData | IMessageData): void {
    this.addJob(name, data);
  }
}

export const addChatMessageQueue = new ChatQueue('AddChatMessageQueue', 'addChatMessageToDB', CONCURRENCY_LIMIT, chatWorker.addChatMessageToDB);
export const markMessageAsDeletedQueue = new ChatQueue('MarkMessageAsDeletedQueue', 'markMessageAsDeletedInDB', CONCURRENCY_LIMIT, chatWorker.markMessageAsDeleted);
export const markMessagesAsReadQueue = new ChatQueue('MarkMessagesAsReadQueue', 'markMessagesAsReadInDB', CONCURRENCY_LIMIT, chatWorker.markMessagesAsReadInDB);
export const updateMessageReactionQueue = new ChatQueue('UpdateMessageReactionQueue', 'updateMessageReaction', CONCURRENCY_LIMIT, chatWorker.updateMessageReaction);

// export function addChatMessage(chatData: IChatJobData): void {
//   addChatMessageQueue.addChatJob('addChatMessageToDB', chatData);
// }

// export function markMessageAsDeleted(messageData: IMessageData): void {
//   markMessageAsDeletedQueue.addChatJob('markMessageAsDeletedInDB', messageData);
// }

// export function markMessagesAsRead(messageData: IMessageData): void {
//   markMessagesAsReadQueue.addChatJob('markMessagesAsReadInDB', messageData);
// }

// export function updateMessageReaction(messageData: IMessageData): void {
//   updateMessageReactionQueue.addChatJob('updateMessageReaction', messageData);
// }
