import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { HTTP_STATUS } from '../constants/http';
import { ERROR_MESSAGES } from '../constants/messages';
import { User } from '../models/User';

export const restrictTo = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as User;

        if (!user || !user.roles) {
            return next(new AppError(ERROR_MESSAGES.AUTH.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
        }

        const hasPermission = user.roles.some(role => allowedRoles.includes(role.name));

        if (!hasPermission) {
            return next(new AppError(ERROR_MESSAGES.AUTH.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
        }

        next();
    };
};
