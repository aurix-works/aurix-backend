import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Plan } from '../models/Plan';
import { SystemService } from '../models/SystemService';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';
import { In } from 'typeorm';

export class PlanController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Plan);
            const plans = await repo.find({ relations: ['services'] });
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { plans } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { serviceIds, ...planData } = req.body;
            const planRepo = AppDataSource.getRepository(Plan);

            const plan = planRepo.create(planData as any) as unknown as Plan;

            if (serviceIds && serviceIds.length > 0) {
                const serviceRepo = AppDataSource.getRepository(SystemService);
                const services = await serviceRepo.findBy({ id: In(serviceIds) });
                plan.services = services;
            }

            await planRepo.save(plan);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { plan } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { serviceIds, ...planData } = req.body;
            const planRepo = AppDataSource.getRepository(Plan);

            let plan = await planRepo.findOne({ where: { id: parseInt(id) }, relations: ['services'] });
            if (!plan) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Plan'), HTTP_STATUS.NOT_FOUND));

            planRepo.merge(plan, planData);

            if (serviceIds) {
                const serviceRepo = AppDataSource.getRepository(SystemService);
                const services = await serviceRepo.findBy({ id: In(serviceIds) });
                plan.services = services;
            }

            const result = await planRepo.save(plan);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { plan: result } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(Plan);
            const { id } = req.params;
            const result = await repo.delete(id);
            if (result.affected === 0) return next(new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Plan'), HTTP_STATUS.NOT_FOUND));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
