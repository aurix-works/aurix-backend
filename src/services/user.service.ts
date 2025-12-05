import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { CreateUserDto, UpdateUserDto, UserResponseDto, LoginDto, LoginResponseDto } from '../dtos/user.dto';
import { config } from '../config';
import { AppError } from '../middlewares/error.middleware';

export class UserService {
    private userRepository: Repository<User>;
    private roleRepository: Repository<Role>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.roleRepository = AppDataSource.getRepository(Role);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { email, password, firstName, lastName, phoneNumber, roleId } = createUserDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            throw new AppError('Role not found', 404);
        }

        if (!role.isActive) {
            throw new AppError('Role is not active', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            roleId,
        });

        const savedUser = await this.userRepository.save(user);
        return this.mapToUserResponse(savedUser);
    }

    async getUserById(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return this.mapToUserResponse(user);
    }

    async getAllUsers(
        page: number = 1,
        limit: number = 10,
        roleId?: string
    ): Promise<{ users: UserResponseDto[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (roleId) {
            where.roleId = roleId;
        }

        const [users, total] = await this.userRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            users: users.map((user) => this.mapToUserResponse(user)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }
        }

        if (updateUserDto.roleId) {
            const role = await this.roleRepository.findOne({ where: { id: updateUserDto.roleId } });
            if (!role) {
                throw new AppError('Role not found', 404);
            }
            if (!role.isActive) {
                throw new AppError('Role is not active', 400);
            }
        }

        Object.assign(user, updateUserDto);
        const updatedUser = await this.userRepository.save(user);
        return this.mapToUserResponse(updatedUser);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        await this.userRepository.remove(user);
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!user.isActive) {
            throw new AppError('Your account has been deactivated', 403);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        user.lastLoginAt = new Date();
        await this.userRepository.save(user);

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                roleId: user.roleId,
                roleName: user.role.name,
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        return {
            user: this.mapToUserResponse(user),
            token,
        };
    }

    async checkPermission(userId: string, permissionName: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.role) {
            return false;
        }

        return user.role.permissions.some(
            (permission) => permission.name === permissionName && permission.isActive
        );
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.role) {
            return [];
        }

        return user.role.permissions
            .filter((permission) => permission.isActive)
            .map((permission) => permission.name);
    }

    private mapToUserResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
            role: {
                id: user.role.id,
                name: user.role.name,
                description: user.role.description,
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt,
        };
    }
}
