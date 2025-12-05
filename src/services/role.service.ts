import { Repository, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '../dtos/role.dto';
import { AppError } from '../middlewares/error.middleware';

export class RoleService {
    private roleRepository: Repository<Role>;
    private permissionRepository: Repository<Permission>;

    constructor() {
        this.roleRepository = AppDataSource.getRepository(Role);
        this.permissionRepository = AppDataSource.getRepository(Permission);
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
        const { name, description, permissionIds } = createRoleDto;

        const existingRole = await this.roleRepository.findOne({ where: { name } });
        if (existingRole) {
            throw new AppError('Role with this name already exists', 400);
        }

        let permissions: Permission[] = [];
        if (permissionIds && permissionIds.length > 0) {
            permissions = await this.permissionRepository.find({
                where: { id: In(permissionIds) },
            });

            if (permissions.length !== permissionIds.length) {
                throw new AppError('One or more permissions not found', 404);
            }
        }

        const role = this.roleRepository.create({
            name,
            description,
            permissions,
        });

        const savedRole = await this.roleRepository.save(role);
        return this.mapToRoleResponse(savedRole);
    }

    async getRoleById(id: string): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new AppError('Role not found', 404);
        }
        return this.mapToRoleResponse(role);
    }

    async getAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.roleRepository.find({ order: { name: 'ASC' } });
        return roles.map((role) => this.mapToRoleResponse(role));
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.roleRepository.findOne({
                where: { name: updateRoleDto.name },
            });
            if (existingRole) {
                throw new AppError('Role name already in use', 400);
            }
        }

        if (updateRoleDto.permissionIds) {
            const permissions = await this.permissionRepository.find({
                where: { id: In(updateRoleDto.permissionIds) },
            });

            if (permissions.length !== updateRoleDto.permissionIds.length) {
                throw new AppError('One or more permissions not found', 404);
            }

            role.permissions = permissions;
        }

        if (updateRoleDto.name) role.name = updateRoleDto.name;
        if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;
        if (updateRoleDto.isActive !== undefined) role.isActive = updateRoleDto.isActive;

        const updatedRole = await this.roleRepository.save(role);
        return this.mapToRoleResponse(updatedRole);
    }

    async deleteRole(id: string): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['users'] });
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        if (role.users && role.users.length > 0) {
            throw new AppError('Cannot delete role with assigned users', 400);
        }

        await this.roleRepository.remove(role);
    }

    private mapToRoleResponse(role: Role): RoleResponseDto {
        return {
            id: role.id,
            name: role.name,
            description: role.description,
            isActive: role.isActive,
            permissions: role.permissions.map((permission) => ({
                id: permission.id,
                name: permission.name,
                resource: permission.resource,
                type: permission.type,
                description: permission.description,
            })),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
}
