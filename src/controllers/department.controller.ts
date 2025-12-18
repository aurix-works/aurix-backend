import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Department } from '../models/Department';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { SubOrganization } from '../models/SubOrganization';
import { User } from '../models/User';

export class DepartmentController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const departmentRepo = AppDataSource.getRepository(Department);
            const departments = await departmentRepo.find({
                relations: ['subOrganization', 'currentHeadUser'],
            });

            res.status(200).json({
                status: 'success',
                data: { departments },
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { subOrganizationId, name, code, currentHeadUserId } = req.body;

            const subOrgRepo = AppDataSource.getRepository(SubOrganization);
            const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

            if (!subOrg) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND));
            }

            const departmentRepo = AppDataSource.getRepository(Department);
            const department = departmentRepo.create({
                subOrganization: subOrg,
                subOrganizationId,
                name,
                code,
                currentHeadUserId,
            });

            if (currentHeadUserId) {
                const userRepo = AppDataSource.getRepository(User);
                const user = await userRepo.findOneBy({ id: currentHeadUserId });
                if (!user) {
                    return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Head User'), HTTP_STATUS.NOT_FOUND));
                }
                department.currentHeadUser = user;
            }

            await departmentRepo.save(department);

            res.status(HTTP_STATUS.CREATED).json({
                status: 'success',
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, code, currentHeadUserId } = req.body;

            const departmentRepo = AppDataSource.getRepository(Department);
            const department = await departmentRepo.findOneBy({ id: parseInt(id) });

            if (!department) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Department'), HTTP_STATUS.NOT_FOUND));
            }

            if (name) department.name = name;
            if (code) department.code = code;

            if (currentHeadUserId) {
                const userRepo = AppDataSource.getRepository(User);
                const user = await userRepo.findOneBy({ id: currentHeadUserId });
                if (!user) {
                    return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Head User'), HTTP_STATUS.NOT_FOUND));
                }
                department.currentHeadUser = user;
                department.currentHeadUserId = currentHeadUserId;
            }

            await departmentRepo.save(department);

            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const departmentRepo = AppDataSource.getRepository(Department);
            const department = await departmentRepo.findOneBy({ id: parseInt(id) });

            if (!department) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Department'), HTTP_STATUS.NOT_FOUND));
            }

            await departmentRepo.remove(department);

            res.status(HTTP_STATUS.NO_CONTENT).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
