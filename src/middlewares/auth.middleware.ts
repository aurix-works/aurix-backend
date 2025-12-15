import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './error.middleware';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;

        // Check if user exists
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Check if user is System Admin
        if (!user.isSystemAdmin) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};
