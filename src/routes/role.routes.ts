import express from 'express';
import { RoleController } from '../controllers/role.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';

const router = express.Router();

router.use(protect);

router.get('/', RoleController.getAll);
router.post('/', validateDto(CreateRoleDto), RoleController.create);
router.put('/:id', validateDto(UpdateRoleDto), RoleController.update);
router.delete('/:id', RoleController.delete);

export default router;
