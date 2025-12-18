import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { SubOrganization } from '../models/SubOrganization';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SubOrganizationController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrganization);
            const subOrganizations = await repo.find({ relations: ['organization'] });
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subOrganizations } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrganization);
            const subOrganization = repo.create(req.body);
            await repo.save(subOrganization);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { subOrganization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrganization);
            const { id } = req.params;
            let subOrganization = await repo.findOneBy({ id: parseInt(id) });
            if (!subOrganization) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND));

            repo.merge(subOrganization, req.body);
            const result = await repo.save(subOrganization);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subOrganization: result } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrganization);
            const { id } = req.params;
            const result = await repo.delete(id);
            if (result.affected === 0) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
