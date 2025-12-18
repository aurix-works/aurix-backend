import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';

export class PermissionController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const permissionRepo = AppDataSource.getRepository(Permission);
            const permissions = await permissionRepo.find();

            res.status(200).json({
                status: 'success',
                data: { permissions },
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug, description } = req.body;

            const permissionRepo = AppDataSource.getRepository(Permission);
            const existingPermission = await permissionRepo.findOneBy({ slug });

            if (existingPermission) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.DUPLICATE_SLUG, HTTP_STATUS.BAD_REQUEST));
            }

            const permission = permissionRepo.create({
                slug,
                description,
            });

            await permissionRepo.save(permission);

            res.status(HTTP_STATUS.CREATED).json({
                status: 'success',
                data: { permission },
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { slug, description } = req.body;

            const permissionRepo = AppDataSource.getRepository(Permission);
            const permission = await permissionRepo.findOneBy({ id: parseInt(id) });

            if (!permission) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Permission'), HTTP_STATUS.NOT_FOUND));
            }

            if (slug) permission.slug = slug;
            if (description) permission.description = description;

            await permissionRepo.save(permission);

            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                data: { permission },
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permissionRepo = AppDataSource.getRepository(Permission);
            const permission = await permissionRepo.findOneBy({ id: parseInt(id) });

            if (!permission) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Permission'), HTTP_STATUS.NOT_FOUND));
            }

            await permissionRepo.remove(permission);

            res.status(HTTP_STATUS.NO_CONTENT).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
