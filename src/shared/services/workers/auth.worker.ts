import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { DoneCallback } from 'bull';
import { authService } from '@service/db/auth.service';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
    async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void>{
        try {
            const { value } = job.data;
            await authService.createAuthUser(value);
            job.updateProgress(100);
            done(null, job.data);
        } catch (error) {
            log.error(error);
            done(error as Error);
        }
    }
}

export const authWorker: AuthWorker = new AuthWorker();
