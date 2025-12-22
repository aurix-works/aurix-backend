import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { SystemUser } from '../models/SystemUser';
import { HTTP_STATUS } from '../constants/http';
import jwt from 'jsonwebtoken';
import { config } from '../config';

describe('Permission Controller Integration Tests', () => {
    let adminToken: string;
    let permId: number;

    beforeAll(async () => {
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

    it('should create a permission', async () => {
        const res = await request(app)
            .post('/api/permissions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ slug: 'read:users', description: 'Read Users' });
        expect(res.status).toBe(HTTP_STATUS.CREATED);
        permId = res.body.data.permission.id;
    });

    it('should get all permissions', async () => {
        const res = await request(app)
            .get('/api/permissions')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should update a permission', async () => {
        const res = await request(app)
            .put(`/api/permissions/${permId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ description: 'Read Users Updated' });
        expect(res.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete a permission', async () => {
        const res = await request(app)
            .delete(`/api/permissions/${permId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(HTTP_STATUS.NO_CONTENT);
    });
});
