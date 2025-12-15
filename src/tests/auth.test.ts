import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

describe('Auth API', () => {
    let adminToken: string;

    beforeAll(async () => {
        // Ensure admin exists
        const userRepo = AppDataSource.getRepository(User);
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
            // Ensure isSystemAdmin is true
            admin.isSystemAdmin = true;
            await userRepo.save(admin);
        }
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'Admin@123',
            });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.token).toBeDefined();
        adminToken = res.body.token;
    });

    it('should fail login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'WrongPassword',
            });

        expect(res.status).toBe(401);
    });

    it('should login successfully as non-admin user', async () => {
        const userRepo = AppDataSource.getRepository(User);
        let user = await userRepo.findOneBy({ email: 'user@example.com' });
        if (!user) {
            user = userRepo.create({
                email: 'user@example.com',
                password: 'User@123',
                name: 'Regular User',
                isSystemAdmin: false,
            });
            await userRepo.save(user);
        }

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@example.com',
                password: 'User@123',
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
