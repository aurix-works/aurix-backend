import express from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { protectTenant } from '../middlewares/auth.tenant.middleware';
import { restrictTo } from '../middlewares/rbac.middleware';

const router = express.Router();

router.use(protectTenant);

/**
 * @swagger
 * /api/leave/leave-types:
 *   post:
 *     summary: Create a new leave type
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               isCarryForward:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Leave type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveType'
 */
router.post('/leave-types', restrictTo('Admin', 'Organization Admin'), LeaveController.createLeaveType);

/**
 * @swagger
 * /api/leave/workflows:
 *   post:
 *     summary: Create a new leave workflow
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, steps]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stepOrder:
 *                       type: integer
 *                     approverRoleId:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Workflow created successfully
 */
router.post('/workflows', restrictTo('Admin', 'Organization Admin'), LeaveController.createWorkflow);


router.get('/leave-types', LeaveController.getLeaveTypes); // Employees need to see types to apply

/**
 * @swagger
 * /api/leave/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [leaveTypeId, startDate, endDate, reason]
 *             properties:
 *               leaveTypeId:
 *                 type: integer
 *               leaveWorkflowId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: 'date-time'
 *               endDate:
 *                 type: string
 *                 format: 'date-time'
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 */
router.post('/apply', LeaveController.applyLeave);

/**
 * @swagger
 * /api/leave/requests:
 *   get:
 *     summary: Get my leave requests
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 */
router.get('/requests', LeaveController.getLeaveRequests);

// Approval Routes
/**
 * @swagger
 * /api/leave/approvals:
 *   get:
 *     summary: Get pending approvals for the current user
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 */
router.get('/approvals', LeaveController.getPendingApprovals); // Logic inside controller handles who can see what

/**
 * @swagger
 * /api/leave/approve/{requestId}:
 *   post:
 *     summary: Approve or reject a leave request
 *     tags: [Leave Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the leave request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request processed
 */
router.post('/approve/:requestId', LeaveController.approveLeave); // Logic inside controller handles who can approve

export default router;
