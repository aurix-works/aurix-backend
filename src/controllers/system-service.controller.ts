import { Request, Response, NextFunction } from 'express';
import { SystemServiceService } from '../services/system-service.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SystemServiceController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const services = await SystemServiceService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { services } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const service = await SystemServiceService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { service } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const service = await SystemServiceService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { service } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await SystemServiceService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
