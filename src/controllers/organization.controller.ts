import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '../services/organization.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class OrganizationController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const organizations = await OrganizationService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { organizations } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const organization = await OrganizationService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { organization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const organization = await OrganizationService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { organization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await OrganizationService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
