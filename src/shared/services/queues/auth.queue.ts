import { IAuthJob } from "@auth/interfaces/auth.interface";
import { BaseQueue } from "./base.queue";

class AuthQueue extends BaseQueue {
    constructor() {
        super('auth')
    }

    public addAuthUserJob(name: string, data: IAuthJob) {
        this.addJob(name, data);
    }
}

export const authQueue: AuthQueue = new AuthQueue();

