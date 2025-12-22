import express from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permission.dto';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get('/', PermissionController.getAll);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 */
router.post('/', validateDto(CreatePermissionDto), PermissionController.create);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 */
router.put('/:id', validateDto(UpdatePermissionDto), PermissionController.update);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Permission deleted
 */
router.delete('/:id', PermissionController.delete);

export default router;
