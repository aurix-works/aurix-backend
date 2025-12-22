import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { SystemUser } from '../models/SystemUser';
import { Organization } from '../models/Organization';
import { SubOrganization, AccountStatus } from '../models/SubOrganization';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { LeaveType } from '../models/LeaveType';
import { UserLeaveBalance } from '../models/UserLeaveBalance';

describe('Leave Management API', () => {
    let systemAdminToken: string;
    let tenantAdminToken: string;
    let employeeToken: string;
    let subOrgId: number;
    let adminRoleId: number;
    let employeeRoleId: number;
    let leaveTypeId: number;
    let leaveWorkflowId: number;
    let leaveRequestId: number;
    let employeeUserId: number;

    beforeAll(async () => {
        // 1. Create System Admin & Login
        const userRepo = AppDataSource.getRepository(SystemUser);
        let sysAdmin = await userRepo.findOneBy({ email: 'sysadmin@example.com' });
        if (!sysAdmin) {
            sysAdmin = userRepo.create({
                email: 'sysadmin@example.com',
                password: 'Admin@123',
                name: 'System Admin',
                isSystemAdmin: true,
            });
            await userRepo.save(sysAdmin);
        } else {
            sysAdmin.isSystemAdmin = true;
            await userRepo.save(sysAdmin);
        }

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'sysadmin@example.com', password: 'Admin@123' });
        systemAdminToken = loginRes.body.token;

        // 2. Create Org & SubOrg
        const orgRepo = AppDataSource.getRepository(Organization);
        const org = orgRepo.create({ name: 'Leave Test Org', domain: 'leave-test.com' });
        await orgRepo.save(org);

        const subOrgRepo = AppDataSource.getRepository(SubOrganization);
        const subOrg = subOrgRepo.create({
            organization: org,
            organizationId: org.id,
            name: 'Leave Test HQ',
            accountStatus: AccountStatus.ACTIVE,
            contactEmail: 'leave-test@test.com',
        });
        await subOrgRepo.save(subOrg);
        subOrgId = subOrg.id;

        // 3. Create Roles (Admin & Employee)
        const roleRepo = AppDataSource.getRepository(Role);
        const adminRole = roleRepo.create({ subOrganizationId: subOrgId, name: 'Admin', description: 'Admin Role' });
        await roleRepo.save(adminRole);
        adminRoleId = adminRole.id;

        const employeeRole = roleRepo.create({ subOrganizationId: subOrgId, name: 'Employee', description: 'Employee Role' });
        await roleRepo.save(employeeRole);
        employeeRoleId = employeeRole.id;

        // 4. Create Tenant Admin User
        const tenantUserRepo = AppDataSource.getRepository(User);
        const adminUser = tenantUserRepo.create({
            subOrganizationId: subOrgId,
            email: 'admin@leave-test.com',
            password: 'User@123',
            firstName: 'Admin',
            lastName: 'User',
            roles: [adminRole]
        });
        await tenantUserRepo.save(adminUser);

        // 5. Create Employee User
        const employeeUser = tenantUserRepo.create({
            subOrganizationId: subOrgId,
            email: 'employee@leave-test.com',
            password: 'User@123',
            firstName: 'Employee',
            lastName: 'User',
            roles: [employeeRole]
        });
        await tenantUserRepo.save(employeeUser);
        employeeUserId = employeeUser.id;

        // 6. Login as Tenant Admin
        const adminLoginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@leave-test.com', password: 'User@123' });
        tenantAdminToken = adminLoginRes.body.token;

        // 7. Login as Employee
        const employeeLoginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'employee@leave-test.com', password: 'User@123' });
        employeeToken = employeeLoginRes.body.token;
    });

    describe('Leave Configuration (Admin)', () => {
        it('should create a leave type as Admin', async () => {
            const res = await request(app)
                .post('/api/leave/leave-types')
                .set('Authorization', `Bearer ${tenantAdminToken}`)
                .send({
                    name: 'Sick Leave',
                    code: 'SL',
                    isCarryForward: false
                });

            expect(res.status).toBe(201);
            expect(res.body.data.name).toBe('Sick Leave');
            leaveTypeId = res.body.data.id;
        });

        it('should NOT allow Employee to create leave type', async () => {
            const res = await request(app)
                .post('/api/leave/leave-types')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    name: 'Casual Leave',
                    code: 'CL'
                });

            expect(res.status).toBe(403);
        });

        it('should create a leave workflow as Admin', async () => {
            const res = await request(app)
                .post('/api/leave/workflows')
                .set('Authorization', `Bearer ${tenantAdminToken}`)
                .send({
                    name: 'Standard Approval',
                    description: 'Manager then HR',
                    steps: [
                        { stepOrder: 1, approverRoleId: adminRoleId } // Admin approves step 1
                    ]
                });

            expect(res.status).toBe(201);
            leaveWorkflowId = res.body.data.id;
        });
    });

    describe('Leave Application (Employee)', () => {
        beforeAll(async () => {
            // Credit leave balance for employee manually for testing
            const balanceRepo = AppDataSource.getRepository(UserLeaveBalance);
            await balanceRepo.save({
                userId: employeeUserId,
                leaveTypeId: leaveTypeId,
                year: new Date().getFullYear(),
                totalCredited: 10,
                used: 0,
                balance: 10
            });
        });

        it('should apply for leave', async () => {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + 1); // 2 days

            const res = await request(app)
                .post('/api/leave/apply')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    leaveTypeId,
                    leaveWorkflowId, // Assuming frontend sends this or we default it
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    reason: 'Feeling unwell'
                });

            expect(res.status).toBe(201);
            expect(res.body.data.currentStatus).toBe('pending');
            leaveRequestId = res.body.data.id;
        });

        it('should get my leave requests', async () => {
            const res = await request(app)
                .get('/api/leave/requests')
                .set('Authorization', `Bearer ${employeeToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('Leave Approval (Approver)', () => {
        it('should see pending approvals as Admin (Approver)', async () => {
            const res = await request(app)
                .get('/api/leave/approvals')
                .set('Authorization', `Bearer ${tenantAdminToken}`);

            expect(res.status).toBe(200);
            // Should find the request created above since Admin role is the approver
            const found = res.body.data.find((r: any) => r.id === leaveRequestId);
            expect(found).toBeDefined();
        });

        it('should approve the leave request', async () => {
            const res = await request(app)
                .post(`/api/leave/approve/${leaveRequestId}`)
                .set('Authorization', `Bearer ${tenantAdminToken}`)
                .send({
                    status: 'approved',
                    comments: 'Get well soon'
                });

            expect(res.status).toBe(200);
        });

        it('should verify leave status is approved', async () => {
            const res = await request(app)
                .get('/api/leave/requests')
                .set('Authorization', `Bearer ${employeeToken}`);

            const leaveRequest = res.body.data.find((r: any) => r.id === leaveRequestId);
            expect(leaveRequest.currentStatus).toBe('approved');
        });
    });
});
