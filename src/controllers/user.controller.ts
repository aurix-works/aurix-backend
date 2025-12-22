import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class UserController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { users } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { user } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await UserService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { user } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await UserService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
