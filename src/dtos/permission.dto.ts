import { PermissionType } from '../models/Permission';

export interface CreatePermissionDto {
    name: string;
    resource: string;
    type: PermissionType;
    description?: string;
}

export interface UpdatePermissionDto {
    name?: string;
    resource?: string;
    type?: PermissionType;
    description?: string;
    isActive?: boolean;
}
