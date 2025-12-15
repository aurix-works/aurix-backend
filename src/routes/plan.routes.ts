import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreatePlanDto, UpdatePlanDto } from '../dtos/plan.dto';

const router = Router();

router.use(protect);

router.get('/', PlanController.getAll);
router.post('/', validateDto(CreatePlanDto), PlanController.create);
router.put('/:id', validateDto(UpdatePlanDto), PlanController.update);
router.delete('/:id', PlanController.delete);

export default router;
