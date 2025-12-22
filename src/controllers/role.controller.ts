import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class RoleController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await RoleService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { roles } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const role = await RoleService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { role } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const role = await RoleService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { role } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await RoleService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
