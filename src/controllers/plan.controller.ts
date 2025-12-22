import { Request, Response, NextFunction } from 'express';
import { PlanService } from '../services/plan.service';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class PlanController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await PlanService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { plans } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const plan = await PlanService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { plan } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const plan = await PlanService.update(parseInt(id), req.body);

            if (!plan) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Plan'), HTTP_STATUS.NOT_FOUND));
            }

            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { plan } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await PlanService.delete(parseInt(id));

            if (!deleted) {
                return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Plan'), HTTP_STATUS.NOT_FOUND));
            }

            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
