export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    roleId: string;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    roleId?: string;
    isActive?: boolean;
}

export interface UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    isActive: boolean;
    role: {
        id: string;
        name: string;
        description?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    user: UserResponseDto;
    token: string;
}
