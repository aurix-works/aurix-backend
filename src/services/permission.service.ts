import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permission.dto';
import { AppError } from '../middlewares/error.middleware';

export class PermissionService {
    private permissionRepository: Repository<Permission>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const { name, resource, type, description } = createPermissionDto;

        const existingPermission = await this.permissionRepository.findOne({ where: { name } });
        if (existingPermission) {
            throw new AppError('Permission with this name already exists', 400);
        }

        const permission = this.permissionRepository.create({
            name,
            resource,
            type,
            description,
        });

        return await this.permissionRepository.save(permission);
    }

    async getPermissionById(id: string): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new AppError('Permission not found', 404);
        }
        return permission;
    }

    async getAllPermissions(): Promise<Permission[]> {
        return await this.permissionRepository.find({ order: { resource: 'ASC', name: 'ASC' } });
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
            const existingPermission = await this.permissionRepository.findOne({
                where: { name: updatePermissionDto.name },
            });
            if (existingPermission) {
                throw new AppError('Permission name already in use', 400);
            }
        }

        Object.assign(permission, updatePermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async deletePermission(id: string): Promise<void> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!permission) {
            throw new AppError('Permission not found', 404);
        }

        if (permission.roles && permission.roles.length > 0) {
            throw new AppError('Cannot delete permission assigned to roles', 400);
        }

        await this.permissionRepository.remove(permission);
    }
}
