import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Permission, PermissionType } from '../models/Permission';
import { Role } from '../models/Role';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { Logger } from '../utils/logger';

async function seed() {
    try {
        await AppDataSource.initialize();
        Logger.info('Database connected for seeding');

        const permissionRepository = AppDataSource.getRepository(Permission);
        const roleRepository = AppDataSource.getRepository(Role);
        const userRepository = AppDataSource.getRepository(User);

        await permissionRepository.delete({});
        await userRepository.delete({});
        await roleRepository.delete({});
        Logger.info('Cleared existing data');

        const permissions = [
            { name: 'user:create', resource: 'users', type: PermissionType.ACTION, description: 'Create new users' },
            { name: 'user:read', resource: 'users', type: PermissionType.ACTION, description: 'View users' },
            { name: 'user:update', resource: 'users', type: PermissionType.ACTION, description: 'Update users' },
            { name: 'user:delete', resource: 'users', type: PermissionType.ACTION, description: 'Delete users' },

            { name: 'role:create', resource: 'roles', type: PermissionType.ACTION, description: 'Create new roles' },
            { name: 'role:read', resource: 'roles', type: PermissionType.ACTION, description: 'View roles' },
            { name: 'role:update', resource: 'roles', type: PermissionType.ACTION, description: 'Update roles' },
            { name: 'role:delete', resource: 'roles', type: PermissionType.ACTION, description: 'Delete roles' },

            { name: 'permission:create', resource: 'permissions', type: PermissionType.ACTION, description: 'Create new permissions' },
            { name: 'permission:read', resource: 'permissions', type: PermissionType.ACTION, description: 'View permissions' },
            { name: 'permission:update', resource: 'permissions', type: PermissionType.ACTION, description: 'Update permissions' },
            { name: 'permission:delete', resource: 'permissions', type: PermissionType.ACTION, description: 'Delete permissions' },

            { name: 'page:dashboard', resource: 'dashboard', type: PermissionType.PAGE, description: 'Access dashboard page' },
            { name: 'page:users', resource: 'users', type: PermissionType.PAGE, description: 'Access users page' },
            { name: 'page:roles', resource: 'roles', type: PermissionType.PAGE, description: 'Access roles page' },
            { name: 'page:reports', resource: 'reports', type: PermissionType.PAGE, description: 'Access reports page' },
            { name: 'page:settings', resource: 'settings', type: PermissionType.PAGE, description: 'Access settings page' },
            { name: 'page:payroll', resource: 'payroll', type: PermissionType.PAGE, description: 'Access payroll page' },
            { name: 'page:attendance', resource: 'attendance', type: PermissionType.PAGE, description: 'Access attendance page' },
            { name: 'page:leave', resource: 'leave', type: PermissionType.PAGE, description: 'Access leave management page' },

            { name: 'employee:read', resource: 'employees', type: PermissionType.ACTION, description: 'View employee details' },
            { name: 'employee:update', resource: 'employees', type: PermissionType.ACTION, description: 'Update employee details' },

            { name: 'payroll:create', resource: 'payroll', type: PermissionType.ACTION, description: 'Create payroll' },
            { name: 'payroll:read', resource: 'payroll', type: PermissionType.ACTION, description: 'View payroll' },
            { name: 'payroll:update', resource: 'payroll', type: PermissionType.ACTION, description: 'Update payroll' },
            { name: 'payroll:approve', resource: 'payroll', type: PermissionType.ACTION, description: 'Approve payroll' },

            { name: 'leave:create', resource: 'leave', type: PermissionType.ACTION, description: 'Create leave request' },
            { name: 'leave:read', resource: 'leave', type: PermissionType.ACTION, description: 'View leave requests' },
            { name: 'leave:approve', resource: 'leave', type: PermissionType.ACTION, description: 'Approve leave requests' },
            { name: 'leave:reject', resource: 'leave', type: PermissionType.ACTION, description: 'Reject leave requests' },

            { name: 'attendance:create', resource: 'attendance', type: PermissionType.ACTION, description: 'Mark attendance' },
            { name: 'attendance:read', resource: 'attendance', type: PermissionType.ACTION, description: 'View attendance' },
            { name: 'attendance:update', resource: 'attendance', type: PermissionType.ACTION, description: 'Update attendance' },
        ];

        const savedPermissions = await permissionRepository.save(permissions);
        Logger.info(`Created ${savedPermissions.length} permissions`);

        const permissionMap = savedPermissions.reduce((acc, perm) => {
            acc[perm.name] = perm;
            return acc;
        }, {} as Record<string, Permission>);

        const adminRole = roleRepository.create({
            name: 'admin',
            description: 'Full system access',
            permissions: savedPermissions,
        });

        const hrManagerRole = roleRepository.create({
            name: 'hr_manager',
            description: 'HR Manager with user and leave management access',
            permissions: [
                permissionMap['user:create'],
                permissionMap['user:read'],
                permissionMap['user:update'],
                permissionMap['role:read'],
                permissionMap['employee:read'],
                permissionMap['employee:update'],
                permissionMap['leave:read'],
                permissionMap['leave:approve'],
                permissionMap['leave:reject'],
                permissionMap['attendance:read'],
                permissionMap['attendance:update'],
                permissionMap['page:dashboard'],
                permissionMap['page:users'],
                permissionMap['page:leave'],
                permissionMap['page:attendance'],
                permissionMap['page:reports'],
            ],
        });

        const financeRole = roleRepository.create({
            name: 'finance',
            description: 'Finance team with payroll access',
            permissions: [
                permissionMap['employee:read'],
                permissionMap['payroll:create'],
                permissionMap['payroll:read'],
                permissionMap['payroll:update'],
                permissionMap['payroll:approve'],
                permissionMap['attendance:read'],
                permissionMap['page:dashboard'],
                permissionMap['page:payroll'],
                permissionMap['page:reports'],
                permissionMap['page:attendance'],
            ],
        });

        const employeeRole = roleRepository.create({
            name: 'employee',
            description: 'Regular employee with basic access',
            permissions: [
                permissionMap['employee:read'],
                permissionMap['leave:create'],
                permissionMap['leave:read'],
                permissionMap['attendance:create'],
                permissionMap['attendance:read'],
                permissionMap['page:dashboard'],
                permissionMap['page:leave'],
                permissionMap['page:attendance'],
            ],
        });

        const savedRoles = await roleRepository.save([adminRole, hrManagerRole, financeRole, employeeRole]);
        Logger.info(`Created ${savedRoles.length} roles`);

        const adminUser = userRepository.create({
            email: 'admin@example.com',
            password: await bcrypt.hash('Admin@123', 12),
            firstName: 'Super',
            lastName: 'Admin',
            roleId: adminRole.id,
            isActive: true,
        });

        await userRepository.save(adminUser);
        Logger.info('Created default admin user');

        Logger.info('Seeding completed successfully!');
        Logger.info('');
        Logger.info('Default Admin Credentials:');
        Logger.info('Email: admin@example.com');
        Logger.info('Password: Admin@123');
        Logger.info('');

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        Logger.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
