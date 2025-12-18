import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { SystemUser } from '../models/SystemUser';
import { Organization } from '../models/Organization';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { Department } from '../models/Department';
import { Permission } from '../models/Permission';
import { Role } from '../models/Role';
import { User } from '../models/User';

describe('Tenant API', () => {
    let adminToken: string;
    let tenantToken: string;
    let subOrgId: number;
    let roleId: number;
    let permissionId: number;
    let departmentId: number;
    let tenantUserId: number;

    beforeAll(async () => {
        // Create System Admin
        const userRepo = AppDataSource.getRepository(SystemUser);
        let admin = await userRepo.findOneBy({ email: 'admin@example.com' });
        if (!admin) {
            admin = userRepo.create({
                email: 'admin@example.com',
                password: 'Admin@123',
                name: 'System Admin',
                isSystemAdmin: true,
            });
            await userRepo.save(admin);
        } else {
            admin.isSystemAdmin = true;
            await userRepo.save(admin);
        }

        // Login as Admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'Admin@123',
            });
        adminToken = loginRes.body.token;

        // Create Org and SubOrg
        const orgRepo = AppDataSource.getRepository(Organization);
        const org = orgRepo.create({ name: 'Tenant Test Org', domain: 'tenant-test.com' });
        await orgRepo.save(org);

        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = subOrgRepo.create({
            organization: org,
            organizationId: org.id,
            name: 'Tenant Test HQ',
            accountStatus: AccountStatus.ACTIVE,
            contactEmail: 'tenant-test@test.com',
        });
        await subOrgRepo.save(subOrg);
        subOrgId = subOrg.id;
    });

    describe('Permission Management', () => {
        it('should create a permission', async () => {
            const res = await request(app)
                .post('/api/permissions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    slug: 'test_permission',
                    description: 'Test Permission',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.permission.slug).toBe('test_permission');
            permissionId = res.body.data.permission.id;
        });

        it('should get all permissions', async () => {
            const res = await request(app)
                .get('/api/permissions')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.permissions.length).toBeGreaterThan(0);
        });
    });

    describe('Role Management', () => {
        it('should create a role', async () => {
            const res = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    subOrganizationId: subOrgId,
                    name: 'Test Role',
                    description: 'Test Role Description',
                    permissionIds: [permissionId],
                });

            expect(res.status).toBe(201);
            expect(res.body.data.role.name).toBe('Test Role');
            roleId = res.body.data.role.id;
        });
    });

    describe('Department Management', () => {
        it('should create a department', async () => {
            const res = await request(app)
                .post('/api/departments')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    subOrganizationId: subOrgId,
                    name: 'Test Department',
                    code: 'TEST_DEPT',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.department.name).toBe('Test Department');
            departmentId = res.body.data.department.id;
        });
    });

    describe('User Management', () => {
        it('should create a tenant user', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    subOrganizationId: subOrgId,
                    email: 'tenant-user@test.com',
                    password: 'User@123',
                    firstName: 'Tenant',
                    lastName: 'User',
                    employeeCode: 'T001',
                    designation: 'Tester',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.user.email).toBe('tenant-user@test.com');
            tenantUserId = res.body.data.user.id;
        });

        it('should login as tenant user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'tenant-user@test.com',
                    password: 'User@123',
                });

            expect(res.status).toBe(200);
            expect(res.body.data.type).toBe('tenant');
            tenantToken = res.body.token;
        });
    });
});
