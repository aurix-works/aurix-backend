import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permission.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class PermissionController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const permissions = await PermissionService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { permissions } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const permission = await PermissionService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { permission } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await PermissionService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { permission } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await PermissionService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
