import { Router } from 'express';
import { SubOrgSubscriptionController } from '../controllers/sub-org-subscription.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dtos/sub-org-subscription.dto';

const router = Router();

router.use(protect);

router.get('/', SubOrgSubscriptionController.getAll);
router.post('/', validateDto(CreateSubscriptionDto), SubOrgSubscriptionController.create);
router.put('/:id', validateDto(UpdateSubscriptionDto), SubOrgSubscriptionController.update);
router.delete('/:id', SubOrgSubscriptionController.delete);

export default router;
