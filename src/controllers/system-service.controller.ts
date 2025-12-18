import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { SystemService } from '../models/SystemService';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SystemServiceController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SystemService);
            const services = await repo.find();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { services } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SystemService);
            const service = repo.create(req.body);
            await repo.save(service);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { service } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SystemService);
            const { id } = req.params;
            let service = await repo.findOneBy({ id: parseInt(id) });
            if (!service) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Service'), HTTP_STATUS.NOT_FOUND));

            repo.merge(service, req.body);
            const result = await repo.save(service);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { service: result } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SystemService);
            const { id } = req.params;
            const result = await repo.delete(id);
            if (result.affected === 0) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Service'), HTTP_STATUS.NOT_FOUND));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
