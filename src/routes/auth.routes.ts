import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

export default router;