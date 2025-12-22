import { Request, Response, NextFunction } from 'express';
import { LeaveService } from '../services/leave.service';
import { User } from '../models/User';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class LeaveController {
    @Log()
    static async createLeaveType(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const leaveType = await LeaveService.createLeaveType(req.body, user);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: leaveType });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async getLeaveTypes(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const leaveTypes = await LeaveService.getLeaveTypes(user);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: leaveTypes });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async createWorkflow(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const workflow = await LeaveService.createWorkflow(req.body, user);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: workflow });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async applyLeave(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const leaveRequest = await LeaveService.applyLeave(req.body, user);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: leaveRequest });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async getLeaveRequests(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const requests = await LeaveService.getLeaveRequests(user);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: requests });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async getPendingApprovals(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user as User;
            const requests = await LeaveService.getPendingApprovals(user);
            res.status(HTTP_STATUS.OK).json({ status: 'success', data: requests });
        } catch (error) {
            next(error);
        }
    }

    @Log()
    static async approveLeave(req: Request, res: Response, next: NextFunction) {
        try {
            const { requestId } = req.params;
            const user = (req as any).user as User;
            await LeaveService.approveLeave(parseInt(requestId), req.body, user);
            res.status(HTTP_STATUS.OK).json({ status: 'success' });
        } catch (error) {
            next(error);
        }
    }
}
