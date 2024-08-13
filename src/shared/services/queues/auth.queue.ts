import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';
import { authWorker } from '@service/workers/auth.worker';

class AuthQueue extends BaseQueue {
    constructor() {
        super('auth');
        this.processJob('addAuthUserToDB',5, authWorker.addAuthUserToDB);
    }

    public addAuthUserJob(name: string, data: IAuthJob) {
        this.addJob(name, data);
    }


}

export const authQueue: AuthQueue = new AuthQueue();

