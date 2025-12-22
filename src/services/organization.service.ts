import { AppDataSource } from '../config/database';
import { Organization } from '../models/Organization';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class OrganizationService {
    static async getAll() {
        const repo = AppDataSource.getRepository(Organization);
        return await repo.find();
    }

    static async create(data: any) {
        const repo = AppDataSource.getRepository(Organization);
        const organization = repo.create(data);
        return await repo.save(organization);
    }

    static async update(id: number, data: any) {
        const repo = AppDataSource.getRepository(Organization);
        let organization = await repo.findOneBy({ id });

        if (!organization) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Organization'), HTTP_STATUS.NOT_FOUND);
        }

        repo.merge(organization, data);
        return await repo.save(organization);
    }

    static async delete(id: number) {
        const repo = AppDataSource.getRepository(Organization);
        const result = await repo.delete(id);

        if (result.affected === 0) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Organization'), HTTP_STATUS.NOT_FOUND);
        }
    }
}
