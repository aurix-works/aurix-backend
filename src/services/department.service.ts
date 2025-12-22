import { AppDataSource } from '../config/database';
import { Department } from '../models/Department';
import { SubOrganization } from '../models/SubOrganization';
import { User } from '../models/User';
import { DepartmentHeadHistory } from '../models/DepartmentHeadHistory';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class DepartmentService {
    static async getAll() {
        const departmentRepo = AppDataSource.getRepository(Department);
        return await departmentRepo.find({
            relations: ['subOrganization', 'currentHeadUser'],
        });
    }

    static async create(data: any) {
        const { subOrganizationId, name, code, currentHeadUserId } = data;

        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

        if (!subOrg) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND);
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
                throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Head User'), HTTP_STATUS.NOT_FOUND);
            }
            department.currentHeadUser = user;
        }

        return await departmentRepo.save(department);
    }

    static async update(id: number, data: any) {
        const { name, code, currentHeadUserId } = data;

        const departmentRepo = AppDataSource.getRepository(Department);
        const department = await departmentRepo.findOneBy({ id });

        if (!department) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Department'), HTTP_STATUS.NOT_FOUND);
        }

        if (name) department.name = name;
        if (code) department.code = code;

        if (currentHeadUserId && currentHeadUserId !== department.currentHeadUserId) {
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: currentHeadUserId });
            if (!user) {
                throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Head User'), HTTP_STATUS.NOT_FOUND);
            }

            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // 1. Close current history if exists
                const historyRepo = queryRunner.manager.getRepository(DepartmentHeadHistory);
                const currentHistory = await historyRepo.findOne({
                    where: { departmentId: department.id, isCurrent: true }
                });

                if (currentHistory) {
                    currentHistory.endDate = new Date();
                    currentHistory.isCurrent = false;
                    await historyRepo.save(currentHistory);
                }

                // 2. Create new history
                const newHistory = historyRepo.create({
                    departmentId: department.id,
                    headUserId: currentHeadUserId,
                    isCurrent: true,
                    startDate: new Date(),
                });
                await historyRepo.save(newHistory);

                // 3. Update department
                department.currentHeadUser = user;
                department.currentHeadUserId = currentHeadUserId;
                await queryRunner.manager.save(department);

                await queryRunner.commitTransaction();
            } catch (err) {
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } else {
            await departmentRepo.save(department);
        }

        return department;
    }

    static async delete(id: number) {
        const departmentRepo = AppDataSource.getRepository(Department);
        const department = await departmentRepo.findOneBy({ id });

        if (!department) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Department'), HTTP_STATUS.NOT_FOUND);
        }

        await departmentRepo.remove(department);
    }
}
