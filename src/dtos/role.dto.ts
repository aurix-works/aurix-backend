export interface CreateRoleDto {
    name: string;
    description?: string;
    permissionIds?: string[];
}

export interface UpdateRoleDto {
    name?: string;
    description?: string;
    permissionIds?: string[];
    isActive?: boolean;
}

export interface RoleResponseDto {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    permissions: PermissionResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PermissionResponseDto {
    id: string;
    name: string;
    resource: string;
    type: string;
    description?: string;
}
