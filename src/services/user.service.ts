import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { SubOrganization } from '../models/SubOrganization';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';

export class UserService {
    static async getAll() {
        const userRepo = AppDataSource.getRepository(User);
        return await userRepo.find({
            relations: ['subOrganization', 'currentManager', 'roles'],
        });
    }

    static async create(data: any) {
        const { subOrganizationId, email, password, firstName, lastName, employeeCode, designation, joiningDate, currentManagerId, status } = data;

        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = await subOrgRepo.findOneBy({ id: subOrganizationId });

        if (!subOrg) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('SubOrganization'), HTTP_STATUS.NOT_FOUND);
        }

        const userRepo = AppDataSource.getRepository(User);

        // Check if user already exists in this sub-org
        const existingUser = await userRepo.findOne({
            where: { subOrganizationId, email }
        });

        if (existingUser) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.DUPLICATE_EMAIL, HTTP_STATUS.BAD_REQUEST);
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
                throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Manager'), HTTP_STATUS.NOT_FOUND);
            }
            user.currentManager = manager;
        }

        await userRepo.save(user);

        // Remove password from response
        delete (user as any).password;

        return user;
    }

    static async update(id: number, data: any) {
        const { firstName, lastName, employeeCode, designation, joiningDate, currentManagerId, status } = data;

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id });

        if (!user) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('User'), HTTP_STATUS.NOT_FOUND);
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
                throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('Manager'), HTTP_STATUS.NOT_FOUND);
            }
            user.currentManager = manager;
            user.currentManagerId = currentManagerId;
        }

        return await userRepo.save(user);
    }

    static async delete(id: number) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id });

        if (!user) {
            throw new AppError(ERROR_MESSAGES.RESOURCE.NOT_FOUND('User'), HTTP_STATUS.NOT_FOUND);
        }

        await userRepo.remove(user);
    }
}
