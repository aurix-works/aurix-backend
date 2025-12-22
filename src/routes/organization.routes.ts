import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos/organization.dto';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get('/', OrganizationController.getAll);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       201:
 *         description: Organization created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 */
router.post('/', validateDto(CreateOrganizationDto), OrganizationController.create);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update an organization
 *     tags: [Organizations]
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
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: Organization updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 */
router.put('/:id', validateDto(UpdateOrganizationDto), OrganizationController.update);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
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
 *         description: Organization deleted
 */
router.delete('/:id', OrganizationController.delete);

export default router;
