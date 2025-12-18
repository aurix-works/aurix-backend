import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Organization } from '../models/Organization';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class OrganizationController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Organization);
            const organizations = await repo.find();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { organizations } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Organization);
            const organization = repo.create(req.body);
            await repo.save(organization);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { organization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Organization);
            const { id } = req.params;
            let organization = await repo.findOneBy({ id: parseInt(id) });
            if (!organization) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Organization'), HTTP_STATUS.NOT_FOUND));

            repo.merge(organization, req.body);
            const result = await repo.save(organization);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { organization: result } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Organization);
            const { id } = req.params;
            const result = await repo.delete(id);
            if (result.affected === 0) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Organization'), HTTP_STATUS.NOT_FOUND));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
