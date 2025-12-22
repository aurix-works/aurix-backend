import { AppDataSource } from '../config/database';
import { SubOrgSubscription } from '../models/SubOrgSubscription';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class SubOrgSubscriptionService {
    static async getAll() {
        const repo = AppDataSource.getRepository(SubOrgSubscription);
        return await repo.find({ relations: ['subOrganization', 'plan'] });
    }

    static async create(data: any) {
        const repo = AppDataSource.getRepository(SubOrgSubscription);
        const subscription = repo.create(data);
        return await repo.save(subscription);
    }

    static async update(id: number, data: any) {
        const repo = AppDataSource.getRepository(SubOrgSubscription);
        let subscription = await repo.findOneBy({ id });

        if (!subscription) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Subscription'), HTTP_STATUS.NOT_FOUND);
        }

        repo.merge(subscription, data);
        return await repo.save(subscription);
    }

    static async delete(id: number) {
        const repo = AppDataSource.getRepository(SubOrgSubscription);
        const result = await repo.delete(id);

        if (result.affected === 0) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Subscription'), HTTP_STATUS.NOT_FOUND);
        }
    }
}
