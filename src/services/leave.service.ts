import { AppDataSource } from '../config/database';
import { LeaveType } from '../models/LeaveType';
import { LeaveWorkflow } from '../models/LeaveWorkflow';
import { LeaveWorkflowStep } from '../models/LeaveWorkflowStep';
import { LeaveRequest, LeaveRequestStatus } from '../models/LeaveRequest';
import { LeaveApprovalLog, ApprovalStatus } from '../models/LeaveApprovalLog';
import { UserLeaveBalance } from '../models/UserLeaveBalance';
import { User } from '../models/User';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS } from '../constants/http';

export class LeaveService {
    static async createLeaveType(data: any, user: User) {
        const { name, code, isCarryForward } = data;
        const leaveTypeRepo = AppDataSource.getRepository(LeaveType);
        const leaveType = leaveTypeRepo.create({
            subOrganizationId: user.subOrganizationId,
            name,
            code,
            isCarryForward,
        });
        return await leaveTypeRepo.save(leaveType);
    }

    static async getLeaveTypes(user: User) {
        const leaveTypeRepo = AppDataSource.getRepository(LeaveType);
        return await leaveTypeRepo.find({
            where: { subOrganizationId: user.subOrganizationId },
        });
    }

    static async createWorkflow(data: any, user: User) {
        const { name, description, steps } = data;
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const workflowRepo = queryRunner.manager.getRepository(LeaveWorkflow);
            const workflow = workflowRepo.create({
                subOrganizationId: user.subOrganizationId,
                name,
                description,
            });
            await workflowRepo.save(workflow);

            const stepRepo = queryRunner.manager.getRepository(LeaveWorkflowStep);
            for (const step of steps) {
                const workflowStep = stepRepo.create({
                    leaveWorkflowId: workflow.id,
                    stepOrder: step.stepOrder,
                    approverRoleId: step.approverRoleId,
                });
                await stepRepo.save(workflowStep);
            }

            await queryRunner.commitTransaction();
            return workflow;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    static async applyLeave(data: any, user: User) {
        const { leaveTypeId, startDate, endDate, reason, leaveWorkflowId } = data;

        // 1. Check Balance
        const balanceRepo = AppDataSource.getRepository(UserLeaveBalance);
        const balance = await balanceRepo.findOne({
            where: { userId: user.id, leaveTypeId, year: new Date().getFullYear() },
        });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

        if (balance && balance.balance < days) {
            throw new AppError('Insufficient leave balance', HTTP_STATUS.BAD_REQUEST);
        }

        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
        const leaveRequest = leaveRequestRepo.create({
            subOrganizationId: user.subOrganizationId,
            userId: user.id,
            leaveTypeId,
            leaveWorkflowId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            currentStatus: LeaveRequestStatus.PENDING,
            currentStep: 1,
        });

        return await leaveRequestRepo.save(leaveRequest);
    }

    static async getLeaveRequests(user: User) {
        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
        return await leaveRequestRepo.find({
            where: { userId: user.id },
            relations: ['leaveType', 'leaveWorkflow'],
        });
    }

    static async getPendingApprovals(user: User) {
        const userRoles = user.roles.map(r => r.id);
        const requestRepo = AppDataSource.getRepository(LeaveRequest);

        return await requestRepo.createQueryBuilder('request')
            .innerJoin('request.leaveWorkflow', 'workflow')
            .innerJoin('leave_workflow_steps', 'step', 'step.leave_workflow_id = workflow.id AND step.step_order = request.current_step')
            .where('request.current_status = :status', { status: LeaveRequestStatus.PENDING })
            .andWhere('step.approver_role_id IN (:...roles)', { roles: userRoles })
            .andWhere('request.sub_organization_id = :subOrgId', { subOrgId: user.subOrganizationId })
            .getMany();
    }

    static async approveLeave(requestId: number, data: any, user: User) {
        const { status, comments } = data;
        const requestRepo = AppDataSource.getRepository(LeaveRequest);
        const request = await requestRepo.findOne({ where: { id: requestId } });

        if (!request) {
            throw new AppError('Leave request not found', HTTP_STATUS.NOT_FOUND);
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const logRepo = queryRunner.manager.getRepository(LeaveApprovalLog);
            await logRepo.save({
                leaveRequestId: request.id,
                approverUserId: user.id,
                status: status === 'approved' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED,
                comments,
            });

            if (status === 'rejected') {
                request.currentStatus = LeaveRequestStatus.REJECTED;
                await queryRunner.manager.save(request);
            } else {
                const stepRepo = queryRunner.manager.getRepository(LeaveWorkflowStep);
                const nextStep = await stepRepo.findOne({
                    where: { leaveWorkflowId: request.leaveWorkflowId, stepOrder: request.currentStep + 1 }
                });

                if (nextStep) {
                    request.currentStep += 1;
                    await queryRunner.manager.save(request);
                } else {
                    request.currentStatus = LeaveRequestStatus.APPROVED;
                    await queryRunner.manager.save(request);

                    const balanceRepo = queryRunner.manager.getRepository(UserLeaveBalance);
                    const balance = await balanceRepo.findOne({
                        where: { userId: request.userId, leaveTypeId: request.leaveTypeId, year: new Date().getFullYear() }
                    });

                    if (balance) {
                        const start = new Date(request.startDate);
                        const end = new Date(request.endDate);
                        const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

                        balance.used += days;
                        balance.balance -= days;
                        await balanceRepo.save(balance);
                    }
                }
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
