import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { Organization } from '../models/Organization';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { SystemUser } from '../models/SystemUser';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('Organization Controller Integration Tests', () => {
    let adminToken: string;
    let organizationId: number;

    beforeAll(async () => {
        // Create Organization
        const orgRepo = AppDataSource.getRepository(Organization);
        const org = orgRepo.create({ name: 'Test Org', domain: 'test.com' });
        await orgRepo.save(org);
        organizationId = org.id;

        // Create SubOrganization
        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = subOrgRepo.create({
            organizationId: org.id,
            name: 'Test SubOrg',
            contactEmail: 'test@sub.com',
            accountStatus: AccountStatus.ACTIVE
        });
        await subOrgRepo.save(subOrg);

        // Create Admin User (System Admin)
        const userRepo = AppDataSource.getRepository(SystemUser);
        const admin = userRepo.create({
            email: 'admin@test.com',
            password: 'Password123!',
            name: 'System Admin',
            isSystemAdmin: true
        });
        await userRepo.save(admin);

        // Generate Token
        adminToken = jwt.sign(
            { userId: admin.id, type: 'system' },
            config.jwt.secret,
            { expiresIn: '1h' }
        );
    });

    it('should get all organizations', async () => {
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.OK);
        expect(res.body.data.organizations).toBeDefined();
    });

    it('should create an organization', async () => {
        const res = await request(app)
            .post('/api/organizations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'New Org', domain: 'new.com' });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
    });

    it('should update an organization', async () => {
        const res = await request(app)
            .put(`/api/organizations/${organizationId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Org' });
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete an organization', async () => {
        // Create a temp org to delete
        const orgRepo = AppDataSource.getRepository(Organization);
        const tempOrg = orgRepo.create({ name: 'Temp', domain: 'temp.com' });
        await orgRepo.save(tempOrg);

        const res = await request(app)
            .delete(`/api/organizations/${tempOrg.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 404 when deleting non-existent organization', async () => {
        const res = await request(app)
            .delete('/api/organizations/99999')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    });
});
