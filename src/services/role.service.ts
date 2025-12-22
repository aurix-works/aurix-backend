import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { SubOrganization } from '../models/SubOrganization';
import { Permission } from '../models/Permission';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';
import { In } from 'typeorm';

export class RoleService {
    static async getAll() {
        const roleRepo = AppDataSource.getRepository(Role);
        return await roleRepo.find({
            relations: ['subOrganization', 'permissions'],
        });
    }

    static async create(data: any) {
        const { subOrganizationId, name, description, permissionIds } = data;

        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

        if (!subOrg) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND);
        }

        const roleRepo = AppDataSource.getRepository(Role);
        const role = roleRepo.create({
            subOrganization: subOrg,
            subOrganizationId,
            name,
            description,
        });

        if (permissionIds && permissionIds.length > 0) {
            const permissionRepo = AppDataSource.getRepository(Permission);
            const permissions = await permissionRepo.findBy({ id: In(permissionIds) });
            role.permissions = permissions;
        }

        return await roleRepo.save(role);
    }

    static async update(id: number, data: any) {
        const { name, description, permissionIds } = data;

        const roleRepo = AppDataSource.getRepository(Role);
        const role = await roleRepo.findOne({
            where: { id },
            relations: ['permissions']
        });

        if (!role) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Role'), HTTP_STATUS.NOT_FOUND);
        }

        if (name) role.name = name;
        if (description) role.description = description;

        if (permissionIds) {
            const permissionRepo = AppDataSource.getRepository(Permission);
            const permissions = await permissionRepo.findBy({ id: In(permissionIds) });
            role.permissions = permissions;
        }

        return await roleRepo.save(role);
    }

    static async delete(id: number) {
        const roleRepo = AppDataSource.getRepository(Role);
        const role = await roleRepo.findOneBy({ id });

        if (!role) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Role'), HTTP_STATUS.NOT_FOUND);
        }

        await roleRepo.remove(role);
    }
}
