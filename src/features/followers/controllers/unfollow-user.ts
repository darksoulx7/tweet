import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@service/redis/follower.cache';
import { removeFollowerQueue } from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followeeId, followerId } = req.params;

    if (followeeId === followerId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: `FollowerId ${followerId} and FolloweeId ${followeeId} cannot be same`});
    }

    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${req.currentUser!.userId}`, followeeId);
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
    await Promise.all([ removeFollowerFromCache, removeFolloweeFromCache, followersCount, followeeCount ]);

    removeFollowerQueue.addFollowerJob('removeFollowerFromDB', { keyOne: `${followeeId}`, keyTwo: `${followerId}` });
    res.status(HTTP_STATUS.OK).json({ message: 'Unfollowed user now' });
  }
}
