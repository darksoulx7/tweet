import { Job } from 'bullmq';
import Logger from 'bunyan';
import { config } from '@root/config';
import { imageService } from '@service/db/image.service';

const log: Logger = config.createLogger('imageWorker');

class ImageWorker {
    async addUserProfileImageToDB(job: Job): Promise<void> {
        try {
            const { key, value, imgId, imgVersion } = job.data;
            await imageService.addUserProfileImageToDB(
                key,
                value,
                imgId,
                imgVersion,
            );
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }

    async updateBGImageInDB(job: Job): Promise<void> {
        try {
            const { key, imgId, imgVersion } = job.data;
            await imageService.addBackgroundImageToDB(key, imgId, imgVersion);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }

    async addImageToDB(job: Job): Promise<void> {
        try {
            const { key, imgId, imgVersion } = job.data;
            await imageService.addImage(key, imgId, imgVersion, '');
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }

    async removeImageFromDB(job: Job): Promise<void> {
        try {
            const { imageId } = job.data;
            await imageService.removeImageFromDB(imageId);
            job.updateProgress(100);
        } catch (error) {
            log.error(error);
        }
    }
}

export const imageWorker: ImageWorker = new ImageWorker();
