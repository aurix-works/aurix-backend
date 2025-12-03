import { Request, Response } from 'express';
import { Log } from '../utils/aop';
import { Logger } from '../utils/logger';

export class HealthController {

    @Log()
    static async check(req: Request, res: Response) {
        Logger.info('Health check endpoint called');
        res.status(200).json({
            status: 'success',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
        });
    }
}
