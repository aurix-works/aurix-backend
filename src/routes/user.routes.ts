import express from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

const router = express.Router();

router.use(protect);

router.get('/', UserController.getAll);
router.post('/', validateDto(CreateUserDto), UserController.create);
router.put('/:id', validateDto(UpdateUserDto), UserController.update);
router.delete('/:id', UserController.delete);

export default router;
