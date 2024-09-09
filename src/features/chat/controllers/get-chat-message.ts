import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from '@service/redis/message.cache';
import { chatService } from '@service/db/chat.service';
import { IMessageData } from '@chat/interfaces/chat.interface';

const messageCache: MessageCache = new MessageCache();

export class Get {
  public async conversationList(req: Request, res: Response): Promise<void> {
    const cachedList: IMessageData[] = await messageCache.getUserConversationList(`${req.currentUser!.userId}`);
    const list: IMessageData[] = cachedList.length ? cachedList : await chatService.getUserConversationList(new mongoose.Types.ObjectId(req.currentUser!.userId));
    res.status(HTTP_STATUS.OK).json({ message: 'User conversation list', list });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const { receiverId } = req.params;
    const cachedMessages: IMessageData[] = await messageCache.getChatMessagesFromCache(`${req.currentUser!.userId}`, `${receiverId}`);
    const messages: IMessageData[] = cachedMessages.length ? cachedMessages : await chatService.getMessages(new mongoose.Types.ObjectId(req.currentUser!.userId), new mongoose.Types.ObjectId(receiverId), { createdAt: 1 });
    res.status(HTTP_STATUS.OK).json({ message: 'User chat messages', messages });
  }
}
