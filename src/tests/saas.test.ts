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

        it('should update a service', async () => {
            const res = await request(app)
                .put(`/api/services/${serviceId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Service' });
            expect(res.status).toBe(200);
            expect(res.body.data.service.name).toBe('Updated Service');
        });

        it('should delete a service', async () => {
            const res = await request(app)
                .delete(`/api/services/${serviceId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 when updating non-existent service', async () => {
            const res = await request(app)
                .put('/api/services/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Ghost Service' });
            expect(res.status).toBe(404);
        });
    });

    // 2. Plans Tests
    describe('Plans', () => {
        // Re-create service for plan tests since it was deleted
        beforeAll(async () => {
            const res = await request(app)
                .post('/api/services')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Plan Service', code: 'PLAN_SVC', description: 'Desc' });
            serviceId = res.body.data.service.id;
        });

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

        it('should get all plans', async () => {
            const res = await request(app)
                .get('/api/plans')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
        });

        it('should update a plan', async () => {
            const res = await request(app)
                .put(`/api/plans/${planId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Plan', priceMonthly: 20 });
            expect(res.status).toBe(200);
            expect(res.body.data.plan.priceMonthly).toBe(20);
        });

        it('should delete a plan', async () => {
            const res = await request(app)
                .delete(`/api/plans/${planId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 when updating non-existent plan', async () => {
            const res = await request(app)
                .put('/api/plans/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Ghost Plan' });
            expect(res.status).toBe(404);
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

        it('should update an organization', async () => {
            const res = await request(app)
                .put(`/api/organizations/${orgId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Org' });
            expect(res.status).toBe(200);
        });

        // Note: We don't delete org here because sub-org tests depend on it
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

        it('should get all sub-organizations', async () => {
            const res = await request(app)
                .get('/api/sub-organizations')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
        });

        it('should update a sub-organization', async () => {
            const res = await request(app)
                .put(`/api/sub-organizations/${subOrgId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Sub Org' });
            expect(res.status).toBe(200);
        });

        it('should return 404 when updating non-existent sub-organization', async () => {
            const res = await request(app)
                .put('/api/sub-organizations/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Ghost Sub Org' });
            expect(res.status).toBe(404);
        });

        it('should delete a sub-organization', async () => {
            // Create a temp sub-org to delete
            const resCreate = await request(app)
                .post('/api/sub-organizations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    organizationId: orgId,
                    name: 'Temp Sub Org',
                    contactEmail: 'temp@test.com',
                });
            const tempId = resCreate.body.data.subOrganization.id;

            const res = await request(app)
                .delete(`/api/sub-organizations/${tempId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 when deleting non-existent sub-organization', async () => {
            const res = await request(app)
                .delete('/api/sub-organizations/99999')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });
    });

    // 5. Subscriptions Tests
    describe('Subscriptions', () => {
        let subscriptionId: number;

        // Re-create plan for subscription tests
        beforeAll(async () => {
            const res = await request(app)
                .post('/api/plans')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Sub Plan',
                    code: 'SUB_PLAN',
                    priceMonthly: 10,
                    priceYearly: 100,
                    serviceIds: [serviceId],
                });
            planId = res.body.data.plan.id;
        });

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
            subscriptionId = res.body.data.subscription.id;
        });

        it('should get all subscriptions', async () => {
            const res = await request(app)
                .get('/api/subscriptions')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
        });

        it('should update a subscription', async () => {
            const res = await request(app)
                .put(`/api/subscriptions/${subscriptionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'cancelled' });
            expect(res.status).toBe(200);
        });

        it('should delete a subscription', async () => {
            const res = await request(app)
                .delete(`/api/subscriptions/${subscriptionId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 when updating non-existent subscription', async () => {
            const res = await request(app)
                .put('/api/subscriptions/99999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'active' });
            expect(res.status).toBe(404);
        });

        it('should return 404 when deleting non-existent subscription', async () => {
            const res = await request(app)
                .delete('/api/subscriptions/99999')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });
    });
});
