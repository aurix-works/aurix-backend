import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http';
import { Log } from '../utils/aop';

export class AuthController {
    @Log()
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                token: result.token,
                data: { user: result.user, type: result.type },
            });
        } catch (error) {
            next(error);
        }
    }
}
