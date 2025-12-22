import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class PermissionService {
    static async getAll() {
        const permissionRepo = AppDataSource.getRepository(Permission);
        return await permissionRepo.find();
    }

    static async create(data: any) {
        const { slug, description } = data;
        const permissionRepo = AppDataSource.getRepository(Permission);

        const existingPermission = await permissionRepo.findOneBy({ slug });
        if (existingPermission) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.DUPLICATE_SLUG, HTTP_STATUS.BAD_REQUEST);
        }

        const permission = permissionRepo.create({
            slug,
            description,
        });

        return await permissionRepo.save(permission);
    }

    static async update(id: number, data: any) {
        const { slug, description } = data;
        const permissionRepo = AppDataSource.getRepository(Permission);
        const permission = await permissionRepo.findOneBy({ id });

        if (!permission) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Permission'), HTTP_STATUS.NOT_FOUND);
        }

        if (slug) permission.slug = slug;
        if (description) permission.description = description;

        return await permissionRepo.save(permission);
    }

    static async delete(id: number) {
        const permissionRepo = AppDataSource.getRepository(Permission);
        const permission = await permissionRepo.findOneBy({ id });

        if (!permission) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Permission'), HTTP_STATUS.NOT_FOUND);
        }

        await permissionRepo.remove(permission);
    }
}
