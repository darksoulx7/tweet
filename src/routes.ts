import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: Application) => {
    const routes = () => {
        app.use('/queues', serverAdapter.getRouter())
        app.use(BASE_PATH, authRoutes.routes());
        app.use(BASE_PATH, authRoutes.signOutroute());
    };

    routes();
};
