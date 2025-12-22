import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { Organization } from '../models/Organization';
import { SystemUser } from '../models/SystemUser';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('Role Controller Integration Tests', () => {
    let adminToken: string;
    let subOrgId: number;
    let roleId: number;

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

    it('should create a role', async () => {
        const res = await request(app)
            .post('/api/roles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Manager', description: 'Manager Role', subOrganizationId: subOrgId });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
        roleId = res.body.data.role.id;
    });

    it('should get all roles', async () => {
        const res = await request(app)
            .get('/api/roles')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should update a role', async () => {
        const res = await request(app)
            .put(`/api/roles/${roleId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Senior Manager' });
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete a role', async () => {
        const res = await request(app)
            .delete(`/api/roles/${roleId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 404 when updating non-existent role', async () => {
        const res = await request(app)
            .put('/api/roles/99999')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Ghost Role' });
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    });
});
