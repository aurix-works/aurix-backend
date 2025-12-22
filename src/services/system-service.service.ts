import { AppDataSource } from '../config/database';
import { SystemService } from '../models/SystemService';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class SystemServiceService {
    static async getAll() {
        const repo = AppDataSource.getRepository(SystemService);
        return await repo.find();
    }

    static async create(data: any) {
        const repo = AppDataSource.getRepository(SystemService);
        const service = repo.create(data);
        return await repo.save(service);
    }

    static async update(id: number, data: any) {
        const repo = AppDataSource.getRepository(SystemService);
        let service = await repo.findOneBy({ id });

        if (!service) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Service'), HTTP_STATUS.NOT_FOUND);
        }

        repo.merge(service, data);
        return await repo.save(service);
    }

    static async delete(id: number) {
        const repo = AppDataSource.getRepository(SystemService);
        const result = await repo.delete(id);

        if (result.affected === 0) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Service'), HTTP_STATUS.NOT_FOUND);
        }
    }
}
