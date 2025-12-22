import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { Department } from '../models/Department';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { Organization } from '../models/Organization';
import { SystemUser } from '../models/SystemUser';
import { User } from '../models/User';
import { DepartmentHeadHistory } from '../models/DepartmentHeadHistory';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('Department Controller Integration Tests', () => {
    let adminToken: string;
    let subOrgId: number;
    let deptId: number;

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

    it('should create a department', async () => {
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Engineering', code: 'ENG', subOrganizationId: subOrgId });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
        deptId = res.body.data.department.id;
    });

    it('should get all departments', async () => {
        const res = await request(app)
            .get('/api/departments')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should update a department', async () => {
        const res = await request(app)
            .put(`/api/departments/${deptId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Engineering Updated' });
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete a department', async () => {
        const res = await request(app)
            .delete(`/api/departments/${deptId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 404 when getting non-existent department', async () => {
        const res = await request(app)
            .get('/api/departments/99999')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    it('should update a department head (trigger history)', async () => {
        // Create a user to be the initial head
        const userRepo = AppDataSource.getRepository(User);
        const initialHead = userRepo.create({
            email: 'initialhead@test.com',
            password: 'Password123!',
            firstName: 'Initial',
            lastName: 'Head',
            subOrganizationId: subOrgId
        });
        await userRepo.save(initialHead);

        // Create a new department with initial head
        const deptRepo = AppDataSource.getRepository(Department);
        const newDept = deptRepo.create({
            name: 'HR',
            code: 'HR',
            subOrganizationId: subOrgId,
            currentHeadUserId: initialHead.id
        });
        await deptRepo.save(newDept);

        // Create history for initial head
        const historyRepo = AppDataSource.getRepository(DepartmentHeadHistory);
        await historyRepo.save({
            departmentId: newDept.id,
            headUserId: initialHead.id,
            isCurrent: true,
            startDate: new Date()
        });

        // Create a user to be the new head
        const newHead = userRepo.create({
            email: 'newhead@test.com',
            password: 'Password123!',
            firstName: 'New',
            lastName: 'Head',
            subOrganizationId: subOrgId
        });
        await userRepo.save(newHead);

        const res = await request(app)
            .put(`/api/departments/${newDept.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ currentHeadUserId: newHead.id });
        expect(res.status).toBe(HTTP_STATUS.OK);
        expect(res.body.data.department.currentHeadUserId).toBe(newHead.id);
    });
});
