import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { SubOrgSubscription } from '../models/SubOrgSubscription';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SubOrgSubscriptionController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrgSubscription);
            const subscriptions = await repo.find({ relations: ['subOrganization', 'plan'] });
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subscriptions } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrgSubscription);
            const subscription = repo.create(req.body);
            await repo.save(subscription);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { subscription } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrgSubscription);
            const { id } = req.params;
            let subscription = await repo.findOneBy({ id: parseInt(id) });
            if (!subscription) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Subscription'), HTTP_STATUS.NOT_FOUND));

            repo.merge(subscription, req.body);
            const result = await repo.save(subscription);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subscription: result } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(SubOrgSubscription);
            const { id } = req.params;
            const result = await repo.delete(id);
            if (result.affected === 0) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Subscription'), HTTP_STATUS.NOT_FOUND));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
