import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/department.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class DepartmentController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const departments = await DepartmentService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { departments } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await DepartmentService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { department } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const department = await DepartmentService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { department } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await DepartmentService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
