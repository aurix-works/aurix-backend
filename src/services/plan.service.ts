import { AppDataSource } from '../config/database';
import { Plan } from '../models/Plan';
import { SystemService } from '../models/SystemService';
import { In } from 'typeorm';

export class PlanService {
    static async getAll(): Promise<Plan[]> {
        const repo = AppDataSource.getRepository(Plan);
        return await repo.find({ relations: ['services'] });
    }

    static async create(data: any): Promise<Plan> {
        const { serviceIds, ...planData } = data;
        const planRepo = AppDataSource.getRepository(Plan);

        const plan = planRepo.create(planData as any) as unknown as Plan;

        if (serviceIds && serviceIds.length > 0) {
            const serviceRepo = AppDataSource.getRepository(SystemService);
            const services = await serviceRepo.findBy({ id: In(serviceIds) });
            plan.services = services;
        }

        return await planRepo.save(plan);
    }

    static async update(id: number, data: any): Promise<Plan | null> {
        const { serviceIds, ...planData } = data;
        const planRepo = AppDataSource.getRepository(Plan);

        let plan = await planRepo.findOne({ where: { id }, relations: ['services'] });
        if (!plan) return null;

        planRepo.merge(plan, planData);

        if (serviceIds) {
            const serviceRepo = AppDataSource.getRepository(SystemService);
            const services = await serviceRepo.findBy({ id: In(serviceIds) });
            plan.services = services;
        }

        return await planRepo.save(plan);
    }

    static async delete(id: number): Promise<boolean> {
        const repo = AppDataSource.getRepository(Plan);
        const result = await repo.delete(id);
        return result.affected !== 0;
    }
}
