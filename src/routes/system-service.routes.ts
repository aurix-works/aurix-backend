import { Router } from 'express';
import { SystemServiceController } from '../controllers/system-service.controller';
import { protect } from '../middlewares/auth.middleware';

import { validateDto } from '../middlewares/validation.middleware';
import { CreateSystemServiceDto, UpdateSystemServiceDto } from '../dtos/system-service.dto';

const router = Router();

router.use(protect);

router.get('/', SystemServiceController.getAll);
router.post('/', validateDto(CreateSystemServiceDto), SystemServiceController.create);
router.put('/:id', validateDto(UpdateSystemServiceDto), SystemServiceController.update);
router.delete('/:id', SystemServiceController.delete);

export default router;
