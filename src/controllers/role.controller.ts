import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';

const roleService = new RoleService();

export class RoleController {
    static async createRole(req: Request, res: Response, next: NextFunction) {
        try {
            const createRoleDto: CreateRoleDto = req.body;

            if (!createRoleDto.name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide role name',
                });
            }

            const role = await roleService.createRole(createRoleDto);

            res.status(201).json({
                status: 'success',
                data: { role },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getRoleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const role = await roleService.getRoleById(id);

            res.status(200).json({
                status: 'success',
                data: { role },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await roleService.getAllRoles();

            res.status(200).json({
                status: 'success',
                data: { roles },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateRoleDto: UpdateRoleDto = req.body;

            const role = await roleService.updateRole(id, updateRoleDto);

            res.status(200).json({
                status: 'success',
                data: { role },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await roleService.deleteRole(id);

            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
