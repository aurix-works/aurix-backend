import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Log } from '../utils/aop';

export class AuthController {
    @Log()
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Please provide email and password', 400));
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'isSystemAdmin']
            });

            if (!user || !(await user.validatePassword(password))) {
                return next(new AppError('Incorrect email or password', 401));
            }

            // if (!user.isSystemAdmin) {
            //     return next(new AppError('Access denied. System Admin only.', 403));
            // }

            const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
                expiresIn: config.jwt.expiresIn as any,
            });

            // Remove password from output
            delete (user as any).password;

            res.status(200).json({
                status: 'success',
                token,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }
}
