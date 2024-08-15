import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { postService } from '@service/db/post.service';

const log: Logger = config.createLogger('postWorker');

class PostWorker {
    async savePostToDB(job: Job): Promise<void> {
        try {
            const { key, value } = job.data;
            await postService.addPostToDB(key, value);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }

    async deletePostFromDB(job: Job): Promise<void> {
        try {
            const { keyOne, keyTwo } = job.data;
            await postService.deletePost(keyOne, keyTwo);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }

    async updatePostInDB(job: Job): Promise<void> {
        try {
            const { key, value } = job.data;
            await postService.editPost(key, value);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }
}

export const postWorker: PostWorker = new PostWorker();
