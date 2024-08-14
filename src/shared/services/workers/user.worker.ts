import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@service/db/user.service';

const log: Logger = config.createLogger('userWorker');

class UserWorker {
    async addUserToDB(job: Job): Promise<void> {
        try {
            const { value } = job.data;
            await userService.addUserData(value);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }
}

export const userWorker: UserWorker = new UserWorker();
