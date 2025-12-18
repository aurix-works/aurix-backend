import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { SystemUser } from '../models/SystemUser';

describe('SaaS Infrastructure API', () => {
    let adminToken: string;
    let serviceId: number;
    let planId: number;
    let orgId: number;
    let subOrgId: number;

    beforeAll(async () => {
        // Ensure admin exists and get token
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

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'Admin@123' });
        adminToken = loginRes.body.token;
    });

    // 1. System Services Tests
    describe('System Services', () => {
        it('should create a new service', async () => {
            const res = await request(app)
                .post('/api/services')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Service',
                    code: 'TEST_SVC',
                    description: 'Test Description',
                });
            expect(res.status).toBe(201);
            expect(res.body.data.service.code).toBe('TEST_SVC');
            serviceId = res.body.data.service.id;
        });

        it('should get all services', async () => {
            const res = await request(app)
                .get('/api/services')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.services)).toBe(true);
        });
    });

    // 2. Plans Tests
    describe('Plans', () => {
        it('should create a new plan', async () => {
            const res = await request(app)
                .post('/api/plans')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Plan',
                    code: 'TEST_PLAN',
                    priceMonthly: 10,
                    priceYearly: 100,
                    serviceIds: [serviceId],
                });
            expect(res.status).toBe(201);
            expect(res.body.data.plan.code).toBe('TEST_PLAN');
            planId = res.body.data.plan.id;
        });
    });

    // 3. Organizations Tests
    describe('Organizations', () => {
        it('should create a new organization', async () => {
            const res = await request(app)
                .post('/api/organizations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Org',
                    domain: 'test.com',
                });
            expect(res.status).toBe(201);
            orgId = res.body.data.organization.id;
        });
    });

    // 4. Sub-Organizations Tests
    describe('Sub-Organizations', () => {
        it('should create a new sub-organization', async () => {
            const res = await request(app)
                .post('/api/sub-organizations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    organizationId: orgId,
                    name: 'Test Sub Org',
                    contactEmail: 'test@test.com',
                });
            expect(res.status).toBe(201);
            subOrgId = res.body.data.subOrganization.id;
        });
    });

    // 5. Subscriptions Tests
    describe('Subscriptions', () => {
        it('should create a new subscription', async () => {
            const res = await request(app)
                .post('/api/subscriptions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    subOrganizationId: subOrgId,
                    planId: planId,
                    startDate: '2024-01-01',
                    nextBillingDate: '2024-02-01',
                    status: 'active',
                });
            expect(res.status).toBe(201);
        });
    });
});
