import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { commentRoutes } from '@comment/routes/commentRoutes';
import { followerRoutes } from '@follower/routes/followerRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionRoutes } from '@reaction/routes/reactionRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/e166oahk87';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signOutroute());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes() )
  };

  routes();
};
