import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { SystemUser } from '../models/SystemUser';
import { User } from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Log } from '../utils/aop';

export class AuthController {
    @Log()
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError(ERROR_MESSAGES.AUTH.MISSING_CREDENTIALS, HTTP_STATUS.BAD_REQUEST));
            }

            // 1. Check System User
            const systemUserRepo = AppDataSource.getRepository(SystemUser);
            const systemUser = await systemUserRepo.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'isSystemAdmin']
            });

            if (systemUser && (await systemUser.validatePassword(password))) {
                const token = jwt.sign({ userId: systemUser.id, type: 'system' }, config.jwt.secret, {
                    expiresIn: config.jwt.expiresIn as any,
                });
                delete (systemUser as any).password;
                return res.status(HTTP_STATUS.OK).json({
                    status: 'success',
                    token,
                    data: { user: systemUser, type: 'system' },
                });
            }

            // 2. Check Tenant User
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'firstName', 'lastName', 'subOrganizationId']
            });

            if (user && (await user.validatePassword(password))) {
                const token = jwt.sign({ userId: user.id, type: 'tenant', subOrgId: user.subOrganizationId }, config.jwt.secret, {
                    expiresIn: config.jwt.expiresIn as any,
                });
                delete (user as any).password;
                return res.status(HTTP_STATUS.OK).json({
                    status: 'success',
                    token,
                    data: { user, type: 'tenant' },
                });
            }

            return next(new AppError(ERROR_MESSAGES.AUTH.INCORRECT_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED));
        } catch (error) {
            next(error);
        }
    }
}
