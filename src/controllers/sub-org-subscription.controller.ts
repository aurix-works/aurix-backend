import { Request, Response, NextFunction } from 'express';
import { SubOrgSubscriptionService } from '../services/sub-org-subscription.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SubOrgSubscriptionController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const subscriptions = await SubOrgSubscriptionService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subscriptions } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const subscription = await SubOrgSubscriptionService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { subscription } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const subscription = await SubOrgSubscriptionService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subscription } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await SubOrgSubscriptionService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
