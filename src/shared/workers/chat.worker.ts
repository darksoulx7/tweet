import { config } from '@root/config';
import { chatService } from '@service/db/chat.service';
import { Job } from 'bullmq';
import Logger from 'bunyan';

const log: Logger = config.createLogger('chatWorker');

class ChatWorker {
  async addChatMessageToDB(jobQueue: Job): Promise<void> {
    try {
      await chatService.addMessageToDB(jobQueue.data);
      jobQueue.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async markMessageAsDeleted(jobQueue: Job): Promise<void> {
    try {
      const { messageId, type } = jobQueue.data;
      await chatService.markMessageAsDeleted(messageId, type);
      jobQueue.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async markMessagesAsReadInDB(jobQueue: Job): Promise<void> {
    try {
      const { senderId, receiverId } = jobQueue.data;
      await chatService.markMessagesAsRead(senderId, receiverId);
      jobQueue.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }

  async updateMessageReaction(jobQueue: Job): Promise<void> {
    try {
      const { messageId, senderName, reaction, type } = jobQueue.data;
      await chatService.updateMessageReaction(
        messageId,
        senderName,
        reaction,
        type,
      );
      jobQueue.updateProgress(100);
    } catch (error) {
      log.error(error);
    }
  }
}

export const chatWorker: ChatWorker = new ChatWorker();
