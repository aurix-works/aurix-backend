import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from './error.middleware';

const userService = new UserService();

export const requirePermission = (...permissionNames: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user || !user.userId) {
                return next(new AppError('You must be logged in to access this resource', 401));
            }

            const userPermissions = await userService.getUserPermissions(user.userId);

            const hasPermission = permissionNames.some((permissionName) =>
                userPermissions.includes(permissionName)
            );

            if (!hasPermission) {
                return next(
                    new AppError(
                        `You do not have permission to perform this action. Required: ${permissionNames.join(' or ')}`,
                        403
                    )
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireRole = (...roleNames: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user || !user.roleName) {
                return next(new AppError('You must be logged in to access this resource', 401));
            }

            const hasRole = roleNames.includes(user.roleName);

            if (!hasRole) {
                return next(
                    new AppError(
                        `You do not have the required role. Required: ${roleNames.join(' or ')}`,
                        403
                    )
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireAnyPermission = (...permissionNames: string[]) => {
    return requirePermission(...permissionNames);
};

export const requireAllPermissions = (...permissionNames: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user || !user.userId) {
                return next(new AppError('You must be logged in to access this resource', 401));
            }

            const userPermissions = await userService.getUserPermissions(user.userId);

            const hasAllPermissions = permissionNames.every((permissionName) =>
                userPermissions.includes(permissionName)
            );

            if (!hasAllPermissions) {
                return next(
                    new AppError(
                        `You do not have all required permissions. Required: ${permissionNames.join(', ')}`,
                        403
                    )
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
