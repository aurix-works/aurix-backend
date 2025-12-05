import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../dtos/user.dto';

const userService = new UserService();

export class UserController {
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const createUserDto: CreateUserDto = req.body;

            if (!createUserDto.email || !createUserDto.password || !createUserDto.firstName ||
                !createUserDto.lastName || !createUserDto.roleId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide all required fields: email, password, firstName, lastName, roleId',
                });
            }

            const user = await userService.createUser(createUserDto);

            res.status(201).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const roleId = req.query.roleId as string;

            const result = await userService.getAllUsers(page, limit, roleId);

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateUserDto: UpdateUserDto = req.body;

            const user = await userService.updateUser(id, updateUserDto);

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);

            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const loginDto: LoginDto = req.body;

            if (!loginDto.email || !loginDto.password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide email and password',
                });
            }

            const result = await userService.login(loginDto);

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const permissions = await userService.getUserPermissions(userId);

            res.status(200).json({
                status: 'success',
                data: { permissions },
            });
        } catch (error) {
            next(error);
        }
    }
}
