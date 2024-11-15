import { notificationRoutes } from './features/notifications/routes/notificationRoutes';
import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { chatRoutes } from '@chat/routes/chatRoutes';
import { commentRoutes } from '@comment/routes/commentRoutes';
import { followerRoutes } from '@follower/routes/followerRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { imageRoutes } from '@image/routes/imageRoutes';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionRoutes } from '@reaction/routes/reactionRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { userRoutes } from '@user/routes/userRoutes';
import { healthRoutes } from '@user/routes/healthRoutes'
import { Application } from 'express';

const BASE_PATH = '/e166oahk87';
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, healthRoutes.health());
    app.use(BASE_PATH, healthRoutes.env());
    app.use(BASE_PATH, healthRoutes.instance());
    app.use(BASE_PATH, healthRoutes.fiboRoutes());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signOutroute());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, imageRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
  };
  routes();
};
