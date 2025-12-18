import express from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dtos/department.dto';

const router = express.Router();

router.use(protect);

router.get('/', DepartmentController.getAll);
router.post('/', validateDto(CreateDepartmentDto), DepartmentController.create);
router.put('/:id', validateDto(UpdateDepartmentDto), DepartmentController.update);
router.delete('/:id', DepartmentController.delete);

export default router;
