import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../schemas/task.schema.js';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', taskController.getAll);
router.get('/:id', validate(taskIdSchema), taskController.getById);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(taskIdSchema), validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(taskIdSchema), taskController.delete);

export default router;