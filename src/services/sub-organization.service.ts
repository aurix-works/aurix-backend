import { AppDataSource } from '../config/database';
import { SubOrganization } from '../models/SubOrganization';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class SubOrganizationService {
    static async getAll() {
        const repo = AppDataSource.getRepository(SubOrganization);
        return await repo.find({ relations: ['organization'] });
    }

    static async create(data: any) {
        const repo = AppDataSource.getRepository(SubOrganization);
        const subOrganization = repo.create(data);
        return await repo.save(subOrganization);
    }

    static async update(id: number, data: any) {
        const repo = AppDataSource.getRepository(SubOrganization);
        let subOrganization = await repo.findOneBy({ id });

        if (!subOrganization) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND);
        }

        repo.merge(subOrganization, data);
        return await repo.save(subOrganization);
    }

    static async delete(id: number) {
        const repo = AppDataSource.getRepository(SubOrganization);
        const result = await repo.delete(id);

        if (result.affected === 0) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND);
        }
    }
}
