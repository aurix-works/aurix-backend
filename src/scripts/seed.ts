import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Logger } from '../utils/logger';
import { SystemUser } from '../models/SystemUser';
import { SystemService } from '../models/SystemService';
import { Plan } from '../models/Plan';
import { Organization } from '../models/Organization';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { SubOrgSubscription, SubscriptionStatus } from '../models/SubOrgSubscription';
import { Department } from '../models/Department';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

async function seed() {
    try {
        await AppDataSource.initialize();
        await AppDataSource.synchronize();
        Logger.info('Database connected for seeding');

        // 1. Create System Admin
        const userRepo = AppDataSource.getRepository(SystemUser);
        const adminEmail = 'admin@example.com';
        let admin = await userRepo.findOneBy({ email: adminEmail });

        if (!admin) {
            admin = userRepo.create({
                email: adminEmail,
                password: 'Admin@123',
                name: 'System Admin',
                isSystemAdmin: true,
            });
            await userRepo.save(admin);
            Logger.info('Created System Admin: admin@example.com / Admin@123');
        } else {
            Logger.info('System Admin already exists');
        }

        // 2. Create System Services
        const serviceRepo = AppDataSource.getRepository(SystemService);
        const servicesData = [
            { name: 'User Management', code: 'USER_MGMT', description: 'Manage users and roles' },
            { name: 'Leave Management', code: 'LEAVE_MGMT', description: 'Manage employee leaves' },
            { name: 'Payroll', code: 'PAYROLL', description: 'Process payroll' },
        ];

        const createdServices: SystemService[] = [];
        for (const data of servicesData) {
            let service = await serviceRepo.findOneBy({ code: data.code });
            if (!service) {
                service = serviceRepo.create(data);
                await serviceRepo.save(service);
                Logger.info(`Created Service: ${data.name}`);
            }
            createdServices.push(service);
        }

        // 3. Create Plans
        const planRepo = AppDataSource.getRepository(Plan);
        const plansData = [
            { name: 'Basic Plan', code: 'BASIC', priceMonthly: 10.00, priceYearly: 100.00, services: [createdServices[0], createdServices[1]] },
            { name: 'Enterprise Plan', code: 'ENTERPRISE', priceMonthly: 50.00, priceYearly: 500.00, services: createdServices },
        ];

        for (const data of plansData) {
            let plan = await planRepo.findOneBy({ code: data.code });
            if (!plan) {
                plan = planRepo.create(data);
                await planRepo.save(plan);
                Logger.info(`Created Plan: ${data.name}`);
            }
        }

        // 4. Create Organization
        const orgRepo = AppDataSource.getRepository(Organization);
        const orgName = 'Acme Corp';
        let org = await orgRepo.findOneBy({ name: orgName });
        if (!org) {
            org = orgRepo.create({ name: orgName, domain: 'acme.com' });
            await orgRepo.save(org);
            Logger.info(`Created Organization: ${orgName}`);
        }

        // 5. Create Sub-Organization
        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrgName = 'Acme HQ';
        let subOrg = await subOrgRepo.findOneBy({ name: subOrgName });
        if (!subOrg) {
            subOrg = subOrgRepo.create({
                organization: org,
                organizationId: org.id,
                name: subOrgName,
                accountStatus: AccountStatus.ACTIVE,
                contactEmail: 'contact@acme.com',
            });
            await subOrgRepo.save(subOrg);
            Logger.info(`Created Sub-Organization: ${subOrgName}`);
        }

        // 6. Create Departments
        const deptRepo = AppDataSource.getRepository(Department);
        const deptName = 'Engineering';
        let dept = await deptRepo.findOneBy({ name: deptName, subOrganizationId: subOrg.id });
        if (!dept) {
            dept = deptRepo.create({
                subOrganization: subOrg,
                subOrganizationId: subOrg.id,
                name: deptName,
                code: 'ENG',
            });
            await deptRepo.save(dept);
            Logger.info(`Created Department: ${deptName}`);
        }

        // 7. Create Permissions
        const permRepo = AppDataSource.getRepository(Permission);
        const permSlug = 'manage_users';
        let perm = await permRepo.findOneBy({ slug: permSlug });
        if (!perm) {
            perm = permRepo.create({
                slug: permSlug,
                description: 'Can manage users',
            });
            await permRepo.save(perm);
            Logger.info(`Created Permission: ${permSlug}`);
        }

        // 8. Create Roles
        const roleRepo = AppDataSource.getRepository(Role);
        const roleName = 'Manager';
        let role = await roleRepo.findOne({ where: { name: roleName, subOrganizationId: subOrg.id } });
        if (!role) {
            role = roleRepo.create({
                subOrganization: subOrg,
                subOrganizationId: subOrg.id,
                name: roleName,
                description: 'Department Manager',
                permissions: [perm],
            });
            await roleRepo.save(role);
            Logger.info(`Created Role: ${roleName}`);
        }

        // 9. Create Tenant User
        const tenantUserRepo = AppDataSource.getRepository(User);
        const tenantEmail = 'employee@acme.com';
        let tenantUser = await tenantUserRepo.findOneBy({ email: tenantEmail, subOrganizationId: subOrg.id });
        if (!tenantUser) {
            tenantUser = tenantUserRepo.create({
                subOrganization: subOrg,
                subOrganizationId: subOrg.id,
                email: tenantEmail,
                password: 'Employee@123',
                firstName: 'John',
                lastName: 'Doe',
                employeeCode: 'E001',
                designation: 'Software Engineer',
                roles: [role],
            });
            await tenantUserRepo.save(tenantUser);
            Logger.info(`Created Tenant User: ${tenantEmail} / Employee@123`);
        }



        Logger.info('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        Logger.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
