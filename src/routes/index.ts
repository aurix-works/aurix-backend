import { Router } from 'express';
import authRoutes from './auth.routes';
import systemServiceRoutes from './system-service.routes';
import planRoutes from './plan.routes';
import organizationRoutes from './organization.routes';
import subOrganizationRoutes from './sub-organization.routes';
import subOrgSubscriptionRoutes from './sub-org-subscription.routes';
import departmentRoutes from './department.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import permissionRoutes from './permission.routes';
import leaveRoutes from './leave.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/services', systemServiceRoutes);
router.use('/plans', planRoutes);
router.use('/organizations', organizationRoutes);
router.use('/sub-organizations', subOrganizationRoutes);
router.use('/subscriptions', subOrgSubscriptionRoutes);
router.use('/departments', departmentRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/leave', leaveRoutes);

export default router;
