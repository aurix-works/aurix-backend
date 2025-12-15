import { Router } from 'express';
import { SubOrganizationController } from '../controllers/sub-organization.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreateSubOrganizationDto, UpdateSubOrganizationDto } from '../dtos/sub-organization.dto';

const router = Router();

router.use(protect);

router.get('/', SubOrganizationController.getAll);
router.post('/', validateDto(CreateSubOrganizationDto), SubOrganizationController.create);
router.put('/:id', validateDto(UpdateSubOrganizationDto), SubOrganizationController.update);
router.delete('/:id', SubOrganizationController.delete);

export default router;
