import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

import { validateDto } from '../middlewares/validation.middleware';
import { LoginDto } from '../dtos/auth.dto';

const router = Router();

router.post('/login', validateDto(LoginDto), AuthController.login);

export default router;
