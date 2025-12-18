import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { SubOrganization } from '../models/SubOrganization';

export class UserController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userRepo = AppDataSource.getRepository(User);
            const users = await userRepo.find({
                relations: ['subOrganization', 'currentManager', 'roles'],
            });

            res.status(200).json({
                status: 'success',
                data: { users },
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { subOrganizationId, email, password, firstName, lastName, employeeCode, designation, joiningDate, currentManagerId, status } = req.body;

            const subOrgRepo = AppDataSource.getRepository(SubOrganization);
            const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

            if (!subOrg) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND));
            }

            const userRepo = AppDataSource.getRepository(User);

            // Check if user already exists in this sub-org
            const existingUser = await userRepo.findOne({
                where: { subOrganizationId, email }
            });

            if (existingUser) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.DUPLICATE_EMAIL, HTTP_STATUS.BAD_REQUEST));
            }

            const user = userRepo.create({
                subOrganization: subOrg,
                subOrganizationId,
                email,
                password,
                firstName,
                lastName,
                employeeCode,
                designation,
                joiningDate,
                status,
                currentManagerId
            });

            if (currentManagerId) {
                const manager = await userRepo.findOneBy({ id: currentManagerId });
                if (!manager) {
                    return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Manager'), HTTP_STATUS.NOT_FOUND));
                }
                user.currentManager = manager;
            }

            await userRepo.save(user);

            // Remove password from response
            delete (user as any).password;

            res.status(HTTP_STATUS.CREATED).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { firstName, lastName, employeeCode, designation, joiningDate, currentManagerId, status } = req.body;

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: parseInt(id) });

            if (!user) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('User'), HTTP_STATUS.NOT_FOUND));
            }

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (employeeCode) user.employeeCode = employeeCode;
            if (designation) user.designation = designation;
            if (joiningDate) user.joiningDate = joiningDate;
            if (status) user.status = status;

            if (currentManagerId) {
                const manager = await userRepo.findOneBy({ id: currentManagerId });
                if (!manager) {
                    return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Manager'), HTTP_STATUS.NOT_FOUND));
                }
                user.currentManager = manager;
                user.currentManagerId = currentManagerId;
            }

            await userRepo.save(user);

            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: parseInt(id) });

            if (!user) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('User'), HTTP_STATUS.NOT_FOUND));
            }

            await userRepo.remove(user);

            res.status(HTTP_STATUS.NO_CONTENT).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
