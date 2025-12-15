import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos/organization.dto';

const router = Router();

router.use(protect);

router.get('/', OrganizationController.getAll);
router.post('/', validateDto(CreateOrganizationDto), OrganizationController.create);
router.put('/:id', validateDto(UpdateOrganizationDto), OrganizationController.update);
router.delete('/:id', OrganizationController.delete);

export default router;
