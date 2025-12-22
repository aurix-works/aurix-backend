import { Request, Response, NextFunction } from 'express';
import { SubOrganizationService } from '../services/sub-organization.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class SubOrganizationController {
    @Log()
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const subOrganizations = await SubOrganizationService.getAll();
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subOrganizations } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const subOrganization = await SubOrganizationService.create(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: { subOrganization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const subOrganization = await SubOrganizationService.update(parseInt(id), req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: { subOrganization } });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await SubOrganizationService.delete(parseInt(id));
            res.status(HTTP_STATUS.NO_CONTENT).json({ status: 'success', data: null });
        } catch (error) {
            next(error);
        }
    }
}
