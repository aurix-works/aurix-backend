import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permission.dto';

const permissionService = new PermissionService();

export class PermissionController {
    static async createPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const createPermissionDto: CreatePermissionDto = req.body;

            if (!createPermissionDto.name || !createPermissionDto.resource || !createPermissionDto.type) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide name, resource, and type',
                });
            }

            const permission = await permissionService.createPermission(createPermissionDto);

            res.status(201).json({
                status: 'success',
                data: { permission },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPermissionById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await permissionService.getPermissionById(id);

            res.status(200).json({
                status: 'success',
                data: { permission },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const permissions = await permissionService.getAllPermissions();

            res.status(200).json({
                status: 'success',
                data: { permissions },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updatePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatePermissionDto: UpdatePermissionDto = req.body;

            const permission = await permissionService.updatePermission(id, updatePermissionDto);

            res.status(200).json({
                status: 'success',
                data: { permission },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deletePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await permissionService.deletePermission(id);

            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
