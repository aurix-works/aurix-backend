import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './error.middleware';
import { ERROR_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export const protectTenant = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED, HTTP_STATUS.UNAUTHORIZED));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;

        if (decoded.type !== 'tenant') {
            return next(new AppError(ERROR_MESSAGES.AUTH.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: decoded.userId },
            relations: ['roles', 'subOrganization']
        });

        if (!user) {
            return next(new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED));
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return next(new AppError(ERROR_MESSAGES.AUTH.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
    }
};
