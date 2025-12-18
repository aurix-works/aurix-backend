import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { SubOrganization } from '../models/SubOrganization';
import { Permission } from '../models/Permission';
import { In } from 'typeorm';

export class RoleController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const roleRepo = AppDataSource.getRepository(Role);
            const roles = await roleRepo.find({
                relations: ['subOrganization', 'permissions'],
            });

            res.status(200).json({
                status: 'success',
                data: { roles },
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { subOrganizationId, name, description, permissionIds } = req.body;

            const subOrgRepo = AppDataSource.getRepository(SubOrganization);
            const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

            if (!subOrg) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND));
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

            await roleRepo.save(role);

            res.status(HTTP_STATUS.CREATED).json({
                status: 'success',
                data: { role },
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, permissionIds } = req.body;

            const roleRepo = AppDataSource.getRepository(Role);
            const role = await roleRepo.findOne({
                where: { id: parseInt(id) },
                relations: ['permissions']
            });

            if (!role) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Role'), HTTP_STATUS.NOT_FOUND));
            }

            if (name) role.name = name;
            if (description) role.description = description;

            if (permissionIds) {
                const permissionRepo = AppDataSource.getRepository(Permission);
                const permissions = await permissionRepo.findBy({ id: In(permissionIds) });
                role.permissions = permissions;
            }

            await roleRepo.save(role);

            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                data: { role },
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const roleRepo = AppDataSource.getRepository(Role);
            const role = await roleRepo.findOneBy({ id: parseInt(id) });

            if (!role) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Role'), HTTP_STATUS.NOT_FOUND));
            }

            await roleRepo.remove(role);

            res.status(HTTP_STATUS.NO_CONTENT).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
