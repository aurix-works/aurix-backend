import express from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos/permission.dto';

const router = express.Router();

router.use(protect);

router.get('/', PermissionController.getAll);
router.post('/', validateDto(CreatePermissionDto), PermissionController.create);
router.put('/:id', validateDto(UpdatePermissionDto), PermissionController.update);
router.delete('/:id', PermissionController.delete);

export default router;
