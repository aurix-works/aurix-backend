import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { Organization } from '../models/Organization';
import { SystemUser } from '../models/SystemUser';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('User Controller Integration Tests', () => {
    let adminToken: string;
    let subOrgId: number;
    let userId: number;

    beforeAll(async () => {
        // Create Organization
        const orgRepo = AppDataSource.getRepository(Organization);
        const org = orgRepo.create({ name: 'Test Org', domain: 'test.com' });
        await orgRepo.save(org);

        // Create SubOrganization
        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = subOrgRepo.create({
            organizationId: org.id,
            name: 'Test SubOrg',
            contactEmail: 'test@sub.com',
            accountStatus: AccountStatus.ACTIVE
        });
        await subOrgRepo.save(subOrg);
        subOrgId = subOrg.id;

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

    it('should create a user', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'employee@test.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                subOrganizationId: subOrgId
            });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
        userId = res.body.data.user.id;
    });

    it('should fail to create user with duplicate email', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'employee@test.com', // Same email as above
                password: 'Password123!',
                firstName: 'Duplicate',
                lastName: 'User',
                subOrganizationId: subOrgId
            });
        expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should create user with manager', async () => {
        // Create a manager first
        const userRepo = AppDataSource.getRepository(User);
        const manager = userRepo.create({
            email: 'manager@test.com',
            password: 'Password123!',
            firstName: 'Manager',
            lastName: 'User',
            subOrganizationId: subOrgId
        });
        await userRepo.save(manager);

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'subordinate@test.com',
                password: 'Password123!',
                firstName: 'Sub',
                lastName: 'Ordinate',
                subOrganizationId: subOrgId,
                currentManagerId: manager.id
            });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
        expect(res.body.data.user.currentManagerId).toBe(manager.id);
    });

    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should update a user', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ firstName: 'Johnny' });
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete a user', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 404 when deleting non-existent user', async () => {
        const res = await request(app)
            .delete('/api/users/99999')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    });
});
